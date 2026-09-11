import { signOut } from "@/app/actions/auth";

export function SignOutForm() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-navy-950/50 underline hover:text-navy-950 dark:text-cream/50 dark:hover:text-cream"
      >
        Sign out
      </button>
    </form>
  );
}
