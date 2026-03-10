import { ChatOpenAI } from "@langchain/openai";

export const openRouter = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  modelName: "qwen/qwen3-coder",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "OPS AI DEV",
    },
  },
});

export const getOpenRouterModel = (model: string = "qwen/qwen3-coder") => {
  return new ChatOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    modelName: model,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "OPS AI DEV",
      },
    },
  });
};
