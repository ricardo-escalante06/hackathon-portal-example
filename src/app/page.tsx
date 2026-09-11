import { redirect } from "next/navigation";
import { getAuthUser, resolveDestination } from "@/lib/dal";
import { signInWithGoogle } from "@/app/actions/auth";

export default async function Home() {
  const user = await getAuthUser();
  if (user) {
    redirect(await resolveDestination());
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 text-center dark:bg-black">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          Hackathon Portal
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Sign in to apply or review applications.
        </p>
      </div>
      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
}
