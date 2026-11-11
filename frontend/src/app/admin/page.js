"use client"; // Runs in the browser, needed for forms and state

import { useCallback, useEffect, useState } from "react";
import { adminFetch, clearToken, getToken, saveToken } from "../../lib/admin";

const API = process.env.NEXT_PUBLIC_API_URL; // Laravel API address from .env.local

// Builds the list of page numbers to show, e.g. 1 ... 4 5 6 ... 12
function pageList(current, last) {
  const set = new Set([1, last, current - 1, current, current + 1]); // Pages worth showing
  const pages = [...set].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);
  const out = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push("gap"); // Insert "..." where pages are skipped
    out.push(p);
  });
  return out;
}

// Numbered page buttons
function Pager({ current, last, onChange }) {
  if (last <= 1) return null; // One page only: no buttons needed
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="rounded-full border border-ink/30 px-4 py-2 disabled:opacity-30"
      >
        Prev
      </button>
      {pageList(current, last).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-ink/50">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`h-10 w-10 rounded-full border ${
              p === current ? "border-ink bg-ink text-cream" : "border-ink/30 hover:border-gold"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === last}
        className="rounded-full border border-ink/30 px-4 py-2 disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
}

// Login form
function Login({ onLogin }) {
  const [email, setEmail] = useState(""); // Admin email
  const [password, setPassword] = useState(""); // Admin password
  const [error, setError] = useState(""); // Error shown under the form
  const [busy, setBusy] = useState(false); // True while logging in

  async function submit(e) {
    e.preventDefault(); // Stop the page reloading
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const json = await res.json();
        saveToken(json.token); // Remember the login
        onLogin();
      } else if (res.status === 429) {
        setError("Too many attempts. Please wait a minute and try again.");
      } else {
        setError("Wrong email or password.");
      }
    } catch (e) {
      setError("Could not reach the server.");
    }
    setBusy(false);
  }

  return (
    <main className="px-4 py-16">
      <form onSubmit={submit} className="mx-auto max-w-sm rounded-2xl border border-gold/20 bg-white p-6 shadow-sm">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-gold">Private</p>
        <h1 className="mt-2 text-center font-display text-3xl">Admin login</h1>
        <label className="mt-5 block text-sm text-ink/70">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gold/30 bg-cream px-4 py-3 text-base outline-none focus:border-gold"
        />
        <label className="mt-4 block text-sm text-ink/70">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gold/30 bg-cream px-4 py-3 text-base outline-none focus:border-gold"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-full bg-ink px-4 py-3 text-sm uppercase tracking-widest text-cream transition hover:bg-gold disabled:opacity-40"
        >
          {busy ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}

// The dashboard: photos and messages with numbered pages and delete buttons
function Dashboard({ onLogout }) {
  const [tab, setTab] = useState("photos"); // "photos" or "messages"
  const [page, setPage] = useState(1); // Current page number
  const [data, setData] = useState(null); // The paginator object from Laravel
  const [loading, setLoading] = useState(true); // True while a page is loading
  const [error, setError] = useState(""); // Error text shown above the list
  const [toDelete, setToDelete] = useState(null); // The item waiting for confirmation (null = no dialog)
  const [deleting, setDeleting] = useState(false); // True while the delete request is running
  const [confirmError, setConfirmError] = useState(""); // Error shown inside the dialog
  const [notice, setNotice] = useState(""); // "Photo deleted." message

  const endpoint = tab === "photos" ? "uploads" : "messages"; // Which API list to use

  // What kind of thing is in the dialog, used for the wording
  const kind = toDelete ? (tab === "messages" ? "message" : toDelete.type === "video" ? "video" : "photo") : "";

  // Loads the current page of the current tab
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminFetch(`/${endpoint}?page=${page}`);
      const json = await res.json();
      if (json.data.length === 0 && page > 1) {
        setPage(page - 1); // We deleted the last item on this page: go back one page
        return;
      }
      setData(json);
    } catch (e) {
      setError("Could not load. Check that the server is running.");
    }
    setLoading(false);
  }, [endpoint, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Hides the "deleted" message after 3 seconds
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  // Lets the Escape key close the dialog
  useEffect(() => {
    if (!toDelete) return;
    function onKey(e) {
      if (e.key === "Escape" && !deleting) setToDelete(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toDelete, deleting]);

  // Switches tab and goes back to page 1
  function switchTab(next) {
    setData(null);
    setPage(1);
    setTab(next);
  }

  // Opens the confirmation dialog for one item
  function askToDelete(item) {
    setConfirmError("");
    setToDelete(item);
  }

  // Runs when the admin confirms in the dialog
  async function confirmDelete() {
    if (!toDelete) return;
    const label = kind.charAt(0).toUpperCase() + kind.slice(1); // "Photo", "Video" or "Message"
    setDeleting(true);
    setConfirmError("");
    try {
      const res = await adminFetch(`/admin/${endpoint}/${toDelete.id}`, { method: "DELETE" });
      if (res.status === 401) {
        onLogout(); // The login has expired: back to the login form
        return;
      }
      if (res.ok) {
        setToDelete(null); // Close the dialog
        setNotice(`${label} deleted.`);
        load(); // Reload the current page
      } else {
        setConfirmError("Could not delete. Please try again.");
      }
    } catch (e) {
      setConfirmError("Could not reach the server.");
    }
    setDeleting(false);
  }

  // Logs out on the server, then forgets the token here
  async function logout() {
    try {
      await adminFetch("/admin/logout", { method: "POST" });
    } catch (e) {
      // Even if the server can't be reached, we still log out here
    }
    onLogout();
  }

  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl sm:text-4xl">Admin</h1>
          <button onClick={logout} className="text-sm uppercase tracking-widest text-gold underline">
            Log out
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2">
          {["photos", "messages"].map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`rounded-full px-6 py-2 text-sm uppercase tracking-widest ${
                tab === t ? "bg-ink text-cream" : "border border-ink/30"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {data && (
          <p className="mt-4 text-sm text-ink/60">
            {data.total} {tab} in total. Page {data.current_page} of {data.last_page}.
          </p>
        )}
        {notice && (
          <p role="status" className="mt-4 rounded-lg bg-sage/10 px-4 py-2 text-sm text-sage">
            {notice}
          </p>
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {loading && !data && <p className="mt-8 text-ink/60">Loading...</p>}

        {/* Photos tab */}
        {data && tab === "photos" && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {data.data.map((it) => (
              <div key={it.id} className="overflow-hidden rounded-xl border border-gold/20 bg-white shadow-sm">
                {it.type === "video" ? (
                  <video src={`${it.url}#t=0.1`} controls preload="metadata" className="aspect-square w-full object-cover" />
                ) : (
                  <a href={it.url} target="_blank" rel="noreferrer">
                    <img src={it.url} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                  </a>
                )}
                <div className="flex items-center justify-between gap-2 p-3 text-xs text-ink/70">
                  <div className="min-w-0">
                    <p className="truncate">{it.guest_name || "No name"}</p>
                    <p>{(it.size / 1048576).toFixed(1)} MB</p>
                  </div>
                  <button
                    onClick={() => askToDelete(it)}
                    className="shrink-0 rounded-full border border-red-200 px-3 py-1 text-xs text-red-700 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages tab */}
        {data && tab === "messages" && (
          <div className="mt-6 space-y-3">
            {data.data.map((m) => (
              <div key={m.id} className="rounded-xl border border-gold/20 bg-white p-4 shadow-sm">
                <p className="whitespace-pre-line text-ink/80">{m.body}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="font-display text-lg text-gold">{m.guest_name}</span>
                  <button
                    onClick={() => askToDelete(m)}
                    className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-700 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {data && data.data.length === 0 && <p className="mt-8 text-ink/60">Nothing here yet.</p>}

        {data && <Pager current={data.current_page} last={data.last_page} onChange={setPage} />}
      </div>

      {/* Confirmation dialog (inside the page, no browser pop-up) */}
      {toDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => !deleting && setToDelete(null)} // Clicking outside closes it
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(e) => e.stopPropagation()} // Clicks inside must not close it
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
          >
            {/* Preview of what is about to be deleted */}
            {kind === "photo" && (
              <img src={toDelete.url} alt="" className="mx-auto mb-4 h-32 w-32 rounded-lg object-cover" />
            )}
            {kind === "video" && (
              <video src={`${toDelete.url}#t=0.1`} preload="metadata" muted className="mx-auto mb-4 h-32 w-32 rounded-lg object-cover" />
            )}
            {kind === "message" && (
              <p className="mb-4 line-clamp-4 whitespace-pre-line rounded-lg bg-cream px-4 py-3 text-sm italic text-ink/70">
                {toDelete.body}
              </p>
            )}

            <h2 id="delete-title" className="font-display text-2xl">Delete this {kind}?</h2>
            <p className="mt-2 text-sm text-ink/70">
              It will be removed from the {kind === "message" ? "guest book" : "gallery"} for everyone. This cannot be undone.
            </p>

            {confirmError && <p className="mt-3 text-sm text-red-600">{confirmError}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="flex-1 rounded-full border border-ink/30 px-4 py-3 text-sm uppercase tracking-widest transition hover:border-ink disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 rounded-full bg-red-600 px-4 py-3 text-sm uppercase tracking-widest text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function AdminPage() {
  const [ready, setReady] = useState(false); // True once we have checked for a saved login
  const [authed, setAuthed] = useState(false); // True when the admin is logged in

  useEffect(() => {
    async function check() {
      if (getToken()) {
        try {
          const res = await adminFetch("/admin/me"); // Is the saved token still valid?
          if (res.ok) setAuthed(true);
          else clearToken(); // Expired or invalid: forget it
        } catch (e) {
          // Server unreachable: stay on the login form
        }
      }
      setReady(true);
    }
    if (API) check();
    else setReady(true);
  }, []);

  if (!API) {
    return <main className="px-4 py-16 text-center text-ink/70">The admin area is not connected yet.</main>;
  }
  if (!ready) return <main className="px-4 py-24 text-center text-ink/60">Loading...</main>;

  return authed ? (
    <Dashboard onLogout={() => { clearToken(); setAuthed(false); }} />
  ) : (
    <Login onLogin={() => setAuthed(true)} />
  );
}