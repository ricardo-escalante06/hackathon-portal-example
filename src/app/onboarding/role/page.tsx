import { redirect } from "next/navigation";
import { getProfile, resolveDestination } from "@/lib/dal";
import { setRole } from "@/app/actions/onboarding";

export default async function RoleSelectionPage() {
  const profile = await getProfile();
  if (profile?.role) {
    redirect(await resolveDestination());
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-cream px-6 py-16 text-center dark:bg-navy-950">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-cream">
          How are you joining us?
        </h1>
        <p className="text-navy-950/60 dark:text-cream/60">
          This decides which side of the portal you&apos;ll see.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <form action={setRole.bind(null, "applicant")}>
          <button
            type="submit"
            className="flex h-28 w-60 flex-col items-center justify-center gap-1 rounded-3xl border-2 border-transparent bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-dusty-blue hover:shadow-md dark:bg-navy-900"
          >
            <span className="text-lg font-bold text-navy-950 dark:text-cream">
              Applicant
            </span>
            <span className="text-sm text-navy-950/60 dark:text-cream/60">
              Hacker, judge, mentor, or volunteer
            </span>
          </button>
        </form>
        <form action={setRole.bind(null, "organizer")}>
          <button
            type="submit"
            className="flex h-28 w-60 flex-col items-center justify-center gap-1 rounded-3xl border-2 border-transparent bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-sage hover:shadow-md dark:bg-navy-900"
          >
            <span className="text-lg font-bold text-navy-950 dark:text-cream">
              Organizer
            </span>
            <span className="text-sm text-navy-950/60 dark:text-cream/60">
              Review and grade applications
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
