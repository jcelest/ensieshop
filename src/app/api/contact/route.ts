import { NextRequest, NextResponse } from "next/server";
import {
  isEmailConfigured,
  sendContactNotificationEmail,
} from "@/lib/email";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  if (readField(formData, "botcheck")) {
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

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { message: "Email notifications are not configured yet." },
      { status: 503 }
    );
  }

  try {
    await sendContactNotificationEmail({ name, email, orderNumber, message });
    return NextResponse.json({ message: "Message sent." });
  } catch (error) {
    console.error("Contact email failed:", error);
    return NextResponse.json(
      { message: "Email notification failed. Please try again." },
      { status: 502 }
    );
  }
}
