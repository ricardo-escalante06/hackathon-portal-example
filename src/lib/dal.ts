import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Application, Profile } from "@/lib/types";

// getUser() re-validates the JWT against Supabase's auth server rather
// than trusting the session cookie's contents, per Next.js's auth guide.
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const requireUser = cache(async () => {
  const user = await getAuthUser();
  if (!user) redirect("/");
  return user;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return data;
});

export const getApplication = cache(async (): Promise<Application | null> => {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  return data;
});

// Single source of truth for "where should this signed-in user land."
// Used by both the OAuth callback and the root page so a direct visit to
// "/" and a fresh login always agree on the destination.
export async function resolveDestination(): Promise<string> {
  const profile = await getProfile();

  if (!profile?.role) return "/onboarding/role";
  if (profile.role === "organizer") return "/organizer";

  const application = await getApplication();
  return application ? "/apply" : "/onboarding/applicant-type";
}
