"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowRight, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] mt-1.5">
          New here?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Create a free account
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@agency.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          leftIcon={<Mail size={15} />}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          leftIcon={<Lock size={15} />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />
        <div className="flex justify-end -mt-2">
          <Link
            href="/forgot-password"
            className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--accent)] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-[var(--danger)] bg-[var(--danger-muted)] border border-[rgba(239,68,68,0.2)]"
          >
            {error}
          </motion.div>
        )}

        <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Signing in…
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={15} />
            </>
          )}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[var(--border-strong)]" />
        <span className="text-xs text-[var(--foreground-subtle)]">secure login</span>
        <div className="flex-1 h-px bg-[var(--border-strong)]" />
      </div>

      <p className="text-center text-xs text-[var(--foreground-subtle)]">
        Protected by Supabase Auth · 256-bit encryption
      </p>

      <div className="mt-6 pt-5 border-t border-[var(--border)] text-center">
        <p className="text-xs text-[var(--foreground-subtle)] mb-2">Not an agent?</p>
        <div className="flex items-center justify-center gap-4 text-xs">
          <Link href="/tenant-portal" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
            Tenant Portal →
          </Link>
          <span className="text-[var(--border-strong)]">|</span>
          <Link href="/listings" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
            View Listings
          </Link>
          <span className="text-[var(--border-strong)]">|</span>
          <Link href="/book-visit" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
            Book a Visit
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
