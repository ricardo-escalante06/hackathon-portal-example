"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { APPLICATION_FIELDS } from "@/lib/application-fields";
import type { ApplicantType } from "@/lib/types";

export type ApplicationFormState =
  | {
      errors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;

function fieldSchema(field: (typeof APPLICATION_FIELDS)[ApplicantType][number]) {
  if (field.type === "url") {
    const schema = z.url({ error: "Enter a valid URL." });
    return field.required ? schema : schema.optional();
  }

  if (field.type === "number") {
    let schema = z.coerce.number({ error: `${field.label} must be a number.` });
    if (field.min !== undefined) {
      schema = schema.min(field.min, {
        error: `${field.label} must be ${field.min} or later.`,
      });
    }
    if (field.max !== undefined) {
      schema = schema.max(field.max, {
        error: `${field.label} must be ${field.max} or earlier.`,
      });
    }
    return field.required ? schema : schema.optional();
  }

  const schema = z.string();
  return field.required
    ? schema.min(1, { error: `${field.label} is required.` })
    : schema.optional();
}

function schemaFor(applicantType: ApplicantType) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of APPLICATION_FIELDS[applicantType]) {
    shape[field.key] = fieldSchema(field);
  }

  return z.object(shape);
}

export async function submitApplication(
  applicantType: ApplicantType,
  _prevState: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  const user = await requireUser();

  const fields = APPLICATION_FIELDS[applicantType];
  const raw = Object.fromEntries(
    fields.map((field) => [field.key, formData.get(field.key) ?? ""])
  );

  const validated = schemaFor(applicantType).safeParse(raw);
  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({
      responses: validated.data,
      submitted_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) {
    return { message: error.message };
  }

  redirect("/apply");
}
