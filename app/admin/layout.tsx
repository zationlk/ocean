import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Panel – Ocean Lighting Solutions",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminLayoutClient>{children}</AdminLayoutClient>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#006060",
            color: "#fff",
            borderRadius: "8px",
          },
        }}
      />
    </>
  );
}
