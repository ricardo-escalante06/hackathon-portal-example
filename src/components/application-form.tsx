"use client";

import { useActionState } from "react";
import {
  submitApplication,
  type ApplicationFormState,
} from "@/app/actions/application";
import { APPLICATION_FIELDS } from "@/lib/application-fields";
import { Spinner } from "@/components/spinner";
import type { Application } from "@/lib/types";

const inputClass =
  "h-10 rounded-lg border border-navy-950/10 bg-white px-3 text-navy-950 outline-none transition-colors focus:border-dusty-blue focus:ring-2 focus:ring-dusty-blue/30 dark:border-white/10 dark:bg-navy-900 dark:text-cream";

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
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-cream/80 dark:bg-navy-950/80">
          <Spinner className="h-8 w-8 text-navy-950/50 dark:text-cream/50" />
        </div>
      )}
      {fields.map((field) => {
        const defaultValue =
          (application.responses[field.key] as string | undefined) ?? "";
        const fieldErrors = state?.errors?.[field.key];

        return (
          <div key={field.key} className="flex flex-col gap-1 text-left">
            <label
              htmlFor={field.key}
              className="text-sm font-semibold text-navy-950 dark:text-cream"
            >
              {field.label}
              {field.required && (
                <span className="text-coral-dark dark:text-coral"> *</span>
              )}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.key}
                name={field.key}
                defaultValue={defaultValue}
                rows={4}
                className={`${inputClass} h-auto p-2`}
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
                className={inputClass}
              />
            )}
            {fieldErrors && (
              <p className="text-sm text-coral-dark dark:text-coral">
                {fieldErrors[0]}
              </p>
            )}
          </div>
        );
      })}

      {state?.message && (
        <p className="text-sm text-coral-dark dark:text-coral">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 rounded-full bg-navy-950 px-6 font-medium text-cream transition-colors hover:bg-navy-800 disabled:opacity-50 dark:bg-cream dark:text-navy-950 dark:hover:bg-white"
      >
        {pending ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
