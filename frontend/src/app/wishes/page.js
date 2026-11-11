"use client"; // Runs in the browser, needed for forms and state

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL; // Laravel API address from .env.local

export default function WishesPage() {
  const [name, setName] = useState(""); // Guest's name
  const [body, setBody] = useState(""); // The message text
  const [sending, setSending] = useState(false); // True while the message is being sent
  const [error, setError] = useState(""); // Error text shown under the form
  const [sent, setSent] = useState(false); // True after a message was saved
  const [messages, setMessages] = useState([]); // All messages loaded so far
  const [page, setPage] = useState(1); // Last page we loaded
  const [hasMore, setHasMore] = useState(false); // True if Laravel has more pages
  const [loading, setLoading] = useState(true); // True until the first load finishes

  // Fetches one page of messages from Laravel
  async function fetchPage(p) {
    const res = await fetch(`${API}/messages?page=${p}`, {
      headers: { Accept: "application/json" }, // Ask for JSON
      cache: "no-store", // Always fresh data
    });
    return res.json();
  }

  useEffect(() => {
    if (!API) {
      setLoading(false); // No API address on this site yet
      return;
    }

    // First load: get page 1
    async function firstLoad() {
      try {
        const json = await fetchPage(1);
        setMessages(json.data); // Newest messages first
        setHasMore(json.next_page_url !== null); // Is there a next page?
      } catch (e) {
        console.error(e); // Log it so we can debug
      }
      setLoading(false);
    }
    firstLoad();

    // Every 20 seconds, add any new messages from other guests to the top
    const timer = setInterval(async () => {
      try {
        const json = await fetchPage(1);
        setMessages((prev) => {
          const known = new Set(prev.map((m) => m.id)); // IDs we already show
          return [...json.data.filter((m) => !known.has(m.id)), ...prev]; // New ones go first
        });
      } catch (e) {
        console.error(e); // The next check will retry
      }
    }, 20000);

    return () => clearInterval(timer); // Stop the timer when leaving the page
  }, []);

  // Loads older messages when the guest taps "Load more"
  async function loadMore() {
    const next = page + 1;
    const json = await fetchPage(next);
    setMessages((prev) => {
      const known = new Set(prev.map((m) => m.id)); // Avoid duplicates
      return [...prev, ...json.data.filter((m) => !known.has(m.id))]; // Older ones go at the bottom
    });
    setPage(next);
    setHasMore(json.next_page_url !== null);
  }

  // Sends the new message to Laravel
  async function handleSubmit(e) {
    e.preventDefault(); // Stop the browser reloading the page
    setError("");
    setSent(false);
    setSending(true);
    try {
      const res = await fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ guest_name: name, body }), // Field names Laravel expects
      });
      if (res.status === 201) {
        const created = await res.json(); // The saved message
        setMessages((prev) => [created, ...prev]); // Show it on the wall straight away
        setBody(""); // Clear the text box (the name stays for another message)
        setSent(true);
      } else if (res.status === 422) {
        const json = await res.json();
        setError(Object.values(json.errors)[0][0]); // First validation message from Laravel
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (e) {
      setError("Could not reach the server. Please check your connection."); // Network failure
    }
    setSending(false);
  }

  // Until the API address is set on the live site, show a friendly notice
  if (!API) {
    return (
      <main className="px-4 py-16 text-center">
        <h1 className="font-display text-4xl">Wishes open soon</h1>
        <p className="mt-4 text-ink/70">You will be able to leave a message for the couple here very soon.</p>
      </main>
    );
  }

  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-gold">Guest book</p>
        <h1 className="mt-2 text-center font-display text-4xl sm:text-5xl">Wishes for the couple</h1>
        <div className="mx-auto my-5 h-px w-16 bg-gold" />

        {/* Form card */}
        <form onSubmit={handleSubmit} className="mx-auto max-w-md rounded-2xl border border-gold/20 bg-white p-5 shadow-sm">
          <label className="block text-sm text-ink/70">Your name</label>
          <input
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gold/30 bg-cream px-4 py-3 text-base outline-none focus:border-gold"
          />

          <label className="mt-4 block text-sm text-ink/70">Your message</label>
          <textarea
            required
            rows={4}
            maxLength={1000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write something kind for the couple..."
            className="mt-1 w-full rounded-lg border border-gold/30 bg-cream px-4 py-3 text-base outline-none focus:border-gold"
          />
          <p className="mt-1 text-right text-xs text-ink/50">{body.length}/1000</p>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {sent && <p className="mt-3 text-sm text-sage">Thank you! Your message has been added.</p>}

          <button
            type="submit"
            disabled={sending}
            className="mt-4 w-full rounded-full bg-ink px-4 py-3 text-sm uppercase tracking-widest text-cream transition hover:bg-gold disabled:opacity-40"
          >
            {sending ? "Sending..." : "Send message"}
          </button>
        </form>

        {loading && <p className="mt-10 text-center text-ink/60">Loading...</p>}

        {!loading && messages.length === 0 && (
          <p className="mt-10 text-center text-ink/60">No messages yet. Be the first to write one.</p>
        )}

        {/* Wall of messages: 1 column on phones, 2 on larger screens */}
        <div className="mt-10 columns-1 gap-4 sm:columns-2">
          {messages.map((m) => (
            <div key={m.id} className="mb-4 break-inside-avoid rounded-2xl border border-gold/20 bg-white p-5 shadow-sm">
              <p className="whitespace-pre-line text-ink/80">{m.body}</p>
              <p className="mt-3 font-display text-xl text-gold">{m.guest_name}</p>
              <p className="text-xs text-ink/50">
                {new Date(m.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={loadMore}
            className="mx-auto mt-6 block rounded-full border border-ink px-8 py-3 text-sm uppercase tracking-widest transition hover:border-gold hover:text-gold"
          >
            Load more
          </button>
        )}
      </div>
    </main>
  );
}