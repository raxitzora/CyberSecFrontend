// app/layout.tsx
import "./globals.css";
import { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Cybersecurity AI Chatbot | Raxit Zora",
  description: "Interact with the Cybersecurity AI chatbot created by Raxit Zora. Get cybersecurity solutions, ethical hacking tips, and AI insights in real-time.",
  keywords: ["cybersecurity", "AI chatbot", "ethical hacking", "Raxit Zora", "cybersecurity AI","AI engineering","AI engineering project","Fullstack aiengineering project","fastapi","python and nextjs","typescript and python"],
  authors: [{ name: "Raxit Zora" }],
  openGraph: {
    title: "CyberSec AI Chatbot",
    description: "Interact with the Cybersecurity AI chatbot created by Raxit Zora.",
    url: "https://cybersecurityai.vercel.app/",
    siteName: "Cybersecurity AI Chatbot",
    images: [
      {
        url: "https://cybersecurityai.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}</body>
    </html>
  );
}
