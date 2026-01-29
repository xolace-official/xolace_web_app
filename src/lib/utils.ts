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
    new URL(url);
    return true;
  } catch (e) {
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
