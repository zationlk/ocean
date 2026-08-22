import type { Metadata } from "next";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s | Admin – Ocean Lighting",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // No Toaster here — admin login has its own, admin pages use the one
  // provided by AdminLayoutClient for non-login admin routes.
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
