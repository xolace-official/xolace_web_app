export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const helpFaqs: FaqItem[] = [
  {
    id: "what-is-xolace",
    question: "What is Xolace?",
    answer:
      "Xolace is a hybrid social + mental-wellness platform built around the idea of a digital campfire — a place where people can show up honestly without performing. It's designed for emotional expression, anonymous sharing, and gentle reflection.",
  },
  {
    id: "is-xolace-therapy",
    question: "Is Xolace a therapy app?",
    answer:
      "No, Xolace is not therapy and does not replace professional help. Instead, Xolace exists before, between, and outside of therapy — especially for people who don't know what they need yet.",
  },
  {
    id: "anonymous-posting",
    question: "Can I post anonymously?",
    answer:
      "Yes! Xolace supports anonymous posting. You can share your thoughts without revealing your identity, creating a safe space for authentic self-expression.",
  },
  {
    id: "sensitive-content",
    question: "What is sensitive content?",
    answer:
      "Sensitive content includes posts that may contain emotional or triggering topics. You can mark your posts as sensitive, and users can choose how they want to view such content in their preferences.",
  },
  {
    id: "campfires",
    question: "What are Campfires?",
    answer:
      "Campfires are intimate group spaces where you can gather with others around shared topics or feelings. Think of them as cozy corners of Xolace where deeper conversations happen.",
  },
  {
    id: "data-privacy",
    question: "How is my data protected?",
    answer:
      "We take your privacy seriously. Your data is encrypted and we never sell your information to third parties. You can request to delete your account and all associated data at any time.",
  },
  {
    id: "daily-prompts",
    question: "What are daily prompts?",
    answer:
      "Daily prompts are gentle nudges to help you express yourself. They're optional reflections designed to help you check in with how you're feeling.",
  },
  {
    id: "report-content",
    question: "How do I report inappropriate content?",
    answer:
      "You can report any post or comment by tapping the three dots menu and selecting 'Report'. Our team reviews all reports to maintain a safe community.",
  },
];
