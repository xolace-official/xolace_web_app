import { useCallback, useState } from "react";
import { MAX_TAGS } from "../composer-constants";

export function useTagExtraction() {
  const [tags, setTags] = useState<string[]>([]);

  const extractTags = useCallback((text: string) => {
    const matches = text.match(/#(\w+)/g) || [];
    const unique = [...new Set(matches.map((m) => m.slice(1)))].slice(
      0,
      MAX_TAGS,
    );
    setTags(unique);
  }, []);

  const clearTags = useCallback(() => {
    setTags([]);
  }, []);

  return { tags, extractTags, clearTags };
}
