import { redirect } from "next/navigation";
import { getApplication, getProfile } from "@/lib/dal";
import { setApplicantType } from "@/app/actions/onboarding";
import type { ApplicantType } from "@/lib/types";

const OPTIONS: {
  type: ApplicantType;
  label: string;
  description: string;
  accent: string;
}[] = [
  {
    type: "hacker",
    label: "Hacker",
    description: "Build a project",
    accent: "hover:border-dusty-blue",
  },
  {
    type: "judge",
    label: "Judge",
    description: "Evaluate projects",
    accent: "hover:border-lavender-dark",
  },
  {
    type: "mentor",
    label: "Mentor",
    description: "Help teams get unstuck",
    accent: "hover:border-sage",
  },
  {
    type: "volunteer",
    label: "Volunteer",
    description: "Help run the event",
    accent: "hover:border-apricot",
  },
];

export default async function ApplicantTypePage() {
  const profile = await getProfile();
  if (!profile?.role) redirect("/onboarding/role");
  if (profile.role === "organizer") redirect("/organizer");

  const application = await getApplication();
  if (application) redirect("/apply");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-cream px-6 py-16 text-center dark:bg-navy-950">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-cream">
          What would you like to apply as?
        </h1>
        <p className="text-navy-950/60 dark:text-cream/60">
          You can only apply for one role.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {OPTIONS.map(({ type, label, description, accent }) => (
          <form key={type} action={setApplicantType.bind(null, type)}>
            <button
              type="submit"
              className={`flex h-28 w-40 flex-col items-center justify-center gap-1 rounded-3xl border-2 border-transparent bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-navy-900 ${accent}`}
            >
              <span className="text-lg font-bold text-navy-950 dark:text-cream">
                {label}
              </span>
              <span className="text-xs text-navy-950/60 dark:text-cream/60">
                {description}
              </span>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
