"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/lib/types";

// Authorization is enforced by RLS (applications_update_as_organizer, via
// is_organizer()) — requireUser() here just ensures there's a session at all.
//
// redirectTo lets the caller advance straight to the next application to
// review (or close the modal) after a decision, instead of staying put —
// pass null to just update in place (used for "reset to pending", which
// isn't really "finishing" a review).
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  redirectTo: string | null
) {
  await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) throw new Error(error.message);

  revalidatePath("/organizer");
  if (redirectTo) redirect(redirectTo);
}

export async function assignApplication(
  applicationId: string,
  organizerId: string | null
) {
  await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("applications")
    .update({ assigned_to: organizerId })
    .eq("id", applicationId);

  if (error) throw new Error(error.message);

  revalidatePath("/organizer");
}

// Evenly round-robins every currently-unassigned application across all
// organizers. Runs as individual updates rather than one bulk call —
// PostgREST doesn't support a single request with a different value per
// row — which is fine at hackathon-application scale.
export async function distributeUnassigned() {
  await requireUser();
  const supabase = await createClient();

  const { data: organizers, error: organizersError } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "organizer")
    .order("created_at", { ascending: true });

  if (organizersError) throw new Error(organizersError.message);
  if (!organizers || organizers.length === 0) {
    throw new Error("There are no organizers to assign to yet.");
  }

  const { data: unassigned, error: unassignedError } = await supabase
    .from("applications")
    .select("id")
    .is("assigned_to", null)
    .order("created_at", { ascending: true });

  if (unassignedError) throw new Error(unassignedError.message);
  if (!unassigned || unassigned.length === 0) return;

  const results = await Promise.all(
    unassigned.map((application, index) =>
      supabase
        .from("applications")
        .update({ assigned_to: organizers[index % organizers.length].id })
        .eq("id", application.id)
    )
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error(failed.error.message);

  revalidatePath("/organizer");
}
