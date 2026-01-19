import type { Options } from "nuqs";
import { useQueryStates } from "nuqs";
import { createLoader, parseAsString, type UrlKeys } from "nuqs/server";
import { createTypedLink } from "@/lib/typed-links";
import { GLIMPSE_BASE_URL } from "@/features/health-space/glimpse/index";

const searchParams = {
  query: parseAsString.withDefault(""),
  tab: parseAsString.withDefault("all"),
};

const urlKeys: UrlKeys<typeof searchParams> = {
  query: "q",
  tab: "t",
};

export const loadGlimpseFilters = createLoader(searchParams, { urlKeys });

export const useGlimpseFilters = () =>
  useQueryStates(searchParams, { urlKeys });

export const useGlimpseFiltersServer = (options: Options = {}) =>
  useQueryStates(searchParams, { shallow: true, urlKeys, ...options });

export const getGlimpseLink = createTypedLink(
  `/${GLIMPSE_BASE_URL}`,
  searchParams,
  {
    urlKeys,
  },
);
