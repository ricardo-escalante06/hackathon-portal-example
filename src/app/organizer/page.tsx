import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import {
  distributeUnassigned,
  updateApplicationStatus,
} from "@/app/actions/review";
import { APPLICATION_FIELDS } from "@/lib/application-fields";
import { SignOutForm } from "@/components/sign-out-form";
import { StatusBadge } from "@/components/status-badge";
import { OrganizerFilters } from "@/components/organizer-filters";
import { FormPendingOverlay } from "@/components/form-pending-overlay";
import { AssigneeSelect } from "@/components/assignee-select";
import { SubmitButton } from "@/components/submit-button";
import type {
  ApplicantType,
  ApplicationStatus,
  ApplicationWithApplicant,
  Organizer,
} from "@/lib/types";

const APPLICANT_TYPES: ApplicantType[] = [
  "hacker",
  "judge",
  "mentor",
  "volunteer",
];
const STATUSES: ApplicationStatus[] = [
  "pending",
  "accepted",
  "rejected",
  "waitlisted",
];

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  return search.toString();
}

export default async function OrganizerPage({
  searchParams,
}: PageProps<"/organizer">) {
  const profile = await getProfile();
  if (!profile?.role) redirect("/onboarding/role");
  if (profile.role === "applicant") redirect("/apply");

  const params = await searchParams;
  const typeFilter = firstParam(params.type);
  const statusFilter = firstParam(params.status);
  const assigneeFilter = firstParam(params.assignee);
  const reviewId = firstParam(params.review);

  const supabase = await createClient();
  const [{ data, error }, { data: organizersData, error: organizersError }] =
    await Promise.all([
      supabase
        .from("applications")
        .select(
          "*, applicant:profiles!applications_user_id_fkey(first_name, last_name, email), assignee:profiles!applications_assigned_to_fkey(first_name, last_name)"
        )
        .order("created_at", { ascending: true }),
      supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("role", "organizer")
        .order("created_at", { ascending: true }),
    ]);

  if (error) throw new Error(error.message);
  if (organizersError) throw new Error(organizersError.message);

  const applications = (data ?? []) as unknown as ApplicationWithApplicant[];
  const organizers = (organizersData ?? []) as Organizer[];
  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const reviewedCount = applications.length - pendingCount;
  const unassignedCount = applications.filter((a) => !a.assigned_to).length;

  const filtered = applications.filter((a) => {
    if (typeFilter && a.applicant_type !== typeFilter) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    if (assigneeFilter === "unassigned" && a.assigned_to) return false;
    if (assigneeFilter === "me" && a.assigned_to !== profile.id) return false;
    if (
      assigneeFilter &&
      assigneeFilter !== "unassigned" &&
      assigneeFilter !== "me" &&
      a.assigned_to !== assigneeFilter
    )
      return false;
    return true;
  });

  const reviewing = reviewId
    ? applications.find((a) => a.id === reviewId)
    : undefined;

  const filterQuery = buildQuery({
    type: typeFilter,
    status: statusFilter,
    assignee: assigneeFilter,
  });
  const listHref = filterQuery ? `/organizer?${filterQuery}` : "/organizer";

  // Where "Accept/Waitlist/Reject" should send you next: the next
  // still-pending application in the currently filtered/visible list, or
  // back to the list if you've cleared it.
  const reviewIndex = reviewing
    ? filtered.findIndex((a) => a.id === reviewing.id)
    : -1;
  const nextPending =
    reviewIndex >= 0
      ? filtered.slice(reviewIndex + 1).find((a) => a.status === "pending")
      : undefined;
  const nextReviewHref = nextPending
    ? `/organizer?${filterQuery ? `${filterQuery}&` : ""}review=${nextPending.id}`
    : listHref;

  return (
    <div className="relative flex flex-1 flex-col gap-6 bg-cream px-6 py-10 dark:bg-navy-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-cream">
            Applications
          </h1>
          <p className="text-sm text-navy-950/60 dark:text-cream/60">
            {pendingCount} left to review · {reviewedCount} completed ·{" "}
            {unassignedCount} unassigned
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unassignedCount > 0 && (
            <form action={distributeUnassigned}>
              <SubmitButton
                pendingLabel="Distributing..."
                className="h-10 rounded-full border-2 border-apricot bg-apricot/20 px-4 text-sm font-semibold text-apricot-dark transition-colors hover:bg-apricot/30 dark:text-apricot"
              >
                Distribute unassigned
              </SubmitButton>
            </form>
          )}
          <SignOutForm />
        </div>
      </div>

      <OrganizerFilters
        types={APPLICANT_TYPES}
        statuses={STATUSES}
        organizers={organizers}
      />

      <div className="overflow-x-auto rounded-2xl border border-navy-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-navy-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy-950/10 text-xs font-semibold uppercase tracking-wide text-navy-950/50 dark:border-white/10 dark:text-cream/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned to</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((application) => (
              <tr
                key={application.id}
                className="border-b border-navy-950/5 last:border-0 hover:bg-cream/60 dark:border-white/5 dark:hover:bg-navy-800/40"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-navy-950 dark:text-cream">
                    {application.applicant?.first_name}{" "}
                    {application.applicant?.last_name}
                  </div>
                  <div className="text-navy-950/50 dark:text-cream/50">
                    {application.applicant?.email}
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-navy-950/80 dark:text-cream/80">
                  {application.applicant_type}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={application.status} />
                </td>
                <td className="px-4 py-3">
                  <AssigneeSelect
                    applicationId={application.id}
                    currentAssigneeId={application.assigned_to}
                    organizers={organizers}
                  />
                </td>
                <td className="px-4 py-3 text-navy-950/50 dark:text-cream/50">
                  {application.submitted_at
                    ? new Date(application.submitted_at).toLocaleDateString()
                    : "Not submitted"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/organizer?${
                      filterQuery ? `${filterQuery}&` : ""
                    }review=${application.id}`}
                    className="font-semibold text-dusty-blue-dark hover:underline dark:text-dusty-blue"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-navy-950/50 dark:text-cream/50"
                >
                  No applications match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {reviewing && (
        <ReviewModal
          application={reviewing}
          closeHref={listHref}
          nextReviewHref={nextReviewHref}
        />
      )}
    </div>
  );
}

const ACTIVE_STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: "bg-lavender-dark text-white",
  accepted: "bg-sage-dark text-white",
  rejected: "bg-coral-dark text-white",
  waitlisted: "bg-apricot-dark text-white",
};

function statusButtonClass(
  status: ApplicationStatus,
  current: ApplicationStatus
) {
  const base =
    "h-10 min-w-[110px] flex-1 rounded-full px-3 text-sm font-semibold transition-colors";
  if (status === current) {
    return `${base} ${ACTIVE_STATUS_STYLES[status]}`;
  }
  return `${base} border border-navy-950/10 text-navy-950/70 hover:bg-cream dark:border-white/10 dark:text-cream/70 dark:hover:bg-navy-800`;
}

function ReviewModal({
  application,
  closeHref,
  nextReviewHref,
}: {
  application: ApplicationWithApplicant;
  closeHref: string;
  nextReviewHref: string;
}) {
  const fields = APPLICATION_FIELDS[application.applicant_type];
  const decisions: {
    status: ApplicationStatus;
    label: string;
    advance: boolean;
  }[] = [
    { status: "accepted", label: "Accept", advance: true },
    { status: "waitlisted", label: "Waitlist", advance: true },
    { status: "rejected", label: "Reject", advance: true },
    { status: "pending", label: "Reset to pending", advance: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
      <form className="relative flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-navy-900">
        <FormPendingOverlay />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-navy-950 dark:text-cream">
              {application.applicant?.first_name}{" "}
              {application.applicant?.last_name}
            </h2>
            <p className="text-sm text-navy-950/50 dark:text-cream/50">
              {application.applicant?.email}
            </p>
          </div>
          <Link
            href={closeHref}
            className="text-sm text-navy-950/50 underline hover:text-navy-950 dark:text-cream/50 dark:hover:text-cream"
          >
            Close
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm capitalize text-navy-950/60 dark:text-cream/60">
            Applying as {application.applicant_type}
          </span>
          <StatusBadge status={application.status} />
        </div>

        <p className="text-sm text-navy-950/60 dark:text-cream/60">
          Assigned to:{" "}
          <span className="font-semibold text-navy-950 dark:text-cream">
            {application.assignee
              ? `${application.assignee.first_name} ${application.assignee.last_name}`
              : "Unassigned"}
          </span>
        </p>

        {application.submitted_at ? (
          <div className="flex flex-col gap-3">
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-0.5 text-sm">
                <span className="text-navy-950/50 dark:text-cream/50">
                  {field.label}
                </span>
                <span className="whitespace-pre-wrap text-navy-950 dark:text-cream">
                  {(application.responses[field.key] as string) || "—"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-navy-950/50 dark:text-cream/50">
            This applicant hasn&apos;t submitted their form yet.
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {decisions.map(({ status, label, advance }) => (
            <button
              key={status}
              type="submit"
              formAction={updateApplicationStatus.bind(
                null,
                application.id,
                status,
                advance ? nextReviewHref : null
              )}
              className={statusButtonClass(status, application.status)}
            >
              {label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
