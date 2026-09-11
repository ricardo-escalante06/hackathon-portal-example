import { redirect } from "next/navigation";
import { getProfile, resolveDestination } from "@/lib/dal";
import { setRole } from "@/app/actions/onboarding";

export default async function RoleSelectionPage() {
  const profile = await getProfile();
  if (profile?.role) {
    redirect(await resolveDestination());
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 text-center dark:bg-black">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          How are you joining us?
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          This decides which side of the portal you&apos;ll see.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <form action={setRole.bind(null, "applicant")}>
          <button
            type="submit"
            className="flex h-24 w-56 flex-col items-center justify-center gap-1 rounded-2xl border border-black/[.08] bg-white transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:bg-[#1a1a1a]"
          >
            <span className="text-lg font-medium">Applicant</span>
            <span className="text-sm text-zinc-500">
              Hacker, judge, mentor, or volunteer
            </span>
          </button>
        </form>
        <form action={setRole.bind(null, "organizer")}>
          <button
            type="submit"
            className="flex h-24 w-56 flex-col items-center justify-center gap-1 rounded-2xl border border-black/[.08] bg-white transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:bg-[#1a1a1a]"
          >
            <span className="text-lg font-medium">Organizer</span>
            <span className="text-sm text-zinc-500">
              Review and grade applications
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
