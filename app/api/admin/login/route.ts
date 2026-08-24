import { NextResponse } from "next/server";
import { adminCookie, adminCookieMaxAge, adminCookieName } from "../../../../lib/admin-auth";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Password salah" }, { status: 401 });
  const value = adminCookie();
  if (!value) return NextResponse.json({ error: "SESSION_SECRET belum diatur" }, { status: 500 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: adminCookieMaxAge });
  return response;
}
