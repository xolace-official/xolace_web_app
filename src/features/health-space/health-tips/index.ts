export const HEALTH_TIPS_BASE_URL = "health-tips";

export type SensitiveLevel = "general" | "mild" | "sensitive";

export type Frontmatter = {
  title: string;
  author_name: string;
  created_at: Date;
  content: string;
};

export type HealthTip = Frontmatter & { id: number };
