import { z } from "zod";

export const SearchResponseSchema = z.object({
  count: z.number(),
  results: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      artists: z.array(z.string()),
      artist_ids: z.array(z.string()),
      album: z.string(),
      album_id: z.string(),
    }),
  ),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;
