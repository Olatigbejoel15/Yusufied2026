"use client"; // Needs the address bar and browser storage

import { useEffect, useState } from "react";
import { apiFetch, clearCode, getCode, saveCode } from "../lib/access";

// inline = true: wraps just one part of a page (like the wishes form) instead of the whole page
export default function AccessGate({ children, inline = false, title = "Enter the wedding code" }) {
  const hasApi = !!process.env.NEXT_PUBLIC_API_URL; // False on the live site until the backend is connected
  const [status, setStatus] = useState("checking"); // checking, locked, offline or open
  const [input, setInput] = useState(""); // What the guest types in the code box
  const [error, setError] = useState(""); // Message under the code box
  const [busy, setBusy] = useState(false); // True while a typed code is being checked
  const [retry, setRetry] = useState(0); // Increase to run the check again

  const Wrap = inline ? "div" : "main"; // Avoids a second <main> when used inside a page
  const space = inline ? "py-6" : "px-4 py-16"; // Less spacing when inline

  // Asks Laravel if a code is right: true, false, or null when the server can't be reached
  async function verify(code) {
    try {
      const res = await apiFetch("/access/check", { headers: { "X-Access-Code": code } });
      return res.ok;
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    if (!hasApi) return; // Nothing to check without a backend

    async function check() {
      const fromUrl = new URLSearchParams(window.location.search).get("code"); // Code from the QR link
      const candidate = fromUrl || getCode(); // Use the link's code first, otherwise the saved one

      if (!candidate) {
        setStatus("locked"); // No code at all: ask for it
        return;
      }

      const ok = await verify(candidate);
      if (ok === null) {
        setStatus("offline"); // Server unreachable
      } else if (ok) {
        saveCode(candidate); // Remember it for the next visit
        if (fromUrl) window.history.replaceState(null, "", window.location.pathname); // Remove the code from the address bar
        setStatus("open");
      } else {
        clearCode(); // Forget a wrong or old code
        if (fromUrl) setError("That code did not work. Please check it and try again.");
        setStatus("locked");
      }
    }
    check();
  }, [retry, hasApi]);

  // Runs when the guest submits the typed code
  async function handleSubmit(e) {
    e.preventDefault(); // Stop the page reloading
    setError("");
    setBusy(true);
    const ok = await verify(input.trim());
    setBusy(false);
    if (ok === null) {
      setError("Could not reach the server. Please try again.");
    } else if (ok) {
      saveCode(input.trim()); // Remember it for next time
      setStatus("open");
    } else {
      setError("That code did not work. Please check it and try again.");
    }
  }

  if (!hasApi) return <>{children}</>; // Live site before the backend exists: pages show their own notices
  if (status === "open") return <>{children}</>; // Code accepted: show the content

  if (status === "checking") {
    return <Wrap className={`${space} text-center text-ink/60`}>Checking...</Wrap>;
  }

  if (status === "offline") {
    return (
      <Wrap className={`${space} text-center`}>
        <p className="text-ink/70">We could not reach the server. Please check your connection.</p>
        <button
          onClick={() => { setStatus("checking"); setRetry((n) => n + 1); }}
          className="mt-4 rounded-full border border-ink px-8 py-3 text-sm uppercase tracking-widest"
        >
          Try again
        </button>
      </Wrap>
    );
  }

  // Locked: ask for the code
  return (
    <Wrap className={space}>
      <form onSubmit={handleSubmit} className="mx-auto max-w-sm rounded-2xl border border-gold/20 bg-white p-6 text-center shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Guests only</p>
        <h2 className="mt-2 font-display text-3xl">{title}</h2>
        <p className="mt-3 text-sm text-ink/70">You can find it on your table card, under the QR code.</p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Code"
          className="mt-5 w-full rounded-lg border border-gold/30 bg-cream px-4 py-3 text-center text-base uppercase tracking-widest outline-none focus:border-gold"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy || input.trim() === ""}
          className="mt-4 w-full rounded-full bg-ink px-4 py-3 text-sm uppercase tracking-widest text-cream transition hover:bg-gold disabled:opacity-40"
        >
          {busy ? "Checking..." : "Enter"}
        </button>
      </form>
    </Wrap>
  );
}