import type { Options } from "nuqs";
import { useQueryStates } from "nuqs";
import { createLoader, parseAsString, type UrlKeys } from "nuqs/server";
import { createTypedLink } from "@/lib/typed-links";

const searchParams = {
  query: parseAsString.withDefault(""),
};

// short hand
const urlKeys: UrlKeys<typeof searchParams> = {
  query: "q",
};

export const loadFilters = createLoader(searchParams, { urlKeys });
// usage
/**
 * const filters = await loadFilters(searchParams); within your page component (SSR) that has searchParams as a parameter
 */

export const useFilters = () => useQueryStates(searchParams, { urlKeys });
/**
 * const [query, setQuery] = useFilters(); within your component (CSR). But this does not make a network request to the server , only work client side
 */

export const useFiltersServer = (options: Options = {}) =>
  useQueryStates(searchParams, { ...options, shallow: true, urlKeys });
/**
 * const [query, setQuery] = useFiltersServer(); within your component(client) . But this does make a network request to the server
 *
 * To debounce the updates to the url
 * const [query, setQuery] = useFiltersServer({limitUrlUpdates : debounce(250)});  // debounce is from nuqs
 *
 * to clear from url , you can use :
 * const onClear = () => setQuery(null);
 *
 * To show a loading state while the url is updating
 * const [query, setQuery] = useFiltersServer({loadingUrlUpdates : debounce(250) , startTransition,});
 */

/**
 *
 * EXAMPLE : To show a loading state while the url is updating
 *
 *
 * import { useTransition } from "react";
 *
 * const [isPending, startTransition] = useTransition();
 * const [query, setQuery] = useFiltersServer({startTransition,});
 *
 * <SearchInput value={query} onChange={(e)=>
 *      {startTransition( async ()=> { await setQuery({e.target.value}, {loadingUrlUpdates : e.targey.value ? debounce(250) : undefined ,} )})}}
 *      isLoading={isPending}/>
 */

// use case : typed links for a particular route
export const getAlbumsLink = createTypedLink("/albums", searchParams, {
  urlKeys,
});
