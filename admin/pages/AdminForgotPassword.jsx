import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, AuthShell, toast, apiUrl } from "../AdminShims";
import { Mail, ArrowLeft } from "lucide-react";
const AdminForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email) {
			toast.error("Please enter your admin email");
			return;
		}
		setLoading(true);
		try {
			const res = await fetch(apiUrl("/admin/forgot-password"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email })
			});
			const data = await res.json();
			setLoading(false);
			if (res.ok) {
				setSent(true);
				toast.success("Reset link sent to lascentstores@gmail.com");
			} else {
				toast.error(data.message || "Something went wrong");
			}
		} catch (err) {
			setLoading(false);
			toast.error("Failed to connect to server");
		}
	};
	return <AuthShell badge="Admin Recovery" title="Forgot admin password?" description="Enter your admin email. For security, the reset link will be sent to the primary business email (lascentstores@gmail.com)." accent="#ff6600" audience="admin">
		{sent ? <div className="space-y-6 text-center">
			<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
				<Mail className="h-8 w-8" />
			</div>
			<div className="space-y-2">
				<h3 className="text-xl font-semibold text-stone-900">Link Sent</h3>
				<p className="text-sm text-stone-600 leading-relaxed">
					We have sent the reset link to <strong>lascentstores@gmail.com</strong>.
					Please check that inbox and click the link to reset your password.
				</p>
			</div>
			<Link to="/login/admin" className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-700 font-semibold text-white transition hover:bg-blue-600">
				Back to Admin Login
			</Link>
		</div> : <form onSubmit={handleSubmit} className="space-y-5">
			<div className="space-y-2">
				<label className="text-sm font-medium text-stone-700">Your Admin Email</label>
				<Input type="email" placeholder="admin@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-2xl border-stone-300" required />
			</div>
			<Button type="submit" size="lg" className="h-12 w-full rounded-2xl bg-blue-700 text-white hover:bg-blue-600" disabled={loading}>
				{loading ? "Processing..." : "Send Reset Code"}
			</Button>
			<Link to="/login/admin" className="flex items-center justify-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900">
				<ArrowLeft className="h-4 w-4" /> Back to Login
			</Link>
		</form>}
	</AuthShell>;
};
export default AdminForgotPassword;
