import type { Metadata } from "next";
import "./globals.css";
import ParticleBackground from "@/components/background/ParticleBackground";

export const metadata: Metadata = {
  title: "Realms of Chemistry // Solo Leveling System Interface (CBSE Class 12)",
  description:
    "Official website for 'Realms of Chemistry' by Awakened Games (Created by Solo Developer Daniel). Master CBSE Class 12 Chemistry with interactive chapter checklists, PYQ boss raids, formula arena, and student status tracker.",
  keywords: [
    "Realms of Chemistry",
    "Awakened Games",
    "Solo Developer Daniel",
    "CBSE Class 12 Chemistry",
    "Solo Leveling System Interface",
    "Chemistry Archives",
    "Nernst Equation",
    "Organic Chemistry Reactions",
    "Next.js",
    "Three.js",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-black">
      <body className="bg-black text-slate-100 min-h-screen relative overflow-x-hidden antialiased">
        {/* Three.js Particle Background */}
        <ParticleBackground />

        {/* Scanline CRT / Hologram effect overlay behind content */}
        <div className="fixed inset-0 pointer-events-none z-0 scanline-overlay opacity-15" />

        {/* Dynamic content */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
