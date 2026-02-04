import type { Options } from "nuqs";
import { useQueryStates } from "nuqs";
import { createLoader, parseAsString, type UrlKeys } from "nuqs/server";
import { createTypedLink } from "@/lib/typed-links";

const searchParams = {
  query: parseAsString.withDefault(""),
  tab: parseAsString.withDefault("moderators"),
};

// short hand
const urlKeys: UrlKeys<typeof searchParams> = {
  query: "q",
  tab: "t",
};

export const loadModsFilters = createLoader(searchParams, { urlKeys });
// usage

export const useModsFilters = () => useQueryStates(searchParams, { urlKeys });

export const useModsFiltersServer = (options: Options = {}) =>
  useQueryStates(searchParams, { shallow: true, urlKeys, ...options });

// use case : typed links for a particular route
export const getModsLink = createTypedLink("/albums", searchParams, {
  urlKeys,
});
