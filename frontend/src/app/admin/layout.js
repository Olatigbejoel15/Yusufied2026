// Private page: asks search engines not to list it
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }) {
  return children;
}