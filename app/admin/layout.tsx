import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Panel – OCEAN",
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
            background: "#D4AF37",
            color: "#0F0F11",
            borderRadius: "12px",
            fontWeight: "bold",
          },
        }}
      />
    </>
  );
}
