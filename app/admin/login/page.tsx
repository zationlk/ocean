"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, Lock, Mail } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    const isAuth = document.cookie.includes("admin_session=authenticated");
    if (isAuth) router.push("/admin/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (
      formData.email === "admin@oceanlighting.lk" &&
      formData.password === "admin123"
    ) {
      document.cookie = "admin_session=authenticated; path=/; max-age=86400";
      toast.success("Welcome back, Admin!");
      router.push("/admin/dashboard");
    } else {
      toast.error("Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: "#006060", color: "#fff", borderRadius: "8px" },
        }}
      />
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10">
                <Sparkles size={24} className="text-gold" />
              </div>
              <div className="text-left">
                <div className="font-display font-bold text-2xl tracking-widest text-white leading-none">
                  OCEAN
                </div>
                <div className="text-gold text-xs tracking-wider mt-1 font-semibold uppercase leading-none">Admin Panel</div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Sign In</h1>
            <p className="text-gray-300 text-sm mt-1 font-light">
              Access the admin dashboard
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                    autoComplete="email"
                    placeholder="admin@oceanlighting.lk"
                    className="w-full pl-10 pr-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, password: e.target.value }))
                    }
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Demo hint */}
              <div className="bg-gold-50 border border-gold-100 rounded-xl p-3 text-sm text-brand-text">
                <p className="font-semibold text-gold-700 mb-1">Demo credentials</p>
                <p>Email: admin@oceanlighting.lk</p>
                <p>Password: admin123</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-gold-600 disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-gold-glow"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
