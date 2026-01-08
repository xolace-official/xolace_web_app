export type InteractionStyle =
  | "collaborative"
  | "supportive"
  | "motivational"
  | "educational"
  | "expressive";

export interface CampfireRealmInterface {
  id: string;
  key: InteractionStyle;
  name: string;
  description: string | null;
  sort_order: number;
  is_high_safety: boolean | null;
  lanes: [key: string, name: string][];
}

export interface CampfireDiscoveryInterface {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_path: string | null;
  member_count: number;
  interaction_style: InteractionStyle;
}

export const CAMPFIRE_REALMS: CampfireRealmInterface[] = [
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

export const DISCOVERY_DUMMY: CampfireDiscoveryInterface[] = [
  {
    id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    name: "x/techInnovators",
    slug: "tech-innovators",
    description:
      "A community for developers and tech enthusiasts to discuss the latest innovations in software development, AI, and emerging technologies.",
    icon_path: "/assets/images/landing-page/x-logo-full.webp",
    member_count: 12847,
    interaction_style: "collaborative",
  },
  {
    id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
    name: "x/createWritersHub",
    slug: "creative-writers-hub",
    description:
      "Share your stories, poetry, and creative writing projects. Get feedback from fellow writers and participate in weekly writing challenges.",
    icon_path: null,
    member_count: 8934,
    interaction_style: "supportive",
  },
  {
    id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
    name: "x/fitnessWarriors",
    slug: "fitness-warriors",
    description:
      "Join fellow fitness enthusiasts on their journey to health and wellness. Share workout routines, nutrition tips, and motivational stories.",
    icon_path: null,
    member_count: 15621,
    interaction_style: "motivational",
  },
  {
    id: "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
    name: "x/gamingLegends",
    slug: "gaming-legends",
    description:
      "The ultimate destination for gamers of all genres. Discuss strategies, find teammates, and stay updated on the latest gaming news.",
    icon_path: null,
    member_count: 23456,
    interaction_style: "collaborative",
  },
  {
    id: "5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t",
    name: "x/planParents",
    slug: "plant-parents-united",
    description:
      "For plant lovers and gardening enthusiasts. Share care tips, show off your green spaces, and help others troubleshoot plant problems.",
    icon_path: null,
    member_count: 6789,
    interaction_style: "educational",
  },
  {
    id: "6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u",
    name: "x/indieMusic",
    slug: "indie-music-scene",
    description:
      "Discover underground artists, share your own music, and connect with musicians and music lovers who appreciate authentic, independent sounds.",
    icon_path: null,
    member_count: 11234,
    interaction_style: "expressive",
  },
  {
    id: "7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v",
    name: "x/bookClub",
    slug: "book-club-collective",
    description:
      "A thriving community of readers discussing monthly book selections, sharing recommendations, and hosting virtual book club meetings.",
    icon_path: null,
    member_count: 9876,
    interaction_style: "expressive",
  },
  {
    id: "8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w",
    name: "x/photography",
    slug: "photography-masters",
    description:
      "Share your best shots, learn new techniques, and get constructive feedback from photographers of all skill levels.",
    icon_path: null,
    member_count: 14567,
    interaction_style: "educational",
  },
  {
    id: "9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x",
    name: "x/startupFounders",
    slug: "startup-founders-circle",
    description:
      "Connect with fellow entrepreneurs, share startup challenges and victories, and exchange valuable business insights and resources.",
    icon_path: null,
    member_count: 7845,
    interaction_style: "collaborative",
  },
  {
    id: "0j1k2l3m-4n5o-6p7q-8r9s-0t1u2v3w4x5y",
    name: "x/digitalArt",
    slug: "digital-art-gallery",
    description:
      "A vibrant space for digital artists to showcase their work, learn new techniques, and collaborate on creative projects.",
    icon_path: null,
    member_count: 10923,
    interaction_style: "supportive",
  },
];
