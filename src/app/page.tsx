import { redirect } from "next/navigation";
import { getAuthUser, resolveDestination } from "@/lib/dal";
import { signInWithGoogle } from "@/app/actions/auth";

export default async function Home() {
  const user = await getAuthUser();
  if (user) {
    redirect(await resolveDestination());
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-cream px-6 py-24 text-center dark:bg-navy-950">
      <div
        aria-hidden
        className="bg-stars pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl dark:opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(174,205,172,0.35) 0%, rgba(163,192,224,0.25) 45%, rgba(18,20,58,0) 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        <div className="flex flex-col items-center">
          <span className="font-script text-5xl text-dusty-blue-dark sm:text-6xl dark:text-sage">
            Cal Hacks
          </span>
          <span className="-mt-2 text-5xl font-extrabold tracking-tight text-navy-950 sm:text-7xl dark:text-cream">
            PORTAL
          </span>
        </div>

        <p className="max-w-sm text-balance text-navy-950/60 dark:text-lavender">
          Apply as a hacker, judge, mentor, or volunteer — or sign in to
          review applications.
        </p>

        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-navy-950 px-6 font-medium text-cream shadow-lg shadow-black/10 transition-transform hover:scale-[1.03] hover:bg-navy-800 dark:bg-cream dark:text-navy-950 dark:shadow-black/20 dark:hover:bg-white"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
