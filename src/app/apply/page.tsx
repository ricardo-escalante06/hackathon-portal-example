import { redirect } from "next/navigation";
import { getApplication, getProfile } from "@/lib/dal";
import { SignOutForm } from "@/components/sign-out-form";
import { ApplicationForm } from "@/components/application-form";
import { StatusBadge } from "@/components/status-badge";

export default async function ApplyPage() {
  const profile = await getProfile();
  if (!profile?.role) redirect("/onboarding/role");
  if (profile.role === "organizer") redirect("/organizer");

  const application = await getApplication();
  if (!application) redirect("/onboarding/applicant-type");

  if (application.submitted_at) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-cream px-6 text-center dark:bg-navy-950">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-cream">
          You&apos;re all set!
        </h1>
        <p className="max-w-sm text-navy-950/60 dark:text-cream/60">
          Your {application.applicant_type} application has been submitted.
          We&apos;ll email you when results are ready.
        </p>
        <StatusBadge status={application.status} />
        <SignOutForm />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 bg-cream px-6 py-16 text-center dark:bg-navy-950">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-cream">
          Apply as a {application.applicant_type}
        </h1>
        <p className="text-navy-950/60 dark:text-cream/60">
          Fill this out and submit when you&apos;re ready.
        </p>
      </div>
      <ApplicationForm application={application} />
      <SignOutForm />
    </div>
  );
}
