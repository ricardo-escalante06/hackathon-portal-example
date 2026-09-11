import type { ApplicationStatus } from "@/lib/types";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: "bg-lavender/30 text-lavender-dark dark:bg-lavender/20 dark:text-lavender",
  accepted: "bg-sage/30 text-sage-dark dark:bg-sage/20 dark:text-sage",
  rejected: "bg-coral/30 text-coral-dark dark:bg-coral/20 dark:text-coral",
  waitlisted:
    "bg-apricot/30 text-apricot-dark dark:bg-apricot/20 dark:text-apricot",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
