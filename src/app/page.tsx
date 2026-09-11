import { redirect } from "next/navigation";
import { getAuthUser, resolveDestination } from "@/lib/dal";
import { SignInButton } from "@/components/sign-in-button";

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
      <SignInButton />
    </div>
  );
}
