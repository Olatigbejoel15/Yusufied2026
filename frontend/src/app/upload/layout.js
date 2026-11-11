import AccessGate from "../../components/AccessGate";

// Asks search engines not to list this page
export const metadata = { robots: { index: false, follow: false } };

// Uploading is only possible after the guest's code is accepted
export default function UploadLayout({ children }) {
  return <AccessGate>{children}</AccessGate>;
}