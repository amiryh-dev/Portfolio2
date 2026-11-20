import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

const EMPTY = { name: "", email: "", password: "", confirm: "" };

export default function SignUp() {
  const { signIn, user, checking } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!checking && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("The passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const email = form.email.trim();
      await apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify({ name: form.name.trim(), email, password: form.password }),
      });
      // Sign the new user in straight away.
      await signIn(email, form.password);
      navigate("/dashboard", { replace: true });
    } catch (signUpError) {
      setError(signUpError.message || "Could not create the account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-back">
          <ArrowLeft size={15} /> Back to the site
        </Link>
        <span className="auth-icon">
          <UserPlus size={20} />
        </span>
        <h1>Create an account</h1>
        <p className="form-note">
          New accounts can sign in and view the dashboard. Only admins can make
          changes.
        </p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={submit} className="auth-form">
          <div>
            <label htmlFor="signup-name">Name</label>
            <input
              id="signup-name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={update}
              required
              maxLength={80}
            />
          </div>
          <div>
            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update}
              required
            />
          </div>
          <div>
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={update}
              required
              minLength={6}
            />
            <p className="field-help mt-2">At least 6 characters.</p>
          </div>
          <div>
            <label htmlFor="signup-confirm">Confirm password</label>
            <input
              id="signup-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={update}
              required
            />
          </div>
          <button className="button-primary w-full" disabled={busy}>
            {busy ? "Creating account…" : "Sign up"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
