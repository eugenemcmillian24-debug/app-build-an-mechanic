import { StateGraph, Annotation, MessagesAnnotation } from "@langchain/langgraph";
import { groq } from "./groq";
import { openRouter } from "./openrouter";

// Define the state for our agents
const AgentState = MessagesAnnotation;

// Define the different agents as nodes in the graph
const instructionAgentNode = async (state: typeof AgentState.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  
  // Here we would call the LLM with the instruction prompt
  const response = await groq.invoke(messages);
  return { messages: [response] };
};

const mechanicAgentNode = async (state: typeof AgentState.State) => {
  const { messages } = state;
  // Here we would call the LLM with the mechanic prompt
  const response = await groq.invoke(messages);
  return { messages: [response] };
};

const aiLabAgentNode = async (state: typeof AgentState.State) => {
  const { messages } = state;
  // AI Lab acts as orchestrator
  const response = await groq.invoke(messages);
  return { messages: [response] };
};

// Build the graph
const builder = new StateGraph(AgentState)
  .addNode("instruction", instructionAgentNode)
  .addNode("mechanic", mechanicAgentNode)
  .addNode("aiLab", aiLabAgentNode)
  .addEdge("__start__", "aiLab"); // Default entry point

export const graph = builder.compile();
