"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Phone, MessageSquare, Check, Trash2, MailOpen, Clock, Inbox } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  created_at: string;
  product_name?: string;
}

const STATUS_STYLES = {
  unread: "bg-red-50 text-red-600 border-red-200",
  read: "bg-yellow-50 text-yellow-600 border-yellow-200",
  replied: "bg-green-50 text-green-600 border-green-200",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [supabaseAvailable, setSupabaseAvailable] = useState(true);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase inquiries error:", error.message);
        setSupabaseAvailable(false);
      } else {
        setInquiries(data ?? []);
      }
    } catch (err) {
      console.warn("Supabase not available:", err);
      setSupabaseAvailable(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const selectedInquiry = inquiries.find((i) => i.id === selected) ?? null;

  const updateStatus = async (id: string, newStatus: Inquiry["status"]) => {
    // Optimistic update
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from("inquiries")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      toast.success(`Marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
      fetchInquiries(); // revert
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry? This cannot be undone.")) return;
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    if (selected === id) setSelected(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("inquiries").delete().eq("id", id);
      if (error) throw error;
      toast.success("Inquiry deleted");
    } catch {
      toast.error("Failed to delete");
      fetchInquiries(); // revert
    }
  };

  const unreadCount = inquiries.filter((i) => i.status === "unread").length;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 mt-3 text-sm">Loading inquiries…</p>
      </div>
    );
  }

  if (!supabaseAvailable) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">Inquiries</h2>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h3 className="font-semibold text-amber-800 mb-2">Supabase not connected</h3>
          <p className="text-amber-700 text-sm">
            To receive and manage customer inquiries, connect your Supabase database by adding{" "}
            <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            and{" "}
            <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            to your <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono">.env.local</code> file.
          </p>
          <p className="text-amber-600 text-xs mt-3">
            See <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local.example</code> for the required variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">Inquiries</h2>
          <p className="text-gray-500 text-sm">
            {unreadCount > 0 ? (
              <span className="text-red-600 font-medium">{unreadCount} unread</span>
            ) : (
              "All caught up"
            )}{" "}
            · {inquiries.length} total
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <Inbox size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">No inquiries yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Customer messages from the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-5">
          {/* List */}
          <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {inquiries.map((inquiry) => (
              <button
                key={inquiry.id}
                onClick={() => {
                  setSelected(inquiry.id);
                  if (inquiry.status === "unread") updateStatus(inquiry.id, "read");
                }}
                className={cn(
                  "w-full text-left bg-white rounded-xl border p-4 transition-all duration-200",
                  selected === inquiry.id
                    ? "border-teal-500 shadow-md ring-1 ring-teal-500/20"
                    : "border-gray-200 hover:border-teal-300",
                  inquiry.status === "unread" && "border-l-4 border-l-red-500"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-gray-900 text-sm truncate">
                    {inquiry.name}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full border shrink-0",
                      STATUS_STYLES[inquiry.status] ?? STATUS_STYLES.unread
                    )}
                  >
                    {inquiry.status}
                  </span>
                </div>
                <div className="text-xs text-teal-600 font-medium mb-1.5 capitalize">
                  {inquiry.subject.replace(/-/g, " ")}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{inquiry.message}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                  <Clock size={11} />
                  {formatDate(inquiry.created_at)}
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {selectedInquiry ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 sticky top-20">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {selectedInquiry.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full border",
                          STATUS_STYLES[selectedInquiry.status] ?? STATUS_STYLES.unread
                        )}
                      >
                        {selectedInquiry.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(selectedInquiry.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {selectedInquiry.status !== "read" && selectedInquiry.status !== "replied" && (
                      <button
                        onClick={() => updateStatus(selectedInquiry.id, "read")}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <MailOpen size={16} />
                      </button>
                    )}
                    {selectedInquiry.status !== "replied" && (
                      <button
                        onClick={() => updateStatus(selectedInquiry.id, "replied")}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as replied"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteInquiry(selectedInquiry.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors bg-gray-50 rounded-xl px-3 py-2.5"
                  >
                    <Mail size={14} className="text-teal-600 shrink-0" />
                    <span className="truncate">{selectedInquiry.email}</span>
                  </a>
                  {selectedInquiry.phone && (
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors bg-gray-50 rounded-xl px-3 py-2.5"
                    >
                      <Phone size={14} className="text-teal-600 shrink-0" />
                      <span className="truncate">{selectedInquiry.phone}</span>
                    </a>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Subject
                  </p>
                  <p className="text-sm text-gray-900 capitalize font-medium">
                    {selectedInquiry.subject.replace(/-/g, " ")}
                  </p>
                  {selectedInquiry.product_name && (
                    <p className="text-xs text-teal-600 mt-0.5">
                      Product: {selectedInquiry.product_name}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Message
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Reply actions */}
                <div className="flex flex-wrap gap-3 pt-1 border-t border-gray-100">
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                    onClick={() => updateStatus(selectedInquiry.id, "replied")}
                    className="flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <Mail size={16} />
                    Reply via Email
                  </a>
                  {selectedInquiry.phone && (
                    <a
                      href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${selectedInquiry.name}, thank you for your inquiry about ${selectedInquiry.subject.replace(/-/g, " ")}. `)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => updateStatus(selectedInquiry.id, "replied")}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                    >
                      <MessageSquare size={16} />
                      Reply via WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Select an inquiry to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
