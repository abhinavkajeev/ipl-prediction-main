import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IPL Match Predictor | Data Analysis & Winner Prediction",
  description: "AI-powered IPL match analysis and winner prediction using machine learning. Explore team stats, venue analytics, and predict match outcomes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>{children}</div>
      </body>
    </html>
  );
}
