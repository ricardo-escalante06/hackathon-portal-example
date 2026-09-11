import { redirect } from "next/navigation";
import { getProfile } from "@/lib/dal";
import { SignOutButton } from "@/components/sign-out-button";

export default async function OrganizerPage() {
  const profile = await getProfile();
  if (!profile?.role) redirect("/onboarding/role");
  if (profile.role === "applicant") redirect("/apply");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Organizer dashboard
      </h1>
      <p className="max-w-sm text-sm text-zinc-500">
        The applications list and review UI aren&apos;t built yet — this page
        confirms the auth + role flow is wired up end to end.
      </p>
      <SignOutButton />
    </div>
  );
}
