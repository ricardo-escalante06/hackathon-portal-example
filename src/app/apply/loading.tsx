import { Spinner } from "@/components/spinner";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-cream dark:bg-navy-950">
      <Spinner className="h-8 w-8 text-dusty-blue-dark dark:text-dusty-blue" />
    </div>
  );
}
