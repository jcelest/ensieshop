"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Message failed to send.");
      }

      form.reset();
      setState("success");
      setMessage(data.message || "Message sent.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Message failed to send.");
    }
  }

  const disabled = state === "submitting";

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-2">
        <label htmlFor="name" className="text-xs font-semibold uppercase text-[var(--color-de-primary)]">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          disabled={disabled}
          className="min-h-12 border border-[#dce9e5] bg-white px-4 text-sm text-[var(--color-de-ink)] outline-none transition focus:border-[var(--color-de-primary)] focus:ring-2 focus:ring-[rgba(var(--color-de-primary-rgb),0.16)] disabled:opacity-60"
          placeholder="Your name"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="text-xs font-semibold uppercase text-[var(--color-de-primary)]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={disabled}
          className="min-h-12 border border-[#dce9e5] bg-white px-4 text-sm text-[var(--color-de-ink)] outline-none transition focus:border-[var(--color-de-primary)] focus:ring-2 focus:ring-[rgba(var(--color-de-primary-rgb),0.16)] disabled:opacity-60"
          placeholder="you@example.com"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="orderNumber" className="text-xs font-semibold uppercase text-[var(--color-de-primary)]">
          Order Number
        </label>
        <input
          id="orderNumber"
          name="orderNumber"
          type="text"
          disabled={disabled}
          className="min-h-12 border border-[#dce9e5] bg-white px-4 text-sm text-[var(--color-de-ink)] outline-none transition focus:border-[var(--color-de-primary)] focus:ring-2 focus:ring-[rgba(var(--color-de-primary-rgb),0.16)] disabled:opacity-60"
          placeholder="Optional"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="message" className="text-xs font-semibold uppercase text-[var(--color-de-primary)]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          disabled={disabled}
          rows={6}
          className="min-h-40 resize-y border border-[#dce9e5] bg-white px-4 py-3 text-sm text-[var(--color-de-ink)] outline-none transition focus:border-[var(--color-de-primary)] focus:ring-2 focus:ring-[rgba(var(--color-de-primary-rgb),0.16)] disabled:opacity-60"
          placeholder="How can we help?"
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="min-h-12 bg-[var(--color-de-primary)] px-6 text-sm font-semibold uppercase text-white transition hover:bg-[var(--color-de-accent-dark)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled ? "Sending..." : "Send Message"}
      </button>

      {message && (
        <p
          className={`border px-4 py-3 text-sm ${
            state === "success"
              ? "border-[rgba(var(--color-de-primary-rgb),0.28)] bg-[rgba(var(--color-de-primary-rgb),0.08)] text-[var(--color-de-primary)]"
              : "border-[#e56d46]/30 bg-[#e56d46]/10 text-[#9a3f24]"
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
