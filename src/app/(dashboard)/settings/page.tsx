import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/SettingsForm";
import type { SearchProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: profile } = await supabase.from("search_profiles").select("*").limit(1).single();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-medium text-ink-900">Search settings</h1>
        <p className="text-sm text-ink-500 mt-1">
          This profile is included whenever you ask an LLM to run a discovery pass, and is available to reference in
          the import step.
        </p>
      </div>
      {profile ? (
        <SettingsForm profile={profile as SearchProfile} />
      ) : (
        <p className="text-sm text-brick">
          No search profile found. Run the seed insert in supabase/schema.sql to create one.
        </p>
      )}
    </div>
  );
}
