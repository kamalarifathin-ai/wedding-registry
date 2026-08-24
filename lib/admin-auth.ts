import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "registry_admin";
const maxAge = 60 * 60 * 24 * 7;

function signature(value: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function adminCookie() {
  const token = `admin.${Math.floor(Date.now() / 1000) + maxAge}`;
  const sig = signature(token);
  return sig ? `${token}.${sig}` : null;
}

export function isAdmin(value?: string) {
  if (!value) return false;
  const pieces = value.split(".");
  if (pieces.length !== 3 || pieces[0] !== "admin" || Number(pieces[1]) * 1000 < Date.now()) return false;
  const expected = signature(`${pieces[0]}.${pieces[1]}`);
  return Boolean(expected && pieces[2].length === expected.length && timingSafeEqual(Buffer.from(pieces[2]), Buffer.from(expected)));
}

export const adminCookieName = COOKIE;
export const adminCookieMaxAge = maxAge;
