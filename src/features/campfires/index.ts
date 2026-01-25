import {
  Heart,
  Lightbulb,
  MessageCircle,
  Palette,
  Sprout,
  Users,
} from "lucide-react";

export type InteractionStyle =
  | "collaborative"
  | "supportive"
  | "motivational"
  | "educational"
  | "expressive";

export type RealmKey = InteractionStyle | "all";

export interface CampfireRealmInterface {
  id: string;
  key: InteractionStyle;
  name: string;
  description: string | null;
  sort_order: number;
  is_high_safety: boolean | null;
  lanes: [key: string, name: string][];
}

interface Settings {
  guide_enabled?: boolean;
  guide_header_image?: string | null;
  guide_header_layout?: string | null;
  guide_show_on_join?: boolean;
  guide_welcome_message?: string;
}

interface Lane {
  id: string;
  key: string;
  name: string;
  is_high_safety: boolean | null;
}

interface Realm {
  id: string;
  key: string;
  name: string;
  is_high_safety: boolean | null;
}
// TypeScript Interface
export interface CampfireInterface {
  id: string;
  name: string;
  slug: string;
  isMember: boolean;
  description: string | null;
  icon_path: string | null;
  banner_path?: string | null;
  interaction_style: InteractionStyle;
  visibility?: string;
  member_count: number;
  created_at?: string;
  created_by?: string;
  realm?: Realm;
  lane?: Lane;
  settings?: Settings;
}

export const dummy_campfires: CampfireInterface[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "x/techInnovators",
    slug: "tech-innovators-hub",
    isMember: true,
    description:
      "A community for technology enthusiasts and innovators to share ideas and collaborate on cutting-edge projects.",
    icon_path: "/assets/icons/tech-hub.png",
    banner_path: "/assets/banners/tech-banner.jpg",
    interaction_style: "supportive",
    visibility: "public",
    member_count: 1247,
    created_at: "2025-11-15T08:30:00.000Z",
    created_by: "u1s2e3r4-5678-90ab-cdef-123456789012",
    realm: {
      id: "r1e2a3l4-m567-8901-abcd-ef1234567890",
      key: "technology",
      name: "Technology & Innovation",
      is_high_safety: null,
    },
    lane: {
      id: "l1a2n3e4-5678-90ab-cdef-123456789012",
      key: "tech_discussion",
      name: "Tech Discussion",
      is_high_safety: null,
    },
    settings: {
      guide_enabled: true,
      guide_header_image: "/assets/guides/tech-header.jpg",
      guide_header_layout: "full_width",
      guide_show_on_join: true,
      guide_welcome_message:
        "Welcome to Tech Innovators Hub! Share your ideas, ask questions, and connect with fellow tech enthusiasts.",
    },
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    name: "x/creativeWriters",
    slug: "creative-writers-circle",
    isMember: true,
    description:
      "A safe space for writers to share their work, get feedback, and improve their craft together.",
    icon_path: "/assets/icons/writers-circle.png",
    banner_path: "/assets/banners/writers-banner.jpg",
    interaction_style: "collaborative",
    visibility: "private",
    member_count: 342,
    created_at: "2025-12-01T14:20:00.000Z",
    created_by: "u2s3e4r5-6789-01ab-cdef-234567890123",
    realm: {
      id: "r2e3a4l5-m678-9012-bcde-f12345678901",
      key: "arts_culture",
      name: "Arts & Culture",
      is_high_safety: true,
    },
    lane: {
      id: "l2a3n4e5-6789-01ab-cdef-234567890123",
      key: "creative_writing",
      name: "Creative Writing",
      is_high_safety: true,
    },
    settings: {
      guide_enabled: true,
      guide_header_image: "/assets/guides/writers-header.jpg",
      guide_header_layout: "centered",
      guide_show_on_join: true,
      guide_welcome_message:
        "Welcome to our writing community! Please be respectful, constructive in feedback, and supportive of fellow writers.",
    },
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    name: "x/fitnessAwareness",
    isMember: false,
    slug: "fitness-wellness-warriors",
    description:
      "Motivate each other, share workout routines, nutrition tips, and celebrate health milestones together.",
    icon_path: "/assets/icons/fitness-warriors.png",
    banner_path: "/assets/banners/fitness-banner.jpg",
    interaction_style: "educational",
    visibility: "public",
    member_count: 2891,
    created_at: "2025-10-22T10:15:00.000Z",
    created_by: "u3s4e5r6-7890-12ab-cdef-345678901234",
    realm: {
      id: "r3e4a5l6-m789-0123-cdef-123456789012",
      key: "health_wellness",
      name: "Health & Wellness",
      is_high_safety: false,
    },
    lane: {
      id: "l3a4n5e6-7890-12ab-cdef-345678901234",
      key: "fitness_motivation",
      name: "Fitness & Motivation",
      is_high_safety: false,
    },
    settings: {
      guide_enabled: true,
      guide_header_image: null,
      guide_header_layout: null,
      guide_show_on_join: false,
      guide_welcome_message:
        "Let's get stronger together! Share your progress, challenges, and victories.",
    },
  },
  {
    id: "d4e5f6a7-b8c9-0123-def4-234567890123",
    name: "x/gameDevelopers",
    slug: "game-developers-network",
    isMember: false,
    description: "Game developers network association",
    icon_path: "/assets/images/landing-page/x-logo-full.webp",
    banner_path: null,
    interaction_style: "collaborative",
    visibility: "public",
    member_count: 567,
    created_at: "2026-01-05T16:45:00.000Z",
    created_by: "u4s5e6r7-8901-23ab-cdef-456789012345",
    realm: {
      id: "r4e5a6l7-m890-1234-def4-234567890123",
      key: "gaming",
      name: "Gaming & Entertainment",
      is_high_safety: null,
    },
    lane: {
      id: "l4a5n6e7-8901-23ab-cdef-456789012345",
      key: "game_dev",
      name: "Game Development",
      is_high_safety: false,
    },
    settings: {
      guide_enabled: false,
      guide_header_image: null,
      guide_header_layout: null,
      guide_show_on_join: false,
      guide_welcome_message: "Welcome to the Game Developers Network!",
    },
  },
  {
    id: "e5f6a7b8-c9d0-1234-ef56-345678901234",
    name: "x/sustainableLiving",
    isMember: true,
    slug: "sustainable-living-collective",
    description:
      "Join us in making eco-friendly choices, reducing waste, and building a sustainable future for our planet.",
    icon_path:
      "https://images.unsplash.com/photo-1768797767719-dad3da9a6e09?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    banner_path:
      "https://images.unsplash.com/photo-1768797767719-dad3da9a6e09?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    interaction_style: "expressive",
    visibility: "public",
    member_count: 1823,
    created_at: "2025-09-18T09:00:00.000Z",
    created_by: "u5s6e7r8-9012-34ab-cdef-567890123456",
    realm: {
      id: "r5e6a7l8-m901-2345-ef56-345678901234",
      key: "environment",
      name: "Environment & Sustainability",
      is_high_safety: true,
    },
    lane: {
      id: "l5a6n7e8-9012-34ab-cdef-567890123456",
      key: "sustainable_practices",
      name: "Sustainable Practices",
      is_high_safety: true,
    },
    settings: {
      guide_enabled: true,
      guide_header_image: "/assets/guides/sustainable-header.jpg",
      guide_header_layout: "full_width",
      guide_show_on_join: true,
      guide_welcome_message:
        "Together we can make a difference! Learn practical tips for sustainable living and share your eco-journey.",
    },
  },
];

export const campfire_realms: CampfireRealmInterface[] = [
  {
    id: "realm-1a2b3c4d-5e6f-7g8h-9i0j",
    key: "collaborative",
    name: "Collaborative",
    description:
      "Spaces for working together, sharing ideas, and building projects as a team",
    sort_order: 1,
    is_high_safety: false,
    lanes: [
      ["projects", "Projects"],
      ["resources", "Resources"],
      ["feedback", "Feedback"],
      ["partnerships", "Partnerships"],
    ],
  },
  {
    id: "realm-2b3c4d5e-6f7g-8h9i-0j1k",
    key: "supportive",
    name: "Supportive",
    description:
      "Communities focused on encouragement, advice, and helping each other through challenges",
    sort_order: 2,
    is_high_safety: true,
    lanes: [
      ["advice", "Advice"],
      ["encouragement", "Encouragement"],
      ["experiences", "Experiences"],
      ["questions", "Questions"],
    ],
  },
  {
    id: "realm-3c4d5e6f-7g8h-9i0j-1k2l",
    key: "motivational",
    name: "Motivational",
    description:
      "Energizing spaces for goal-setting, progress sharing, and pushing each other forward",
    sort_order: 3,
    is_high_safety: false,
    lanes: [
      ["goals", "Goals"],
      ["progress", "Progress"],
      ["challenges", "Challenges"],
      ["wins", "Wins"],
    ],
  },
  {
    id: "realm-4d5e6f7g-8h9i-0j1k-2l3m",
    key: "educational",
    name: "Educational",
    description:
      "Learning-focused communities for sharing knowledge, tutorials, and skill development",
    sort_order: 4,
    is_high_safety: false,
    lanes: [
      ["tutorials", "Tutorials"],
      ["guides", "Guides"],
      ["resources", "Resources"],
      ["qa", "Q&A"],
    ],
  },
  {
    id: "realm-5e6f7g8h-9i0j-1k2l-3m4n",
    key: "expressive",
    name: "Expressive",
    description:
      "Creative spaces for self-expression, artistic sharing, and authentic connections",
    sort_order: 5,
    is_high_safety: false,
    lanes: [
      ["showcase", "Showcase"],
      ["creations", "Creations"],
      ["discussion", "Discussion"],
      ["inspiration", "Inspiration"],
    ],
  },
];

// Get the icon and it color base on the interaction style
export const getInteractionConfig = (style: InteractionStyle) => {
  switch (style) {
    case "collaborative":
      return {
        icon: Users,
        iconColor: "text-accent",
      };
    case "supportive":
      return {
        icon: Heart,
        iconColor: "text-chart-1",
      };
    case "motivational":
      return {
        icon: Lightbulb,
        iconColor: "text-chart-5",
      };
    case "expressive":
      return {
        icon: Palette,
        iconColor: "text-chart-2",
      };
    case "educational":
      return {
        icon: Sprout,
        iconColor: "text-chart-4",
      };
    default:
      return {
        icon: MessageCircle,
        iconColor: "text-muted-foreground",
      };
  }
};

//Helper for getting campfire description base on the interaction style(purpose)
export const getPurposeDescription = (purpose: string) => {
  const descriptions: Record<string, string> = {
    general_discussion: "Open conversations and community discussions",
    support: "Peer support and mental health resources",
    education: "Learning and educational content sharing",
    professional: "Professional networking and career development",
    hobby: "Shared interests and hobby discussions",
    local_community: "Location-based community engagement",
  };
  return descriptions[purpose] || "Community discussions and engagement";
};

// Helper for Get campfire rank
export const getRankInfo = (memberCount: number) => {
  if (memberCount >= 10000) return { rank: "Top 1%", color: "text-yellow-600" };
  if (memberCount >= 5000) return { rank: "Top 2%", color: "text-orange-600" };
  if (memberCount >= 1000) return { rank: "Top 5%", color: "text-blue-600" };
  if (memberCount >= 500) return { rank: "Top 10%", color: "text-green-600" };
  return { rank: "Growing", color: "text-gray-600" };
};
