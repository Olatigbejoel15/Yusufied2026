"use client"; // Runs in the browser, needed for state and file picking

import Link from "next/link";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL; // Laravel API address from .env.local

export default function UploadPage() {
  const [name, setName] = useState(""); // Guest's name
  const [items, setItems] = useState([]); // Picked files with progress and status
  const [busy, setBusy] = useState(false); // True while uploading

  // Updates one file's progress or status without touching the others
  function update(index, changes) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...changes } : it)));
  }

  // Runs when the guest picks files
  function handlePick(e) {
    const files = Array.from(e.target.files); // Turn the FileList into a normal array
    setItems(files.map((file) => ({ file, progress: 0, status: "waiting" }))); // Every file starts at 0%
  }

  // Sends one file to Laravel and tracks its progress
  function uploadOne(item, index) {
    return new Promise((resolve) => {
      const form = new FormData(); // Builds the multipart form Laravel expects
      form.append("guest_name", name); // Guest's name
      form.append("files[]", item.file); // The file itself

      const xhr = new XMLHttpRequest(); // XHR reports upload progress, fetch can't
      xhr.open("POST", `${API}/uploads`); // POST to the Laravel route
      xhr.setRequestHeader("Accept", "application/json"); // Ask for JSON errors

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          update(index, { progress: Math.round((e.loaded / e.total) * 100) }); // Percent sent so far
        }
      };

      xhr.onload = () => {
        // 201 means Laravel saved the file
        update(index, xhr.status === 201 ? { status: "done", progress: 100 } : { status: "error" });
        resolve(); // Move on to the next file
      };

      xhr.onerror = () => {
        update(index, { status: "error" }); // Network failure
        resolve();
      };

      xhr.send(form); // Start the upload
    });
  }

  // Uploads all picked files one after another
  async function handleUpload() {
    setBusy(true);
    for (let i = 0; i < items.length; i++) {
      if (items[i].status === "done") continue; // Skip files already uploaded
      update(i, { status: "uploading" });
      await uploadOne(items[i], i); // Wait for this file before starting the next
    }
    setBusy(false);
  }

  const allDone = items.length > 0 && items.every((it) => it.status === "done"); // True when everything uploaded
  // Until the API address is set on the live site, show a friendly notice instead of a broken form
    if (!API) {
    return (
        <main className="px-4 py-16 text-center">
        <h1 className="font-display text-4xl">Uploads open soon</h1>
        <p className="mt-4 text-ink/70">Photo uploads will open on the wedding day. Please check back then.</p>
        </main>
    );
    }

  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-md">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-gold">Guest uploads</p>
        <h1 className="mt-2 text-center font-display text-4xl sm:text-5xl">Share your memories</h1>
        <div className="mx-auto my-5 h-px w-16 bg-gold" />
        <p className="text-center text-ink/70">
          Add the photos and videos you took at the wedding.
        </p>

        {/* White card holding the whole form */}
        <div className="mt-8 rounded-2xl border border-gold/20 bg-white p-5 shadow-sm">
          {/* Name field (text-base stops iPhones zooming in on focus) */}
          <label className="block text-sm text-ink/70">Your name</label>
          <input
            type="text"
            placeholder="Optional"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gold/30 bg-cream px-4 py-3 text-base outline-none focus:border-gold"
          />

          {/* The whole box is a label, so tapping it opens the phone's file picker */}
          <label className="mt-5 block cursor-pointer rounded-xl border-2 border-dashed border-gold/40 bg-blush/40 px-4 py-8 text-center transition hover:bg-blush/70">
            {/* Simple upload icon */}
            <svg className="mx-auto h-8 w-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            <span className="mt-2 block font-medium">Tap to choose photos or videos</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handlePick}
              className="hidden"
            />
          </label>

          {/* One row per picked file, with a progress bar */}
          <ul className="mt-4 space-y-3">
            {items.map((it, i) => (
              <li key={i} className="rounded-lg bg-cream p-3">
                <div className="flex justify-between text-sm">
                  <span className="truncate pr-2">{it.file.name}</span>
                  <span className={it.status === "error" ? "text-red-600" : "text-ink/60"}>
                    {it.status === "done" && "Done"}
                    {it.status === "error" && "Failed"}
                    {it.status === "uploading" && `${it.progress}%`}
                    {it.status === "waiting" && "Waiting"}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded bg-gold/20">
                  <div
                    className={`h-full transition-all ${
                      it.status === "error" ? "bg-red-500" : it.status === "done" ? "bg-sage" : "bg-gold"
                    }`}
                    style={{ width: `${it.progress}%` }} // Bar width follows progress
                  />
                </div>
              </li>
            ))}
          </ul>

          {allDone && (
            <p className="mt-4 text-center font-medium text-sage">
              All uploaded. Thank you!{" "}
              <Link href="/gallery" className="underline">
                See the gallery
              </Link>
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={busy || items.length === 0 || allDone}
            className="mt-5 w-full rounded-full bg-ink px-4 py-3 text-sm uppercase tracking-widest text-cream transition hover:bg-gold disabled:opacity-40"
          >
            {busy ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </main>
  );
}