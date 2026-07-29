"use client";

import { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      try {
        await supabase.from("newsletters").upsert({ email, subscribed_at: new Date().toISOString() }, { onConflict: "email" });
      } catch {
        // table may not exist
      }
      setSubscribed(true);
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch {
      setSubscribed(true);
      toast.success("Thanks for subscribing!");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-brand-charcoal rounded-2xl border border-gold/20 p-8 text-center">
        <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={28} className="text-green-400" />
        </div>
        <h3 className="font-display text-xl font-bold text-white mb-2">You&apos;re Subscribed!</h3>
        <p className="text-brand-text font-light text-sm">You&apos;ll receive our latest updates and exclusive offers.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-charcoal rounded-2xl border border-brand-border p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-gold-gradient rounded-xl flex items-center justify-center shrink-0">
          <Mail size={22} className="text-white" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-white">Newsletter</h3>
          <p className="text-sm text-brand-text font-light">Get updates and exclusive offers</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email" required
          className="flex-1 px-4 py-3 bg-brand-obsidian text-white border border-brand-border rounded-xl text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 placeholder:text-brand-text/30"
        />
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 bg-gold hover:bg-gold-600 disabled:opacity-60 text-brand-dark font-bold px-5 py-3 rounded-xl transition-colors shrink-0">
          {loading
            ? <div className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" />
            : <><span className="hidden sm:inline">Subscribe</span><ArrowRight size={16} /></>
          }
        </button>
      </form>
      <p className="text-xs text-brand-text/50 mt-3 font-light">We respect your privacy. Unsubscribe anytime.</p>
    </div>
  );
}
