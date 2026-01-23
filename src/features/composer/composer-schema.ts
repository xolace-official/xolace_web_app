import { z } from "zod";

export const composerSchema = z.object({
  content_text: z
    .string()
    .min(10, "Post must be at least 10 characters")
    .max(5000, "Post cannot exceed 5000 characters"),
  mood: z.enum([
    "neutral",
    "happy",
    "sad",
    "angry",
    "grateful",
    "melancholy",
    "peaceful",
    "excited",
    "confused",
    "thoughtful",
    "nostalgic",
    "reflecting",
    "processing",
    "chill",
    "energetic",
    "motivated",
    "venting",
    "ranting",
    "sharing",
    "seeking_advice",
    "creative",
    "inspired",
    "laughing",
  ]),
  author_display_mode: z.enum(["attributed", "anonymous"]),
  is_sensitive: z.boolean(),
  auto_expiry: z.boolean(),
  campfire_id: z.string().nullable(),
});

export type ComposerSchemaValues = z.infer<typeof composerSchema>;
