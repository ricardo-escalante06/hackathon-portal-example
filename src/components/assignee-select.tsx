"use client";

import { useState, useTransition } from "react";
import { assignApplication } from "@/app/actions/review";
import { Spinner } from "@/components/spinner";
import type { Organizer } from "@/lib/types";

export function AssigneeSelect({
  applicationId,
  currentAssigneeId,
  organizers,
}: {
  applicationId: string;
  currentAssigneeId: string | null;
  organizers: Organizer[];
}) {
  // Keyed by the server-confirmed value so this remounts (resetting local
  // state) whenever the assignment changes from elsewhere — e.g.
  // "Distribute unassigned" reassigning a row this component didn't touch.
  return (
    <AssigneeSelectInner
      key={currentAssigneeId ?? "unassigned"}
      applicationId={applicationId}
      currentAssigneeId={currentAssigneeId}
      organizers={organizers}
    />
  );
}

function AssigneeSelectInner({
  applicationId,
  currentAssigneeId,
  organizers,
}: {
  applicationId: string;
  currentAssigneeId: string | null;
  organizers: Organizer[];
}) {
  const [value, setValue] = useState(currentAssigneeId ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        disabled={isPending}
        onChange={(event) => {
          const next = event.target.value;
          setValue(next);
          startTransition(() => {
            assignApplication(applicationId, next || null);
          });
        }}
        className="h-9 rounded-lg border border-black/[.08] bg-white px-2 text-sm dark:border-white/[.145] dark:bg-zinc-950"
      >
        <option value="">Unassigned</option>
        {organizers.map((organizer) => (
          <option key={organizer.id} value={organizer.id}>
            {organizer.first_name} {organizer.last_name}
          </option>
        ))}
      </select>
      {isPending && <Spinner className="h-4 w-4 text-zinc-400" />}
    </div>
  );
}
