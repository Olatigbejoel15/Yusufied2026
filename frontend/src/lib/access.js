// Helpers for the guest access code (saved in the browser)
const KEY = "wedding_access_code"; // Name under which the code is saved
let memory = ""; // Backup if the browser blocks storage (some private modes)

// Reads the saved code
export function getCode() {
  try {
    return localStorage.getItem(KEY) || memory;
  } catch (e) {
    return memory;
  }
}

// Saves the code for next time
export function saveCode(code) {
  memory = code;
  try {
    localStorage.setItem(KEY, code);
  } catch (e) {
    // Storage blocked: the in-memory copy still works for this visit
  }
}

// Forgets the saved code (when it is wrong or old)
export function clearCode() {
  memory = "";
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    // Nothing to do
  }
}

// fetch() that talks to Laravel and adds the code automatically
export function apiFetch(path, options = {}) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    cache: "no-store", // Never use a stale copy
    headers: {
      Accept: "application/json", // Ask for JSON
      "X-Access-Code": getCode(), // The guest's code
      ...(options.headers || {}), // Extra headers for a specific request
    },
  });
}