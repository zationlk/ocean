"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Shield } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (document.cookie.includes("admin_session=authenticated")) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 700));
    if (formData.email === "admin@oceanlighting.lk" && formData.password === "admin123") {
      document.cookie = "admin_session=authenticated; path=/; max-age=86400";
      toast.success("Welcome back!");
      // Small delay so toast renders before navigation
      setTimeout(() => router.replace("/admin/dashboard"), 800);
    } else {
      toast.error("Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: "#D4AF37", color: "#0F0F11", borderRadius: "12px", fontWeight: "600" } }} />

      <div className="min-h-screen bg-brand-obsidian flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: `linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
          <motion.div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold/6 blur-[150px]"
            animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/4 blur-[120px]"
            animate={{ scale: [1, 1.08, 1], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full max-w-md"
        >
          {/* Header — text only, no logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 mb-5">
              <Lock size={24} className="text-gold" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white tracking-wide mb-1">Admin Portal</h1>
            <p className="text-brand-text/50 text-sm font-light">Ocean Lighting Solutions</p>
          </div>

          {/* Card */}
          <div className="bg-brand-charcoal rounded-3xl border border-brand-border shadow-2xl overflow-hidden"
            style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
            {/* Gold top accent */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-brand-text/60 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/30" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      required
                      autoComplete="email"
                      placeholder="admin@oceanlighting.lk"
                      className="w-full pl-10 pr-4 py-3 bg-brand-obsidian text-white border border-brand-border rounded-xl text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all placeholder:text-brand-text/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-brand-text/60 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/30" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                      required
                      autoComplete="current-password"
                      placeholder="Enter password"
                      className="w-full pl-10 pr-11 py-3 bg-brand-obsidian text-white border border-brand-border rounded-xl text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all placeholder:text-brand-text/20"
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text/30 hover:text-brand-text/70 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Demo hint */}
                <div className="bg-brand-obsidian border border-gold/15 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Shield size={13} className="text-gold" />
                    <span className="text-xs font-bold text-gold uppercase tracking-wider">Demo Credentials</span>
                  </div>
                  <p className="text-[11px] text-brand-text/50 font-mono">admin@oceanlighting.lk / admin123</p>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-brand-dark font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-gold-glow relative overflow-hidden group"
                >
                  <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }} whileHover={{ x: "200%" }} transition={{ duration: 0.5 }} />
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
                  )}
                </motion.button>
              </form>
            </div>
          </div>

          <p className="text-center text-brand-text/30 text-xs mt-6 font-light">
            Ocean Lighting Solutions · Secure Admin Access
          </p>
        </motion.div>
      </div>
    </>
  );
}
