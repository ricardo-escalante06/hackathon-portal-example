import type { ApplicantType } from "@/lib/types";

export type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "url" | "textarea" | "number";
  required: boolean;
  min?: number;
  max?: number;
};

const CURRENT_YEAR = new Date().getFullYear();

export const APPLICATION_FIELDS: Record<ApplicantType, FieldConfig[]> = {
  hacker: [
    { key: "school", label: "School", type: "text", required: true },
    {
      key: "graduation_year",
      label: "Graduation year",
      type: "number",
      required: true,
      min: CURRENT_YEAR,
      max: CURRENT_YEAR + 8,
    },
    {
      key: "github_url",
      label: "GitHub or portfolio link",
      type: "url",
      required: true,
    },
    { key: "resume_url", label: "Resume link", type: "url", required: true },
    {
      key: "why",
      label: "Why do you want to attend?",
      type: "textarea",
      required: true,
    },
    {
      key: "dietary_restrictions",
      label: "Dietary restrictions",
      type: "text",
      required: false,
    },
  ],
  judge: [
    { key: "company", label: "Company / title", type: "text", required: true },
    {
      key: "expertise",
      label: "Area of expertise",
      type: "text",
      required: true,
    },
    { key: "linkedin_url", label: "LinkedIn", type: "url", required: true },
    {
      key: "why",
      label: "Why do you want to judge?",
      type: "textarea",
      required: true,
    },
  ],
  mentor: [
    { key: "company", label: "Company / title", type: "text", required: true },
    {
      key: "skills",
      label: "Tech stack / skills",
      type: "text",
      required: true,
    },
    {
      key: "availability",
      label: "Availability (which days)",
      type: "text",
      required: true,
    },
    { key: "linkedin_url", label: "LinkedIn", type: "url", required: true },
  ],
  volunteer: [
    {
      key: "availability",
      label: "Availability (which shifts)",
      type: "text",
      required: true,
    },
    {
      key: "motivation",
      label: "Why do you want to volunteer?",
      type: "textarea",
      required: true,
    },
  ],
};
