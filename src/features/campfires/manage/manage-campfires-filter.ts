import type { Options } from "nuqs";
import { useQueryStates } from "nuqs";
import { parseAsString, type UrlKeys } from "nuqs/server";

const searchParams = {
  tab: parseAsString.withDefault("allCampfires"),
  query: parseAsString.withDefault(""),
};

const urlKeys: UrlKeys<typeof searchParams> = { tab: "t", query: "q" };

export const useManageCampfiresFilters = (options: Options = {}) =>
  useQueryStates(searchParams, { shallow: true, urlKeys, ...options });
