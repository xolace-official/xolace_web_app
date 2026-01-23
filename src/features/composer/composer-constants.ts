import type { MoodOption, StarterPrompt } from "./composer-types";

export const CONTENT_MIN_LENGTH = 10;
export const CONTENT_MAX_LENGTH = 5000;
export const MAX_TAGS = 3;

export const MOOD_OPTIONS: MoodOption[] = [
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "angry", label: "Angry", emoji: "😠" },
  { value: "grateful", label: "Grateful", emoji: "🙏" },
  { value: "melancholy", label: "Melancholy", emoji: "😔" },
  { value: "peaceful", label: "Peaceful", emoji: "☮️" },
  { value: "excited", label: "Excited", emoji: "🤩" },
  { value: "confused", label: "Confused", emoji: "😕" },
  { value: "thoughtful", label: "Thoughtful", emoji: "🤔" },
  { value: "nostalgic", label: "Nostalgic", emoji: "🥹" },
  { value: "reflecting", label: "Reflecting", emoji: "🪞" },
  { value: "processing", label: "Processing", emoji: "⏳" },
  { value: "chill", label: "Chill", emoji: "😌" },
  { value: "energetic", label: "Energetic", emoji: "⚡" },
  { value: "motivated", label: "Motivated", emoji: "💪" },
  { value: "venting", label: "Venting", emoji: "💨" },
  { value: "ranting", label: "Ranting", emoji: "🗣️" },
  { value: "sharing", label: "Sharing", emoji: "💬" },
  { value: "seeking_advice", label: "Seeking Advice", emoji: "🙋" },
  { value: "creative", label: "Creative", emoji: "🎨" },
  { value: "inspired", label: "Inspired", emoji: "✨" },
  { value: "laughing", label: "Laughing", emoji: "😂" },
];

export const STARTER_PROMPTS: StarterPrompt[] = [
  { id: "1", text: "Today I'm feeling..." },
  { id: "2", text: "Something I've been thinking about..." },
  { id: "3", text: "I need advice on..." },
  { id: "4", text: "A small win I want to share..." },
  { id: "5", text: "What's been on my mind lately..." },
];

export const PLACEHOLDERS = [
  "What's on your mind?",
  "Use # for tags (max 3)",
  "Share your thoughts...",
];
