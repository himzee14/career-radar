"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <p className="font-mono text-[13px] tracking-widest text-ink-500 uppercase mb-1">Career radar</p>
        <h1 className="text-xl font-medium text-ink-900 mb-6">Sign in to your dashboard</h1>

        {status === "sent" ? (
          <p className="text-sm text-ink-700 leading-relaxed">
            Check <span className="font-medium">{email}</span> for a sign-in link. You can close this tab.
          </p>
        ) : (
          <form onSubmit={sendLink} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink-900 focus:border-accent"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60"
            >
              {status === "sending" ? "Sending link..." : "Send sign-in link"}
            </button>
            {status === "error" && <p className="text-[13px] text-brick">{errorMessage}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
