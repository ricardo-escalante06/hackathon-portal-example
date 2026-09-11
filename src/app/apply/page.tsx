import { redirect } from "next/navigation";
import { getApplication, getProfile } from "@/lib/dal";
import { SignOutForm } from "@/components/sign-out-form";
import { ApplicationForm } from "@/components/application-form";

export default async function ApplyPage() {
  const profile = await getProfile();
  if (!profile?.role) redirect("/onboarding/role");
  if (profile.role === "organizer") redirect("/organizer");

  const application = await getApplication();
  if (!application) redirect("/onboarding/applicant-type");

  if (application.submitted_at) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center dark:bg-black">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          You&apos;re all set!
        </h1>
        <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
          Your {application.applicant_type} application has been submitted.
          We&apos;ll email you when results are ready.
        </p>
        <p className="text-sm text-zinc-500">
          Status: <span className="font-medium">{application.status}</span>
        </p>
        <SignOutForm />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 bg-zinc-50 px-6 py-16 text-center dark:bg-black">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Apply as a {application.applicant_type}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Fill this out and submit when you&apos;re ready.
        </p>
      </div>
      <ApplicationForm application={application} />
      <SignOutForm />
    </div>
  );
}
