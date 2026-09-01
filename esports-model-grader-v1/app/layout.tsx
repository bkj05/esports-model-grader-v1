import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Esports Model Grader",
  description: "CS2 prop projection and grading dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
