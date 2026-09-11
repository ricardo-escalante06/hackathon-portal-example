export type UserRole = "applicant" | "organizer";

export type ApplicantType = "hacker" | "judge" | "mentor" | "volunteer";

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "waitlisted";

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: UserRole | null;
  created_at: string;
};

export type Application = {
  id: string;
  user_id: string;
  applicant_type: ApplicantType;
  status: ApplicationStatus;
  responses: Record<string, unknown>;
  submitted_at: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
};

export type Organizer = Pick<Profile, "id" | "first_name" | "last_name">;

export type ApplicationWithApplicant = Application & {
  applicant: Pick<Profile, "first_name" | "last_name" | "email"> | null;
  assignee: Pick<Profile, "first_name" | "last_name"> | null;
};
