import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Resume Reader",
  description: "Parse, analyze, and score your resume with AI. Get instant ATS compatibility checks, skill extraction, and job match scoring.",
  keywords: "resume, AI, ATS, job match, skill extraction, career",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
