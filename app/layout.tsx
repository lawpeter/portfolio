import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { TelemetryBeacon } from "@/components/TelemetryBeacon";
import "./globals.css";

// §5.3 — centralized font declarations, referenced everywhere via CSS variable.
// IBM Plex Mono pinned to 500: regular 400 reads too thin at data sizes.
const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: "500",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://peterlaw.dev"),
  title: "Peter Law | Mechanical Engineering + Computer Science",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Peter Law", images: ["/opengraph-image"] },
  description:
    "Peter Law: Mechanical Engineering + Computer Science at UH Mānoa. Simulation, embedded systems, physical builds, and integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plexMono.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <TelemetryBeacon />
        {children}
      </body>
    </html>
  );
}
