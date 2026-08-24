import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Patungan Wishlist",
  description: "Wedding gift registry"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
