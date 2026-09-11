"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ApplicantType, ApplicationStatus, Organizer } from "@/lib/types";

type AssigneeMode = "" | "unassigned" | "me" | "individual";

function organizerName(organizer: Organizer) {
  return `${organizer.first_name ?? ""} ${organizer.last_name ?? ""}`.trim();
}

export function OrganizerFilters({
  types,
  statuses,
  organizers,
}: {
  types: ApplicantType[];
  statuses: ApplicationStatus[];
  organizers: Organizer[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const assigneeParam = searchParams.get("assignee") ?? "";
  const isKnownMode =
    assigneeParam === "" ||
    assigneeParam === "unassigned" ||
    assigneeParam === "me";

  const organizerById = useMemo(
    () => new Map(organizers.map((organizer) => [organizer.id, organizer])),
    [organizers]
  );
  const selectedOrganizer = !isKnownMode
    ? organizerById.get(assigneeParam)
    : undefined;

  const [mode, setMode] = useState<AssigneeMode>(
    isKnownMode ? (assigneeParam as AssigneeMode) : "individual"
  );
  const [search, setSearch] = useState(
    selectedOrganizer ? organizerName(selectedOrganizer) : ""
  );

  function setParam(key: "type" | "status" | "assignee", value: string) {
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
      <label className="flex flex-col gap-1 text-sm font-medium text-navy-950/70 dark:text-cream/70">
        Type
        <select
          value={searchParams.get("type") ?? ""}
          onChange={(event) => setParam("type", event.target.value)}
          className="h-10 rounded-lg border border-navy-950/10 bg-white px-2 text-navy-950 outline-none focus:border-dusty-blue dark:border-white/10 dark:bg-navy-900 dark:text-cream"
        >
          <option value="">All</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-navy-950/70 dark:text-cream/70">
        Status
        <select
          value={searchParams.get("status") ?? ""}
          onChange={(event) => setParam("status", event.target.value)}
          className="h-10 rounded-lg border border-navy-950/10 bg-white px-2 text-navy-950 outline-none focus:border-dusty-blue dark:border-white/10 dark:bg-navy-900 dark:text-cream"
        >
          <option value="">All</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-navy-950/70 dark:text-cream/70">
        Assigned to
        <select
          value={mode}
          onChange={(event) => {
            const next = event.target.value as AssigneeMode;
            setMode(next);
            if (next === "individual") {
              setSearch("");
            } else {
              setParam("assignee", next);
            }
          }}
          className="h-10 rounded-lg border border-navy-950/10 bg-white px-2 text-navy-950 outline-none focus:border-dusty-blue dark:border-white/10 dark:bg-navy-900 dark:text-cream"
        >
          <option value="">All</option>
          <option value="me">Assigned to me</option>
          <option value="unassigned">Unassigned</option>
          <option value="individual">Individual…</option>
        </select>
      </label>
      {mode === "individual" && (
        <label className="flex flex-col gap-1 text-sm font-medium text-navy-950/70 dark:text-cream/70">
          Search organizer
          <input
            list="organizer-options"
            value={search}
            placeholder="Type a name…"
            onChange={(event) => {
              const text = event.target.value;
              setSearch(text);
              const match = organizers.find(
                (organizer) =>
                  organizerName(organizer).toLowerCase() ===
                  text.toLowerCase()
              );
              if (match) setParam("assignee", match.id);
            }}
            className="h-10 rounded-lg border border-navy-950/10 bg-white px-3 text-navy-950 outline-none focus:border-dusty-blue dark:border-white/10 dark:bg-navy-900 dark:text-cream"
          />
          <datalist id="organizer-options">
            {organizers.map((organizer) => (
              <option key={organizer.id} value={organizerName(organizer)} />
            ))}
          </datalist>
        </label>
      )}
    </div>
  );
}
