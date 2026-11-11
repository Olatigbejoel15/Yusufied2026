// Public page (reading messages), but asks search engines not to list it
export const metadata = { robots: { index: false, follow: false } };

export default function WishesLayout({ children }) {
  return children; // The code is only asked for when someone wants to write a message
}