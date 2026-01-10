export const HEALTH_TIPS_BASE_URL = "health-tips";

export type SensitiveLevel = "general" | "mild" | "sensitive";

export interface Category {
  key: string;
  display_name: string;
}

export interface Tag {
  name: string;
}

export interface Author {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

export interface Sponsor {
  is_sponsored: boolean;
  sponsor_label: string | null;
}

export interface HealthArticleInterface {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  content_format: string;
  read_time_minutes: number;
  language_code: string;
  published_at: string | null;
  sensitive_level: SensitiveLevel;
  category: Category;
  tags: Tag[];
  author: Author;
  sponsor: Sponsor;
}

// Dummy Data
export const healthArticles: HealthArticleInterface[] = [
  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    title: "Managing Workplace Stress: 5 Techniques That Actually Work",
    slug: "managing-workplace-stress-techniques",
    excerpt:
      "Discover evidence-based strategies to reduce work-related stress and improve your mental wellbeing throughout the day.",
    content:
      "Work-related stress affects millions of people daily. This article explores practical, science-backed techniques including time-blocking, boundary setting, mindful breaks, breathing exercises, and workspace optimization. Learn how to recognize stress triggers and implement sustainable habits that promote mental clarity and emotional balance.",
    content_format: "markdown",
    read_time_minutes: 7,
    language_code: "en-US",
    published_at: "2025-01-05T09:00:00Z",
    sensitive_level: "general",
    category: {
      key: "stress",
      display_name: "Stress Management",
    },
    tags: [
      { name: "workplace wellness" },
      { name: "stress relief" },
      { name: "productivity" },
    ],
    author: {
      id: "auth-001",
      username: "dr_emily_rodriguez",
      avatar_url: "https://example.com/avatars/emily.jpg",
    },
    sponsor: {
      is_sponsored: false,
      sponsor_label: null,
    },
  },
  {
    id: "f9e8d7c6-b5a4-4938-a2b1-c3d4e5f6a7b8",
    title: "Understanding Anxiety: When Worry Becomes Overwhelming",
    slug: "understanding-anxiety-when-worry-overwhelming",
    excerpt:
      "Learn to identify the difference between normal worry and anxiety disorders, plus coping strategies for managing anxious thoughts.",
    content:
      "Anxiety is more than just feeling stressed. This comprehensive guide helps you understand the spectrum of anxiety, from everyday nervousness to clinical anxiety disorders. Explore symptoms like racing thoughts, physical tension, sleep disturbances, and avoidance behaviors. Includes grounding techniques, cognitive restructuring exercises, and guidance on when to seek professional help.",
    content_format: "markdown",
    read_time_minutes: 10,
    language_code: "en-US",
    published_at: "2025-01-03T14:30:00Z",
    sensitive_level: "mild",
    category: {
      key: "anxiety",
      display_name: "Anxiety & Worry",
    },
    tags: [
      { name: "mental health" },
      { name: "anxiety relief" },
      { name: "coping strategies" },
      { name: "emotional wellness" },
    ],
    author: {
      id: "auth-002",
      username: "therapist_james_kim",
      avatar_url: null,
    },
    sponsor: {
      is_sponsored: true,
      sponsor_label: "Sponsored by MindfulCare Therapy",
    },
  },
  {
    id: "c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f",
    title: "Healing from Trauma: A Gentle Guide to Recovery",
    slug: "healing-from-trauma-gentle-guide",
    excerpt: null,
    content:
      "Trauma affects everyone differently, and there's no single path to healing. This sensitive exploration covers trauma responses including hypervigilance, emotional numbness, flashbacks, and difficulty trusting others. We discuss trauma-informed approaches such as EMDR, somatic experiencing, and establishing safety. Important note: This article contains discussions of trauma that some readers may find triggering. Resources for immediate support are provided at the end.",
    content_format: "markdown",
    read_time_minutes: 15,
    language_code: "en-US",
    published_at: "2024-12-28T11:00:00Z",
    sensitive_level: "sensitive",
    category: {
      key: "trauma",
      display_name: "Trauma & Recovery",
    },
    tags: [
      { name: "trauma recovery" },
      { name: "PTSD" },
      { name: "healing journey" },
      { name: "mental health support" },
    ],
    author: {
      id: "auth-003",
      username: "dr_maya_patel",
      avatar_url: "https://example.com/avatars/maya.jpg",
    },
    sponsor: {
      is_sponsored: false,
      sponsor_label: null,
    },
  },
  {
    id: "d8e9f0a1-b2c3-4d5e-6f7a-8b9c0d1e2f3a",
    title: "Depression Isn't Just Sadness: Recognizing the Hidden Signs",
    slug: "depression-hidden-signs-recognition",
    excerpt:
      "Depression often manifests in unexpected ways. Learn to identify subtle symptoms and understand when it's time to reach out for help.",
    content:
      "Clinical depression goes beyond feeling sad. Many people experience it as emotional numbness, persistent fatigue, loss of interest in previously enjoyed activities, changes in appetite or sleep patterns, difficulty concentrating, and feelings of worthlessness. This article explores the neurobiological basis of depression, debunks common myths, and provides information about treatment options including therapy, medication, lifestyle changes, and support systems. Remember: depression is a medical condition, not a personal failing.",
    content_format: "markdown",
    read_time_minutes: 12,
    language_code: "en-US",
    published_at: "2025-01-08T08:15:00Z",
    sensitive_level: "mild",
    category: {
      key: "depression",
      display_name: "Depression & Mood",
    },
    tags: [
      { name: "depression awareness" },
      { name: "mental health" },
      { name: "treatment options" },
      { name: "self-care" },
    ],
    author: {
      id: "auth-004",
      username: "counselor_alex_thompson",
      avatar_url: "https://example.com/avatars/alex.jpg",
    },
    sponsor: {
      is_sponsored: true,
      sponsor_label: "In partnership with Mental Health America",
    },
  },
];

export type Frontmatter = {
  title: string;
  author_name: string;
  created_at: Date;
  content: string;
};

export type HealthTip = Frontmatter & { id: number };
