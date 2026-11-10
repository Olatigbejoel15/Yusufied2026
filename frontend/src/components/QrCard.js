"use client"; // The QR package draws in the browser

import { QRCodeSVG } from "qrcode.react"; // Draws the QR code as a sharp SVG
import { wedding } from "../config";

export default function QrCard() {
  const link = `${wedding.siteUrl}/upload`; // Address the QR code opens

  return (
    <div className="mx-auto mt-10 max-w-xs rounded-2xl border border-gold/20 bg-white p-6 text-center shadow-sm">
      <QRCodeSVG value={link} size={160} fgColor="#353a22" bgColor="#ffffff" className="mx-auto" />
      <p className="mt-4 text-xs uppercase tracking-widest text-gold">Scan to share your photos</p>
      {/* <p className="mt-1 break-all text-xs text-ink/60">{link}</p> */}
    </div>
  );
}