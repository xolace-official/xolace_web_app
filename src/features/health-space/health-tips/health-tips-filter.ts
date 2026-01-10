import type { Options } from "nuqs";
import { useQueryStates } from "nuqs";
import { createLoader, parseAsString, type UrlKeys } from "nuqs/server";
import { createTypedLink } from "@/lib/typed-links";
import { HEALTH_TIPS_BASE_URL } from "@/features/health-space/health-tips/index";

const searchParams = {
  query: parseAsString.withDefault(""),
  category: parseAsString.withDefault("all"),
  sensitivity: parseAsString.withDefault("all"),
};

const urlKeys: UrlKeys<typeof searchParams> = {
  query: "q",
  category: "c",
  sensitivity: "s",
};

export const loadHealthTipsFilters = createLoader(searchParams, { urlKeys });

export const useHealthTipsFilters = () =>
  useQueryStates(searchParams, { urlKeys });

export const useHealthTipsFiltersServer = (options: Options = {}) =>
  useQueryStates(searchParams, { shallow: true, urlKeys, ...options });

export const getHealthTipsLink = createTypedLink(
  `/${HEALTH_TIPS_BASE_URL}`,
  searchParams,
  {
    urlKeys,
  },
);
