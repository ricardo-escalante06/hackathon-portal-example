"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/spinner";

export function SubmitButton({
  children,
  pendingLabel,
  className,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner className="h-4 w-4" />
          {pendingLabel}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
