"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-cream px-6 text-center dark:bg-navy-950">
      <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-cream">
        Something went wrong
      </h1>
      <p className="max-w-sm text-navy-950/60 dark:text-cream/60">
        That&apos;s on us — try again, and if it keeps happening, let us
        know what you were doing.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="h-12 rounded-full bg-navy-950 px-6 font-medium text-cream transition-colors hover:bg-navy-800 dark:bg-cream dark:text-navy-950 dark:hover:bg-white"
      >
        Try again
      </button>
    </div>
  );
}
