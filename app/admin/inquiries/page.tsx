"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Phone, MessageSquare, Check, Trash2, MailOpen, Clock, Inbox, Search, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

const STATUS = {
  unread:  { label: "Unread",  cls: "bg-red-500/10 text-red-400 border-red-500/20" },
  read:    { label: "Read",    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  replied: { label: "Replied", cls: "bg-green-500/10 text-green-400 border-green-500/20" },
};

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(s: string) {
  return new Date(s).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function InquiriesPage() {
  const [inquiries, setInquiries]   = useState<Inquiry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<string | null>(null);
  const [noSupabase, setNoSupabase] = useState(false);
  const [search, setSearch]         = useState("");

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const sb = createSupabaseBrowserClient();
      const { data, error } = await sb.from("inquiries").select("*").order("created_at", { ascending: false });
      if (error) { setNoSupabase(true); }
      else { setInquiries(data ?? []); }
    } catch { setNoSupabase(true); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const updateStatus = async (id: string, s: Inquiry["status"]) => {
    setInquiries(p => p.map(i => i.id === id ? { ...i, status: s } : i));
    try {
      const sb = createSupabaseBrowserClient();
      const { error } = await sb.from("inquiries").update({ status: s }).eq("id", id);
      if (error) throw error;
      toast.success(`Marked as ${s}`);
    } catch { toast.error("Failed"); fetchInquiries(); }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    setInquiries(p => p.filter(i => i.id !== id));
    if (selected === id) setSelected(null);
    try {
      const sb = createSupabaseBrowserClient();
      await sb.from("inquiries").delete().eq("id", id);
      toast.success("Deleted");
    } catch { toast.error("Failed"); fetchInquiries(); }
  };

  const current   = inquiries.find(i => i.id === selected) ?? null;
  const unread    = inquiries.filter(i => i.status === "unread").length;
  const filtered  = inquiries.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.subject.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (noSupabase) return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Inquiries</h2>
        <p className="text-white/40 text-sm mt-0.5">Customer contact form submissions</p>
      </div>
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl p-6">
        <h3 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
          <MessageSquare size={16} /> Supabase not connected
        </h3>
        <p className="text-amber-400/70 text-sm leading-relaxed">
          Add <code className="bg-amber-500/10 px-1.5 py-0.5 rounded font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="bg-amber-500/10 px-1.5 py-0.5 rounded font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          to your <code className="bg-amber-500/10 px-1.5 py-0.5 rounded font-mono text-xs">.env.local</code> file.
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Inquiries</h2>
          <p className="text-white/40 text-sm mt-0.5">
            {unread > 0 ? <span className="text-red-400 font-medium">{unread} unread · </span> : null}
            {inquiries.length} total
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-16 text-center">
          <Inbox size={36} className="mx-auto mb-3 text-white/15" />
          <p className="text-white/40 font-medium">No inquiries yet</p>
          <p className="text-white/20 text-sm mt-1 font-light">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-5">
          {/* List panel */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-[#0d0d10] text-white border border-white/8 rounded-xl text-sm outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/8 transition-all placeholder:text-white/20"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-0.5">
              <AnimatePresence>
                {filtered.map(inquiry => (
                  <motion.button
                    key={inquiry.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setSelected(inquiry.id);
                      if (inquiry.status === "unread") updateStatus(inquiry.id, "read");
                    }}
                    className={cn(
                      "w-full text-left rounded-xl border p-4 transition-all duration-200",
                      selected === inquiry.id
                        ? "bg-gold/6 border-gold/25"
                        : "bg-[#0d0d10] border-white/5 hover:border-white/12",
                      inquiry.status === "unread" && "border-l-2 border-l-red-500"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-white/80 text-sm truncate">
                        {inquiry.name}
                        {inquiry.status === "unread" && (
                          <span className="ml-2 inline-block w-1.5 h-1.5 bg-red-500 rounded-full align-middle" />
                        )}
                      </span>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0", STATUS[inquiry.status]?.cls)}>
                        {STATUS[inquiry.status]?.label}
                      </span>
                    </div>
                    <div className="text-xs text-gold/60 font-medium mb-1 capitalize truncate">
                      {inquiry.subject.replace(/-/g, " ")}
                    </div>
                    <p className="text-[11px] text-white/30 line-clamp-1">{inquiry.message}</p>
                    <div className="flex items-center gap-1 text-[10px] text-white/20 mt-2">
                      <Clock size={10} /> {fmtDate(inquiry.created_at)} · {fmtTime(inquiry.created_at)}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <div className="text-center py-8 text-white/25 text-sm">No results for &ldquo;{search}&rdquo;</div>
              )}
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {current ? (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#0d0d10] rounded-2xl border border-white/6 overflow-hidden sticky top-20"
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
                >
                  {/* Detail header */}
                  <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/5">
                    <div>
                      <h3 className="font-semibold text-white text-base">{current.name}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", STATUS[current.status]?.cls)}>
                          {STATUS[current.status]?.label}
                        </span>
                        <span className="text-[11px] text-white/25">
                          {fmtDate(current.created_at)} at {fmtTime(current.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {current.status === "unread" && (
                        <button onClick={() => updateStatus(current.id, "read")}
                          className="p-2 text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/8 rounded-lg transition-colors" title="Mark as read">
                          <MailOpen size={15} />
                        </button>
                      )}
                      {current.status !== "replied" && (
                        <button onClick={() => updateStatus(current.id, "replied")}
                          className="p-2 text-green-400/60 hover:text-green-400 hover:bg-green-500/8 rounded-lg transition-colors" title="Mark as replied">
                          <Check size={15} />
                        </button>
                      )}
                      <button onClick={() => deleteInquiry(current.id)}
                        className="p-2 text-red-400/40 hover:text-red-400 hover:bg-red-500/8 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Contact info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a href={`mailto:${current.email}`}
                        className="flex items-center gap-2.5 bg-white/3 hover:bg-white/6 border border-white/5 hover:border-gold/20 rounded-xl px-3 py-2.5 transition-all group">
                        <Mail size={14} className="text-gold/60 group-hover:text-gold shrink-0" />
                        <span className="text-sm text-white/60 group-hover:text-white truncate transition-colors">{current.email}</span>
                      </a>
                      {current.phone && (
                        <a href={`tel:${current.phone}`}
                          className="flex items-center gap-2.5 bg-white/3 hover:bg-white/6 border border-white/5 hover:border-gold/20 rounded-xl px-3 py-2.5 transition-all group">
                          <Phone size={14} className="text-gold/60 group-hover:text-gold shrink-0" />
                          <span className="text-sm text-white/60 group-hover:text-white truncate transition-colors">{current.phone}</span>
                        </a>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2">Subject</p>
                      <p className="text-sm text-white/80 font-medium capitalize">
                        {current.subject.replace(/-/g, " ")}
                      </p>
                      {current.product_name && (
                        <p className="text-xs text-gold/60 mt-1">Product: {current.product_name}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2">Message</p>
                      <div className="bg-white/3 border border-white/5 rounded-xl p-4 text-sm text-white/60 leading-relaxed whitespace-pre-wrap font-light">
                        {current.message}
                      </div>
                    </div>

                    {/* Reply actions */}
                    <div className="flex flex-wrap gap-2.5 pt-2 border-t border-white/5">
                      <a
                        href={`mailto:${current.email}?subject=Re: ${encodeURIComponent(current.subject)}`}
                        onClick={() => updateStatus(current.id, "replied")}
                        className="flex items-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-5 py-2.5 rounded-xl transition-all text-sm hover:shadow-gold-glow"
                      >
                        <Mail size={14} /> Reply via Email
                      </a>
                      {current.phone && (
                        <a
                          href={`https://wa.me/${current.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${current.name}, thank you for your inquiry. `)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => updateStatus(current.id, "replied")}
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
                        >
                          <MessageSquare size={14} /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#0d0d10] rounded-2xl border border-white/6 p-16 text-center"
                >
                  <MessageSquare size={36} className="mx-auto mb-3 text-white/10" />
                  <p className="text-white/30 text-sm">Select an inquiry to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
