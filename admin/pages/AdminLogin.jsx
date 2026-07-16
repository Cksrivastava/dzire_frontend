import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { apiUrl, getAuthToken, useAuth } from "../AdminShims";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { adminUser, syncUser } = useAuth();

  useEffect(() => {
    const adminToken = getAuthToken("admin");
    if (adminUser?.role === "admin" && adminToken) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [adminUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: username,
          password,
          audience: "admin",
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.token) {
        setError(data.message || "Admin login failed");
        return;
      }

      if (data.user.role !== "admin") {
        setError("This account does not have admin access");
        return;
      }

      syncUser(data.user, {
        token: data.token,
        scope: "admin",
      });
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card" aria-label="Admin login">
        <form onSubmit={handleLogin} className="admin-login-form">
          <label className="admin-login-field">
            <span>Username</span>
            <div className="admin-login-input">
              <UserRound size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="admin-login-field">
            <span>Password</span>
            <div className="admin-login-input">
              <LockKeyhole size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-login-eye"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error ? <p className="admin-login-error">{error}</p> : null}

          <button type="submit" className="admin-login-submit" disabled={loading}>
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        <div className="admin-login-links">
          <Link to="/admin/forgot-password">Forgot password?</Link>
          <Link to="/login">Customer login</Link>
        </div>
      </section>
    </main>
  );
};

export default AdminLogin;
