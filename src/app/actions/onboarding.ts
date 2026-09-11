"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import type { ApplicantType, UserRole } from "@/lib/types";

export async function setRole(role: UserRole) {
  const user = await requireUser();
  const supabase = await createClient();

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    "";
  const [firstName, ...rest] = fullName.split(" ");

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    role,
    first_name: firstName || null,
    last_name: rest.join(" ") || null,
    email: user.email,
  });

  if (error) throw new Error(error.message);

  redirect(role === "organizer" ? "/organizer" : "/onboarding/applicant-type");
}

export async function setApplicantType(applicantType: ApplicantType) {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("applications")
    .upsert(
      { user_id: user.id, applicant_type: applicantType },
      { onConflict: "user_id" }
    );

  if (error) throw new Error(error.message);

  redirect("/apply");
}
