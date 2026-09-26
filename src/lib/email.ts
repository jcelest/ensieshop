import sgMail from "@sendgrid/mail";
import { Order, OrderItem } from "@prisma/client";
import { getSiteUrl } from "@/lib/site-url";
import { getShippingRateLabel, getShippingSettings } from "@/lib/shipping";
import { getCurrentTheme } from "@/lib/theme";

type OrderWithItems = Order & { items: OrderItem[] };

const BODY_FONT =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function getSendGrid(): typeof sgMail | null {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return null;
  sgMail.setApiKey(key);
  return sgMail;
}

function parseFromAddress(): { email: string; name: string } {
  const raw = process.env.SENDGRID_FROM_EMAIL || "EnsieShop <orders@ensieshop.com>";
  const match = raw.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) return { name: match[1].trim(), email: match[2].trim() };
  return { name: "EnsieShop", email: raw.trim() };
}

function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function addressHtml(order: Order): string {
  const line2 = order.addressLine2 ? `<br>${order.addressLine2}` : "";
  return `${order.customerName}<br>${order.addressLine1}${line2}<br>${order.city}, ${order.state} ${order.postalCode}<br>${order.country}`;
}

function trackingSearchUrl(trackingNumber: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`track package ${trackingNumber}`)}`;
}

function orderItemsHtml(items: OrderItem[]): string {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #dce9e5;color:#173533;font-size:14px;line-height:1.5;">
            ${item.name}${item.color ? ` <span style="color:#58706c;">(${item.color})</span>` : ""}
            <br><span style="color:#58706c;font-size:12px;">Option ${item.size} - Qty ${item.quantity}</span>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #dce9e5;color:#173533;font-size:14px;text-align:right;vertical-align:top;">
            ${formatMoney(item.price * item.quantity)}
          </td>
        </tr>`
    )
    .join("");
}

async function orderSummaryHtml(order: OrderWithItems): Promise<string> {
  const settings = await getShippingSettings();
  const shippingLabel = getShippingRateLabel(order.shippingMethod, settings);
  const accent = getCurrentTheme().primary;

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${orderItemsHtml(order.items)}
      <tr>
        <td style="padding:12px 0 6px;color:#58706c;font-size:13px;">Subtotal</td>
        <td style="padding:12px 0 6px;color:#173533;font-size:13px;text-align:right;">${formatMoney(order.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#58706c;font-size:13px;">Shipping (${shippingLabel})</td>
        <td style="padding:6px 0;color:#173533;font-size:13px;text-align:right;">${order.shippingCost === 0 ? "FREE" : formatMoney(order.shippingCost)}</td>
      </tr>
      <tr>
        <td style="padding:14px 0 0;color:${accent};font-size:13px;font-weight:700;">Total</td>
        <td style="padding:14px 0 0;color:${accent};font-size:18px;font-weight:700;text-align:right;">${formatMoney(order.total)}</td>
      </tr>
    </table>
  `;
}

function primaryButton(label: string, href: string, accent: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 0;">
      <tr>
        <td style="border-radius:999px;background-color:${accent};">
          <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function brandEmailHtml(options: {
  preheader: string;
  eyebrow: string;
  title: string;
  intro: string;
  contentHtml: string;
  cta?: { label: string; href: string };
}): string {
  const accent = getCurrentTheme().primary;
  const siteUrl = getSiteUrl();
  const year = new Date().getFullYear();
  const ctaHtml = options.cta ? primaryButton(options.cta.label, options.cta.href, accent) : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${options.title}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f7fbfa;color:#173533;font-family:${BODY_FONT};">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${options.preheader}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fbfa;">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border:1px solid #dce9e5;border-radius:8px;background-color:#ffffff;">
                <tr>
                  <td style="padding:34px 32px 26px;text-align:center;border-bottom:1px solid #dce9e5;">
                    <a href="${siteUrl}" style="display:inline-block;text-decoration:none;color:#173533;font-size:26px;font-weight:800;">
                      EnsieShop
                    </a>
                    <p style="margin:10px 0 0;font-size:13px;color:#58706c;">
                      Practical finds for everyday routines.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:${accent};">
                      ${options.eyebrow}
                    </p>
                    <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;color:#173533;">
                      ${options.title}
                    </h1>
                    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#58706c;">
                      ${options.intro}
                    </p>
                    ${options.contentHtml}
                    ${ctaHtml}
                  </td>
                </tr>
                <tr>
                  <td style="padding:22px 32px 28px;border-top:1px solid #dce9e5;text-align:center;">
                    <p style="margin:0;font-size:11px;line-height:1.6;color:#8ba09c;">
                      &copy; ${year} EnsieShop. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function trackingCard(trackingNumber: string, accent: string): string {
  const trackingUrl = trackingSearchUrl(trackingNumber);

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dce9e5;background-color:#f7fbfa;border-radius:8px;">
      <tr>
        <td style="padding:20px 22px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:${accent};">
            Tracking Number
          </p>
          <p style="margin:0;font-size:18px;line-height:1.4;color:#173533;word-break:break-all;">
            <a href="${trackingUrl}" style="color:#173533;text-decoration:none;font-weight:700;">
              ${trackingNumber}
            </a>
          </p>
          <p style="margin:10px 0 0;font-size:12px;line-height:1.5;color:#58706c;">
            Tap the number above to search for tracking updates.
          </p>
        </td>
      </tr>
    </table>
  `;
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const client = getSendGrid();
  if (!client) {
    console.warn("SENDGRID_API_KEY not set - skipping email");
    return;
  }

  const from = parseFromAddress();
  await client.send({ to, from, subject, html });
}

export async function sendOrderConfirmationEmail(order: OrderWithItems): Promise<void> {
  const shortId = order.id.slice(-8).toUpperCase();
  const summaryHtml = await orderSummaryHtml(order);
  const siteUrl = getSiteUrl();

  const contentHtml = `
    <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#58706c;">
      We have received your payment and will prepare your order for shipment.
    </p>
    <p style="margin:28px 0 12px;font-size:12px;font-weight:700;color:${getCurrentTheme().primary};">Order Summary</p>
    ${summaryHtml}
    <p style="margin:28px 0 12px;font-size:12px;font-weight:700;color:${getCurrentTheme().primary};">Shipping To</p>
    <p style="margin:0;font-size:14px;line-height:1.7;color:#58706c;">
      ${addressHtml(order)}
    </p>
  `;

  await sendEmail(
    order.email,
    `EnsieShop Order Confirmed - #${shortId}`,
    brandEmailHtml({
      preheader: `Your EnsieShop order #${shortId} is confirmed.`,
      eyebrow: `Order #${shortId}`,
      title: "Order Confirmed",
      intro: `Thanks for your order, ${order.customerName}.`,
      contentHtml,
      cta: { label: "Continue Shopping", href: `${siteUrl}/shop` },
    })
  );
}

export async function sendOrderShippedEmail(order: OrderWithItems): Promise<void> {
  const shortId = order.id.slice(-8).toUpperCase();
  const accent = getCurrentTheme().primary;
  const siteUrl = getSiteUrl();
  const trackingHtml = order.trackingNumber ? trackingCard(order.trackingNumber, accent) : "";

  const contentHtml = `
    ${trackingHtml}
    <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#58706c;">
      Thank you for shopping with EnsieShop.
    </p>
  `;

  const cta = order.trackingNumber
    ? { label: "Track Package", href: trackingSearchUrl(order.trackingNumber) }
    : { label: "Shop EnsieShop", href: `${siteUrl}/shop` };

  await sendEmail(
    order.email,
    `Your EnsieShop order has shipped - #${shortId}`,
    brandEmailHtml({
      preheader: `Your EnsieShop order #${shortId} is on the way.`,
      eyebrow: `Order #${shortId}`,
      title: "Your Order Has Shipped",
      intro: `Your order is on the way, ${order.customerName}.`,
      contentHtml,
      cta,
    })
  );
}

export async function sendOrderDeliveredEmail(order: OrderWithItems): Promise<void> {
  const shortId = order.id.slice(-8).toUpperCase();
  const siteUrl = getSiteUrl();

  const contentHtml = `
    <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#58706c;">
      Your package has arrived. We hope it makes your day a little easier.
    </p>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#58706c;">
      Thank you for shopping with EnsieShop.
    </p>
  `;

  await sendEmail(
    order.email,
    `Your EnsieShop order has been delivered - #${shortId}`,
    brandEmailHtml({
      preheader: `Your EnsieShop order #${shortId} has been delivered.`,
      eyebrow: `Order #${shortId}`,
      title: "Order Delivered",
      intro: `Your order has been delivered, ${order.customerName}.`,
      contentHtml,
      cta: { label: "Shop Again", href: `${siteUrl}/shop` },
    })
  );
}
