import { signOut } from "@/app/actions/auth";

export function SignOutForm() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        Sign out
      </button>
    </form>
  );
}
