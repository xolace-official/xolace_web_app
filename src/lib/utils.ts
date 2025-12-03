import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
      })
      return
    } catch (e) {
      console.error("Failed to use cookieStore", e)
    }
  }

  // biome-ignore lint/suspicious/noDocumentCookie: Fallback for browsers without cookieStore
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`
}
