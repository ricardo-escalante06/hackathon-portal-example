"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/spinner";

// Must render inside a <form> — useFormStatus reads its nearest parent
// form's pending state. Kept as its own component (rather than inline
// in the form's parent) because that's the one requirement of the hook.
export function FormPendingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-navy-900/80">
      <Spinner className="h-8 w-8 text-navy-950/50 dark:text-cream/50" />
    </div>
  );
}
