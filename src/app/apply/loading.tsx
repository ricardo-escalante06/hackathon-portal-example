import { Spinner } from "@/components/spinner";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <Spinner className="h-8 w-8 text-zinc-400" />
    </div>
  );
}
