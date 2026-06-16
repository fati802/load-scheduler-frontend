import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auto Load Scheduler",
  description: "Automated Home Electrical Load Scheduler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}