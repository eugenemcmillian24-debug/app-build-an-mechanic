import { ChatGroq } from "@langchain/groq";

export const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "llama-3.1-70b-versatile",
});

export const groqFast = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "llama-3.1-8b-instant",
});

export const getGroqModel = (complexity: 'simple' | 'complex' = 'complex') => {
  return complexity === 'simple' ? groqFast : groq;
};
