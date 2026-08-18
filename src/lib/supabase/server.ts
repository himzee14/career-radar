import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client. Uses the service role key, which bypasses
 * Row Level Security entirely — that's intentional here: this app has no
 * login, so there's no user session for RLS to check against. Protection
 * instead relies on this key never reaching the browser (no NEXT_PUBLIC_
 * prefix, only ever imported from server components and route handlers)
 * and on RLS still denying the anon key by default as a backstop.
 *
 * Never import this file from a "use client" component.
 */
export function createClient() {
  return createSupabaseClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}
