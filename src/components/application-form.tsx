"use client";

import { useActionState } from "react";
import {
  submitApplication,
  type ApplicationFormState,
} from "@/app/actions/application";
import { APPLICATION_FIELDS } from "@/lib/application-fields";
import { Spinner } from "@/components/spinner";
import type { Application } from "@/lib/types";

export function ApplicationForm({ application }: { application: Application }) {
  const action = submitApplication.bind(null, application.applicant_type);
  const [state, formAction, pending] = useActionState<
    ApplicationFormState,
    FormData
  >(action, undefined);
  const fields = APPLICATION_FIELDS[application.applicant_type];

  return (
    <form
      action={formAction}
      className="relative flex w-full max-w-md flex-col gap-4"
    >
      {pending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 dark:bg-black/70">
          <Spinner className="h-8 w-8 text-zinc-500" />
        </div>
      )}
      {fields.map((field) => {
        const defaultValue =
          (application.responses[field.key] as string | undefined) ?? "";
        const fieldErrors = state?.errors?.[field.key];

        return (
          <div key={field.key} className="flex flex-col gap-1 text-left">
            <label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.key}
                name={field.key}
                defaultValue={defaultValue}
                rows={4}
                className="rounded-lg border border-black/[.08] bg-white p-2 dark:border-white/[.145] dark:bg-zinc-950"
              />
            ) : (
              <input
                id={field.key}
                name={field.key}
                type={
                  field.type === "url"
                    ? "url"
                    : field.type === "number"
                      ? "number"
                      : "text"
                }
                min={field.type === "number" ? field.min : undefined}
                max={field.type === "number" ? field.max : undefined}
                defaultValue={defaultValue}
                className="h-10 rounded-lg border border-black/[.08] bg-white px-3 dark:border-white/[.145] dark:bg-zinc-950"
              />
            )}
            {fieldErrors && (
              <p className="text-sm text-red-500">{fieldErrors[0]}</p>
            )}
          </div>
        );
      })}

      {state?.message && <p className="text-sm text-red-500">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {pending ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
