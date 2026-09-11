import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-cream px-6 text-center dark:bg-navy-950">
      <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-cream">
        Page not found
      </h1>
      <p className="max-w-sm text-navy-950/60 dark:text-cream/60">
        That page doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Link
        href="/"
        className="h-12 flex items-center rounded-full bg-navy-950 px-6 font-medium text-cream transition-colors hover:bg-navy-800 dark:bg-cream dark:text-navy-950 dark:hover:bg-white"
      >
        Back home
      </Link>
    </div>
  );
}
