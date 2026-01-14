export const GLIMPSE_BASE_URL = "glimpse";

export interface GlimpseInterface {
  id: string;
  bunny_video_id: string;
  thumbnail_url: string;
  duration_seconds: number;
  title: string | null;
  description: string | null;
  author_profile_id: string;
  author_display_name: string;
  author_avatar_url: string;
  likes_count: number;
  views_count: number;
  saves_count: number;
  is_featured: boolean;
  is_recommended: boolean;
  published_at: Date | string | number;
  tags: string[];
}

export interface GlimpsePaginationMeta {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface GlimpseResponseInterface {
  data: GlimpseInterface[];
  meta: GlimpsePaginationMeta;
}

// Dummy data with placeholder images
export const dummyGlimpses: GlimpseResponseInterface = {
  data: [
    {
      id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      bunny_video_id: "video_12345",
      thumbnail_url: "https://picsum.photos/seed/cooking/400/600",
      duration_seconds: 45,
      title: "Quick Pasta Recipe",
      description: "Learn how to make delicious pasta in under 15 minutes!",
      author_profile_id: "user_001",
      author_display_name: "Chef Maria",
      author_avatar_url: "https://picsum.photos/seed/maria/100/100",
      likes_count: 1250,
      views_count: 15000,
      saves_count: 340,
      is_featured: true,
      is_recommended: true,
      published_at: "2026-01-10T14:30:00Z",
      tags: ["cooking", "pasta", "quick-recipes", "italian"],
    },
    {
      id: "f6e5d4c3-b2a1-4d5e-9f8a-7b6c5d4e3f2a",
      bunny_video_id: "video_67890",
      thumbnail_url: "https://picsum.photos/seed/workout/400/600",
      duration_seconds: 60,
      title: "Morning Workout Routine",
      description: "Start your day with this energizing 60-second workout",
      author_profile_id: "user_002",
      author_display_name: "FitLife Jake",
      author_avatar_url: "https://picsum.photos/seed/jake/100/100",
      likes_count: 2100,
      views_count: 28500,
      saves_count: 890,
      is_featured: true,
      is_recommended: true,
      published_at: "2024-01-12T08:15:00Z",
      tags: ["fitness", "workout", "morning-routine", "health"],
    },
    {
      id: "9a8b7c6d-5e4f-4321-b0c9-d8e7f6a5b4c3",
      bunny_video_id: "video_11223",
      thumbnail_url: "https://picsum.photos/seed/mike/100/100",
      duration_seconds: 30,
      title: null,
      description: null,
      author_profile_id: "user_003",
      author_display_name: "Wanderlust Sarah",
      author_avatar_url: "https://picsum.photos/seed/sarah/100/100",
      likes_count: 780,
      views_count: 9200,
      saves_count: 210,
      is_featured: false,
      is_recommended: true,
      published_at: "2024-01-13T16:45:00Z",
      tags: ["travel", "adventure", "nature", "sunset"],
    },
    {
      id: "3d2c1b0a-9e8f-4567-a1b2-c3d4e5f6a7b8",
      bunny_video_id: "video_44556",
      thumbnail_url: "https://picsum.photos/seed/mike/100/100",
      duration_seconds: 55,
      title: "iPhone Hidden Features",
      description: "5 hidden iPhone features you probably didn't know about!",
      author_profile_id: "user_004",
      author_display_name: "TechGuru Mike",
      author_avatar_url: "https://picsum.photos/seed/mike/100/100",
      likes_count: 3400,
      views_count: 52000,
      saves_count: 1200,
      is_featured: true,
      is_recommended: true,
      published_at: "2024-01-11T11:20:00Z",
      tags: ["technology", "iphone", "tips", "tutorial", "smartphone"],
    },
  ],
  meta: {
    totalCount: 47,
    currentPage: 1,
    pageSize: 4,
    hasNextPage: true,
  },
};
