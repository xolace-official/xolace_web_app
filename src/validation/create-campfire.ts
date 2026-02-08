//Campfire purpose options - type enum

import { z } from "zod";
import { campfire_realms } from "@/features/campfires";

// export enum CampfirePurpose {
//   Support = "support_circle",
//   Growth = "growth_group",
//   Creative = "creative_outlet",
//   General = "general_discussion",
// }
//support_circle, growth_group, creative_outlet, general_discussion

export interface CampfireRule {
  id: number;
  title: string;
  description: string | null;
  display_order: number;
}

//Campfire definition visibility options - type enum
export enum CampfireVisibility {
  Public = "public",
  // Private = "Private",
}

export enum CampfireRealm {
  Collaborative = "collaborative",
  Supportive = "supportive",
  Motivational = "motivational",
  Educational = "educational",
  Expressive = "expressive",
}

export enum CampfireLane {
  // Collaborative lanes
  Projects = "projects",
  Resources = "resources",
  Feedback = "feedback",
  Partnerships = "partnerships",

  // Supportive lanes
  Advice = "advice",
  Encouragement = "encouragement",
  Experiences = "experiences",
  Questions = "questions",

  // Motivational lanes
  Goals = "goals",
  Progress = "progress",
  Challenges = "challenges",
  Wins = "wins",

  // Educational lanes
  Tutorials = "tutorials",
  Guides = "guides",
  EducationalResources = "resources", // Note: duplicate key name with Collaborative
  QA = "qa",

  // Expressive lanes
  Showcase = "showcase",
  Creations = "creations",
  Discussion = "discussion",
  Inspiration = "inspiration",
}

// Campfire creation form schemas
export const MAX_WORDS = 20;

const StepOneSchema = z.object({
  name: z.string().min(2, { message: "Campfire name is required." }),
  description: z
    .string()
    .min(5, { message: "Please describe your Campfire." })
    .refine((val) => val.trim().split(/\s+/).length <= MAX_WORDS, {
      message: `Description must be ${MAX_WORDS} words or fewer.`,
    }),
});

const StepTwoSchema = z.object({
  visibility: z.enum(CampfireVisibility),
  realm: z.enum(CampfireRealm),
  lane: z.enum(CampfireLane),
  rules: z.array(z.string()).optional(),
});

const StepThreeSchema = z.object({
  icon_url: z.string().optional(),
  banner_url: z.string().optional(),
});

export const FullFormSchema =
  StepOneSchema.merge(StepTwoSchema).merge(StepThreeSchema);

export type FullFormType = z.infer<typeof FullFormSchema>;

// Campfire creation definition fields
export type CampfireFieldDefinition = {
  name: keyof FullFormType;
  label: string;
  type: "input" | "textarea" | "select" | "checkbox" | "file";
  placeholder?: string;
  options?: { value: string; label: string }[];
};

// Handle members count to human readable
export const formatMembers = (count: number): string => {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return count.toString();
};

// Campfire creation stepper steps
export const campfireFieldsByStep: CampfireFieldDefinition[][] = [
  // Step 1
  [
    {
      name: "name",
      label: "Campfire Name",
      type: "input",
      placeholder: "e.g., Mindful Mornings",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "What's this Campfire about?",
    },
  ],

  // Step 2
  [
    // {
    //   name: "purpose",
    //   label: "Purpose",
    //   type: "select",
    //   placeholder: "Select purpose",
    //   options: Object.values(CampfirePurpose).map((val) => ({
    //     value: val,
    //     label: val.replace("_", " ").toUpperCase(),
    //   })),
    // },
    {
      name: "visibility",
      label: "Visibility",
      type: "select",
      placeholder: "Select visibility",
      options: Object.values(CampfireVisibility).map((val) => ({
        value: val,
        label: val.replace("_", " ").toUpperCase(),
      })),
    },
    {
      name: "realm",
      label: "Realm",
      type: "select",
      placeholder: "Select realm",
      options: campfire_realms.map((realm) => ({
        value: realm.key,
        label: realm.name.replace("_", "").toUpperCase(),
      })),
    },
    {
      name: "lane",
      label: "Lane",
      type: "select",
      placeholder: "Select realm first",
      options: [],
    },
  ],

  // Step 3
  [
    {
      name: "icon_url",
      label: "Icon URL",
      type: "file",
      placeholder: "Optional icon image URL",
    },
    {
      name: "banner_url",
      label: "Banner URL",
      type: "file",
      placeholder: "Optional banner image URL",
    },
  ],
];

export interface CampfireAvatarInterface {
  avatarUrl: string | undefined | null;
  username: string;
  userRoute?: string;
  assignedRole?: string;
  title?: string;
  signedUrls?: Record<string, string>;
}

export const getBgSeverity = (purpose: string) => {
  switch (purpose) {
    case CampfireRealm.Supportive:
      return "bg-green-200 text-green-800";
    case CampfireRealm.Motivational:
      return "bg-orange-200 text-orange-800";
    case CampfireRealm.Collaborative:
      return "bg-yellow-200 text-yellow-800";
    default:
      return "bg-neutral-200 text-neutral-800";
  }
};

export interface UserCampfireFavoriteJoin {
  campfireId: string;
  name: string;
  slug: string;
  description: string;
  members: number;
  realm: CampfireRealm;
  lane: CampfireLane;
  iconURL?: string;
  isFavorite: boolean;
  isJoined: boolean;
  joinedAt?: string;
  role?: "firestarter" | "firekeeper" | "camper";
  favoritedAt?: string;
}
