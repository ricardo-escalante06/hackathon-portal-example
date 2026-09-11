import { redirect } from "next/navigation";
import { getApplication, getProfile } from "@/lib/dal";
import { setApplicantType } from "@/app/actions/onboarding";
import type { ApplicantType } from "@/lib/types";

const OPTIONS: { type: ApplicantType; label: string; description: string }[] = [
  { type: "hacker", label: "Hacker", description: "Build a project" },
  { type: "judge", label: "Judge", description: "Evaluate projects" },
  { type: "mentor", label: "Mentor", description: "Help teams get unstuck" },
  { type: "volunteer", label: "Volunteer", description: "Help run the event" },
];

export default async function ApplicantTypePage() {
  const profile = await getProfile();
  if (!profile?.role) redirect("/onboarding/role");
  if (profile.role === "organizer") redirect("/organizer");

  const application = await getApplication();
  if (application) redirect("/apply");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 text-center dark:bg-black">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          What would you like to apply as?
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          You can only apply for one role.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {OPTIONS.map(({ type, label, description }) => (
          <form key={type} action={setApplicantType.bind(null, type)}>
            <button
              type="submit"
              className="flex h-24 w-40 flex-col items-center justify-center gap-1 rounded-2xl border border-black/[.08] bg-white transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:bg-[#1a1a1a]"
            >
              <span className="text-lg font-medium">{label}</span>
              <span className="text-xs text-zinc-500">{description}</span>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
