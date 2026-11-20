import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const { signIn, user, checking } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const destination = location.state?.from || "/dashboard";

  if (!checking && user) {
    return <Navigate to={destination} replace />;
  }

  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signIn(form.email.trim(), form.password);
      navigate(destination, { replace: true });
    } catch (signInError) {
      setError(signInError.message || "Could not sign in.");
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
          <LockKeyhole size={20} />
        </span>
        <h1>Sign in</h1>
        <p className="form-note">
          Sign in to open the dashboard. Admins can edit the content; other
          accounts can view it.
        </p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={submit} className="auth-form">
          <div>
            <label htmlFor="signin-email">Email address</label>
            <input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="username"
              value={form.email}
              onChange={update}
              required
            />
          </div>
          <div>
            <label htmlFor="signin-password">Password</label>
            <input
              id="signin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={update}
              required
            />
          </div>
          <button className="button-primary w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="auth-switch">
          No account yet? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
