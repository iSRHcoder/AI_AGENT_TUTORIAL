import { error } from "node:console";

type Provider = "gemini" | "openai" | "groq";

type HelloOutput = {
  ok: true;
  provider: Provider;
  model: string;
  message: string;
};

type GeminiGenerateContent = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

const helloGemini = async (): Promise<HelloOutput> => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Google api key not found");

  const model = "gemini-3.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: "Say a short hello",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok)
    throw new Error(`Gemini ${response.status}:${await response.text()}`);

  const json = (await response.json()) as GeminiGenerateContent;
  const text =
    json.candidates?.[0]?.content?.parts?.[0]?.text ?? "Hello as default";

  return {
    ok: true,
    provider: "gemini",
    model,
    message: String(text).trim(),
  };
};

type GroqChatCompletion = {
  choices?: Array<{ message?: { content?: string } }>;
};

const helloGroq = async (): Promise<HelloOutput> => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq api key not found");

  const model = "groq/compound";
  const url = `https://api.groq.com/openai/v1/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: "Say a shot hello",
        },
      ],
      temperature: 0,
    }),
  });

  if (!response.ok)
    throw new Error(`Groq ${response.status}:${await response.text()}`);

  const json = (await response.json()) as GroqChatCompletion;
  const content = json.choices?.[0]?.message?.content ?? "Hello as default";

  return {
    ok: true,
    provider: "groq",
    model,
    message: String(content).trim(),
  };
};

type OpenAIChatCompletion = {
  choices?: Array<{ message?: { content?: string } }>;
};

const helloOpenAI = async (): Promise<HelloOutput> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI api key not found");
  const model = "gpt-4o";
  const url = `https://api.openai.com/v1/chat/completions`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: "Say a short hello",
        },
      ],
      temperature: 0,
    }),
  });
  if (!response.ok)
    throw new Error(`OpenAI ${response.status}:${await response.text()}`);
  const json = (await response.json()) as OpenAIChatCompletion;
  const content = json.choices?.[0]?.message?.content ?? "Hello as default";
  return {
    ok: true,
    provider: "openai",
    model,
    message: String(content).trim(),
  };
};

export const selectAndHello = async (): Promise<HelloOutput> => {
  const forced = (process.env.PROVIDER || "").toLowerCase();

  if (forced === "gemini") return helloGemini();
  if (forced === "groq") return helloGroq();
  if (forced === "openai") return helloOpenAI();

  if (forced)
    throw new Error(
      `Unsupported PROVIDER = ${forced}, use gemini | openai | groq instead`,
    );

  if (process.env.GOOGLE_API_KEY) {
    try {
      return await helloGemini();
    } catch {}
  }

  if (process.env.GROQ_API_KEY) {
    try {
      return await helloGroq();
    } catch {}
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      return await helloOpenAI();
    } catch {}
  }

  throw new Error("No Provider configured");
};
