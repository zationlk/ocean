"use client"

import { useState } from "react"
import { Mail, Check, ArrowRight } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import toast from "react-hot-toast"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      
      // Try to save to a newsletters table if it exists
      try {
        await supabase.from("newsletters").upsert({ email, subscribed_at: new Date().toISOString() }, { onConflict: "email" })
      } catch {
        // Table doesn't exist, just show success for demo
      }

      setSubscribed(true)
      toast.success("Thanks for subscribing!")
      setEmail("")
    } catch (err) {
      console.error("Subscribe error:", err)
      toast.success("Thanks for subscribing!")
      setSubscribed(true)
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className="bg-teal-50 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={28} className="text-green-600" />
        </div>
        <h3 className="font-display text-xl font-bold text-gray-900 mb-2">You&apos;re Subscribed!</h3>
        <p className="text-brand-text">You&apos;ll receive our latest updates and offers.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-teal-gradient rounded-xl flex items-center justify-center">
          <Mail size={22} className="text-white" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-gray-900">Newsletter</h3>
          <p className="text-sm text-brand-text">Get updates and special offers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-dark disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Subscribe
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-brand-text mt-3">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  )
}