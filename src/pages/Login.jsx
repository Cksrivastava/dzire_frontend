import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import AuthHeader from "../components/auth/AuthHeader";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpForm";
import AuthBenefits from "../components/auth/AuthBenefits";
import LoggedInCard from "../components/auth/LoggedInCard";
import "./Login.css";

const Login = ({ initialMode }) => {
  const { user, loginUser, registerUser, logoutUser } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/profile";

  const isRegisterRoute =
    location.pathname === "/register" ||
    location.pathname === "/signup" ||
    searchParams.get("mode") === "signup";

  const [authMode, setAuthMode] = useState(
    initialMode || (isRegisterRoute ? "signup" : "signin")
  );

  useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
    } else if (isRegisterRoute) {
      setAuthMode("signup");
    }
  }, [initialMode, isRegisterRoute]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  const handleSwitchTab = (mode) => {
    setAuthMode(mode);
    setError(null);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);

    const email = signInData.email?.trim();
    const password = signInData.password;

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await loginUser(email, password);
      navigate(redirectTo);
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    const name = signUpData.name?.trim();
    const email = signUpData.email?.trim();
    const password = signUpData.password;

    if (!name || !email || !password) {
      setError("Please fill in all fields to create your account.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password });
      navigate(redirectTo);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <AuthHeader onBack={handleBack} />

        {!user ? (
          <div className="auth-card">
            <h1 className="auth-title">
              {authMode === "signin" ? "Login" : "Create Account"}
            </h1>

            <div className="auth-main-tabs">
              <button
                className={authMode === "signin" ? "active" : ""}
                onClick={() => handleSwitchTab("signin")}
                type="button"
              >
                Sign In
              </button>
              <button
                className={authMode === "signup" ? "active" : ""}
                onClick={() => handleSwitchTab("signup")}
                type="button"
              >
                Sign Up
              </button>
            </div>

            {authMode === "signin" ? (
              <SignInForm
                signInData={signInData}
                setSignInData={(data) => {
                  setSignInData(data);
                  if (error) setError(null);
                }}
                onSubmit={handleSignIn}
                onSwitchToSignUp={() => handleSwitchTab("signup")}
                loading={loading}
                error={error}
              />
            ) : (
              <SignUpForm
                signUpData={signUpData}
                setSignUpData={(data) => {
                  setSignUpData(data);
                  if (error) setError(null);
                }}
                onSubmit={handleSignUp}
                onSwitchToSignIn={() => handleSwitchTab("signin")}
                loading={loading}
                error={error}
              />
            )}

            <AuthBenefits onPrivacyClick={() => navigate("/privacy")} />
          </div>
        ) : (
          <LoggedInCard
            user={user}
            onGoHome={() => navigate("/")}
            onLogout={logoutUser}
          />
        )}
      </div>
    </div>
  );
};

export default Login;