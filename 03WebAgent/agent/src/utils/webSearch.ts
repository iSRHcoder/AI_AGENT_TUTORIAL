// search the internet tool
// u give it a natural language query (the users query)
// it calls tavily under the hood
// it returns a clean array of search his -> webSearchResultSchema

import { env } from "../shared/env";

export const webSearch = async (q: string) => {
  const query = (q ?? "").trim();

  if (!query) return [];

  return await searchTavilyUtil(query);
};

const searchTavilyUtil = async (query: string) => {
  if (!env.TAVILY_API_KEY) throw new Error("TAVILY_API_KEY is missing");
};
