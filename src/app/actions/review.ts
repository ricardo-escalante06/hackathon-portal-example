"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/lib/types";

// Authorization is enforced by RLS (applications_update_as_organizer, via
// is_organizer()) — requireUser() here just ensures there's a session at all.
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) throw new Error(error.message);

  revalidatePath("/organizer");
}
