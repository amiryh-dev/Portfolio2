import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Copy,
  Check,
  Mail,
  MapPin,
  Phone,
  Linkedin,
} from "lucide-react";
import { PageIntro } from "../components/Layout";
import { apiRequest } from "../api";
import { usePortfolio } from "../context/PortfolioContext";
const emptyForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  message: "",
};
export default function Contact() {
  const { navigation, profile, copy } = usePortfolio();
  const content = copy.contact;
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const errorRef = useRef(null);
  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    if (error) setError("");
    if (submitted) setSubmitted(false);
  }
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    );
    if (
      !values.firstName ||
      !values.lastName ||
      !values.email ||
      !values.message
    ) {
      setError("Please complete the required fields.");
      setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    if (values.message.length < 10) {
      setError("Please add a little more detail (at least 10 characters).");
      setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await apiRequest("/api/contacts", {
        method: "POST",
        body: JSON.stringify({
          firstname: values.firstName,
          lastname: values.lastName,
          email: values.email,
          phone: values.phone,
          message: values.message,
        }),
      });
      setSubmitted(true);
      setForm(emptyForm);
    } catch (submitError) {
      setError(`${submitError.message} Please try again.`);
      setTimeout(() => errorRef.current?.focus(), 0);
    } finally {
      setSubmitting(false);
    }
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyState("Email copied");
    } catch {
      setCopyState("Copy the email address shown above.");
    }
  }
  return (
    <>
      <PageIntro
        number={navigation.find((item) => item.path === "/contact").number}
        eyebrow={content.eyebrow}
        title={
          <>
            {content.title[0]}
            <br />
            <span>{content.title[1]}</span>
          </>
        }
      >
        {content.intro}
      </PageIntro>
      <section className="contact-panel" aria-label="Contact information">
        <div className="email-row">
          <span className="contact-icon">
            <Mail size={20} />
          </span>
          <div className="min-w-0">
            <p className="contact-label">EMAIL</p>
            <a href={`mailto:${profile.email}`} className="email-address">
              {profile.email}
            </a>
          </div>
          <button
            className="icon-button ml-auto"
            aria-label="Copy email address"
            onClick={copyEmail}
          >
            {copyState === "Email copied" ? (
              <Check size={18} />
            ) : (
              <Copy size={18} />
            )}
          </button>
        </div>
        <span role="status" className="copy-status">
          {copyState}
        </span>
        <div className="contact-meta">
          <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>
            <Phone size={15} />
            {profile.phone}
          </a>
          <span>
            <MapPin size={15} />
            {profile.location}
          </span>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={15} />
            Let’s connect on LinkedIn
            <ArrowUpRight size={13} />
          </a>
        </div>
      </section>
      <section className="form-section">
        <h2>{content.formTitle}</h2>
        <p className="form-note">{content.formNote}</p>
        {submitted && (
          <p className="form-success" role="status">
            {content.submitted}
          </p>
        )}
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
            <div>
              <label htmlFor="firstName">
                First name <span>*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                value={form.firstName}
                onChange={update}
                required
                maxLength={60}
                placeholder="Your first name"
              />
            </div>
            <div>
              <label htmlFor="lastName">
                Last name <span>*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                value={form.lastName}
                onChange={update}
                required
                maxLength={60}
                placeholder="Your last name"
              />
            </div>
            <div>
              <label htmlFor="email">
                Email address <span>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={update}
                required
                maxLength={160}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone">
                Phone number <span className="optional">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={update}
                maxLength={30}
                placeholder="+1 (___) ___-____"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message">
                Your message <span>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={update}
                required
                minLength={10}
                maxLength={3000}
                rows={5}
                placeholder="Tell me a little about what you have in mind…"
                aria-describedby="message-help"
              />
              <div className="flex justify-between gap-3 mt-2">
                <span id="message-help" className="field-help">
                  A few details go a long way.
                </span>
                <span className="field-help">{form.message.length}/3000</span>
              </div>
            </div>
          </div>
          {error && (
            <p className="form-error" role="alert" ref={errorRef} tabIndex={-1}>
              {error}
            </p>
          )}
          <button type="submit" className="button-primary mt-7" disabled={submitting}>
            {submitting ? content.sending : content.submit}
            <ArrowUpRight size={18} />
          </button>
          <p className="privacy-note">
            {content.privacyNote}
          </p>
        </form>
      </section>
    </>
  );
}
