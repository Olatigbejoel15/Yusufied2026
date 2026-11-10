import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google"; // Free Google fonts
import "./globals.css";
import Navbar from "../components/Navbar"; // Top bar shown on every page
import { wedding } from "../config"; // Names for the browser tab title

// Elegant serif font for headings
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant", // CSS variable used in globals.css
});

// Clean sans-serif font for body text
const body = Jost({
  subsets: ["latin"],
  variable: "--font-jost", // CSS variable used in globals.css
});

// Browser tab title and description
export const metadata: Metadata = {
  title: `${wedding.hashtag} | Wedding Photos`,
  description: "Share and view photos from our wedding day.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <Navbar /> {/* Appears at the top of every page */}
        {children} {/* The current page goes here */}
      </body>
    </html>
  );
}

// Colours the browser bar on phones to match the page background
export const viewport = {
  themeColor: "#faf7ee",
};