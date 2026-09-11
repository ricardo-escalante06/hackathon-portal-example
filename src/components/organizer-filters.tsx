"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ApplicantType, ApplicationStatus } from "@/lib/types";

export function OrganizerFilters({
  types,
  statuses,
}: {
  types: ApplicantType[];
  statuses: ApplicationStatus[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(key: "type" | "status", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Type
        <select
          value={searchParams.get("type") ?? ""}
          onChange={(event) => updateFilter("type", event.target.value)}
          className="h-10 rounded-lg border border-black/[.08] bg-white px-2 dark:border-white/[.145] dark:bg-zinc-950"
        >
          <option value="">All</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Status
        <select
          value={searchParams.get("status") ?? ""}
          onChange={(event) => updateFilter("status", event.target.value)}
          className="h-10 rounded-lg border border-black/[.08] bg-white px-2 dark:border-white/[.145] dark:bg-zinc-950"
        >
          <option value="">All</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
