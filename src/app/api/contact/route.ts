import { NextRequest, NextResponse } from "next/server";

const contactEmail = "ecelesister@gmail.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { message: "Contact form is not configured yet." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const botcheck = formData.get("botcheck");

  if (botcheck) {
    return NextResponse.json({ message: "Message sent." });
  }

  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const orderNumber = readField(formData, "orderNumber");
  const message = readField(formData, "message");

  if (!name || !email || !message) {
    return NextResponse.json(
      { message: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  if (message.length > 3000) {
    return NextResponse.json(
      { message: "Please keep the message under 3,000 characters." },
      { status: 400 }
    );
  }

  const web3Response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      from_name: "EnsieShop Contact Form",
      subject: `EnsieShop contact from ${name}`,
      name,
      email,
      replyto: email,
      order_number: orderNumber || "Not provided",
      message,
      inbox: contactEmail,
    }),
  });

  const web3Result = (await web3Response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!web3Response.ok || !web3Result.success) {
    return NextResponse.json(
      { message: web3Result.message || "Message failed to send." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    message: "Thanks. Your message has been sent.",
  });
}
