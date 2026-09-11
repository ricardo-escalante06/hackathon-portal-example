import { redirect } from "next/navigation";
import { getApplication, getProfile } from "@/lib/dal";
import { SignOutButton } from "@/components/sign-out-button";

export default async function ApplyPage() {
  const profile = await getProfile();
  if (!profile?.role) redirect("/onboarding/role");
  if (profile.role === "organizer") redirect("/organizer");

  const application = await getApplication();
  if (!application) redirect("/onboarding/applicant-type");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        You&apos;re applying as a {application.applicant_type}
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Status: <span className="font-medium">{application.status}</span>
      </p>
      <p className="max-w-sm text-sm text-zinc-500">
        The application form isn&apos;t built yet — this page confirms the
        auth + role flow is wired up end to end.
      </p>
      <SignOutButton />
    </div>
  );
}
