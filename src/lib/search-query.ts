import {
  SearchResponse,
  SearchResponseSchema,
} from "./schemas/responses/search";

export const getSearchResults = async (
  query: string,
): Promise<SearchResponse> => {
  const res = await fetch(`/api/search?query=${query}`);

  if (res.status !== 200) {
    throw Error();
  }

  return SearchResponseSchema.parse(await res.json());
};
