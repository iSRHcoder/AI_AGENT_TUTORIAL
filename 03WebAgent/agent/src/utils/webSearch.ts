// search the internet tool
// u give it a natural language query (the users query)
// it calls tavily under the hood
// it returns a clean array of search his -> webSearchResultSchema

import { env } from "../shared/env";
import { webSearchResultSchema, webSearchResultsSchema } from "./schemas";

export const webSearch = async (q: string) => {
  const query = (q ?? "").trim();

  if (!query) return [];

  return await searchTavilyUtil(query);
};

const searchTavilyUtil = async (query: string) => {
  if (!env.TAVILY_API_KEY) throw new Error("TAVILY_API_KEY is missing");

  const response = await fetch("http://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      search_depth: "basic",
      max_results: 5,
      include_answer: false,
      include_image: false,
    }),
  });

  if (!response.ok) {
    const text = await safeText(response);
    throw new Error("Tavily error, ${response.status}-${text}");
  }

  const data = await response.json();
  const results = Array.isArray(data?.results) ? data.results : [];

  const normalized = results.slice(0, 5).map((r: any) =>
    webSearchResultSchema.parse({
      title: String(r?.title ?? "").trim() || "Untitled",
      url: String(r?.url ?? "").trim(),
      snippet: String(r?.content ?? "")
        .trim()
        .slice(0, 220),
    }),
  );

  return webSearchResultsSchema.parse(normalized);
};
