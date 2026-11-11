// Public page, but asks search engines not to list it
export const metadata = { robots: { index: false, follow: false } };

export default function GalleryLayout({ children }) {
  return children; // No code needed to look at the gallery
}