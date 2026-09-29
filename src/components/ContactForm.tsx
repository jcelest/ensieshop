const contactEmail = "ecelesister@gmail.com";
const successUrl = "https://www.ensieshop.com/contact/thanks";

export default function ContactForm() {
  return (
    <form
      action={`https://formsubmit.co/${contactEmail}`}
      method="POST"
      className="grid gap-5"
    >
      <input type="hidden" name="_subject" value="New EnsieShop contact message" />
      <input type="hidden" name="_next" value={successUrl} />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-2">
        <label htmlFor="name" className="text-xs font-semibold uppercase text-[var(--color-de-primary)]">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="min-h-12 border border-[#dce9e5] bg-white px-4 text-sm text-[var(--color-de-ink)] outline-none transition focus:border-[var(--color-de-primary)] focus:ring-2 focus:ring-[rgba(var(--color-de-primary-rgb),0.16)]"
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
          className="min-h-12 border border-[#dce9e5] bg-white px-4 text-sm text-[var(--color-de-ink)] outline-none transition focus:border-[var(--color-de-primary)] focus:ring-2 focus:ring-[rgba(var(--color-de-primary-rgb),0.16)]"
          placeholder="you@example.com"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="orderNumber" className="text-xs font-semibold uppercase text-[var(--color-de-primary)]">
          Order Number
        </label>
        <input
          id="orderNumber"
          name="order_number"
          type="text"
          className="min-h-12 border border-[#dce9e5] bg-white px-4 text-sm text-[var(--color-de-ink)] outline-none transition focus:border-[var(--color-de-primary)] focus:ring-2 focus:ring-[rgba(var(--color-de-primary-rgb),0.16)]"
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
          rows={6}
          className="min-h-40 resize-y border border-[#dce9e5] bg-white px-4 py-3 text-sm text-[var(--color-de-ink)] outline-none transition focus:border-[var(--color-de-primary)] focus:ring-2 focus:ring-[rgba(var(--color-de-primary-rgb),0.16)]"
          placeholder="How can we help?"
        />
      </div>

      <button
        type="submit"
        className="min-h-12 bg-[var(--color-de-primary)] px-6 text-sm font-semibold uppercase text-white transition hover:bg-[var(--color-de-accent-dark)]"
      >
        Send Message
      </button>
    </form>
  );
}
