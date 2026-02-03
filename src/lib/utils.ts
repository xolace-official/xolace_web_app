import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function setCookie(name: string, value: string, maxAge: number) {
  if (typeof window !== "undefined" && window.cookieStore) {
    try {
      await window.cookieStore.set({
        name,
        value,
        path: "/",
        // maxAge is in seconds, expires expects ms timestamp
        expires: Date.now() + maxAge * 1000,
      });
      return;
    } catch (e) {
      console.error("Failed to use cookieStore", e);
    }
  }

  // biome-ignore lint/suspicious/noDocumentCookie: Fallback for browsers without cookieStore
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

export function createIframeLink(videoId: string, startTime?: number) {
  let base = `https://iframe.mediadelivery.net/embed/468693/${videoId}?autoplay=true&preload=true`;

  if (startTime && startTime > 0) {
    base += `&start=${startTime}`;
  }

  return base;
}

export const isValidUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch (_) {
    return false;
  }
};

// utils function to substitute {username} with actual username if it is present
export const substituteUsername = (str: string, username: string) => {
  if (str.includes("{username}")) {
    return str.replace("{username}", username);
  }
  return str;
};

export function generateSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export function generateCampfireSlug(text: string) {
  return (
    text
      .toString()
      .trim()
      .toLowerCase()
      // Replace accented characters (e.g., é → e)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Replace spaces & underscores with hyphens
      .replace(/[\s_]+/g, "-")
      // Remove invalid chars (anything not a-z, 0-9, or hyphen)
      .replace(/[^a-z0-9-]/g, "")
      // Remove multiple hyphens
      .replace(/-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}
