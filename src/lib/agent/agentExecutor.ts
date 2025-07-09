/** @format */

//import { ChatOpenAI } from "@langchain/openai";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";

import { ChatGroq } from "@langchain/groq";
import { TrimContentTool } from "../tools/TrimContentTool";
import { ATSTool } from "../tools/AtsTool";
import { CritiqueTool } from "../tools/ResumeCritiqueTool";
import { StrategyTool } from "../tools/StrategyTool";

/*
Keeping these commented out for now, as we're using Groq.
const model = new ChatOpenAI({
  temperature: 0.7,
  modelName: "gpt-3.5-turbo", // or gpt-4 if needed
});
import { ChatOpenAI } from "langchain/chat_models/openai";

const model = new ChatFireworks({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  temperature: 0,
});
*/

export async function runAgentWithTools(
  resumeText: string,
  jobDescription: string,
  tokenStreamHandler?: (token: string) => void,
  userQuestion?: string
) {
  const tools = [CritiqueTool, ATSTool, StrategyTool];

  // Step 1: Trim resume and JD
  const trimResultRaw = await TrimContentTool.invoke({
    resume: resumeText,
    jd: jobDescription,
  });

  const trimResult = JSON.parse(trimResultRaw);
  const { trimmed_resume, trimmed_jd } = trimResult;

  // Step 2: Set up LLM with streaming
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama3-70b-8192",
    streaming: true,
    callbacks: tokenStreamHandler
      ? [
          {
            handleLLMNewToken: tokenStreamHandler,
          },
        ]
      : [],
  });

  // Step 3: Create dynamic prompt
  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are a helpful career assistant AI. You have access to tools that help you:
  
  - Critique a candidate's resume against a job description in enough detail
  - Score how well the resume matches the job description
  - Suggest strategies they can use to improve their resume
  
  Given a resume and job description:
  
  1. If the user has asked a question, prioritize answering it thoughtfully using the most relevant tool(s), especially the strategy tool if the question relates to resume improvement, job matching, or application advice.
  2. If no question is provided, analyze the resume and job description using the critique and ATS scoring tools to give a helpful and detailed assessment.`
    ),
    HumanMessagePromptTemplate.fromTemplate(
      `Here is the resume:
  
  {resume}
  
  Here is the job description:
  
  {jd}
  
  ${
    userQuestion?.trim()
      ? `The user has asked the following question. Please prioritize answering it using the strategy tool:\n\n"${userQuestion.trim()}"`
      : "There is no user question. Please perform a critique and ATS match score."
  }`.trim()
    ),
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  // Step 4: Create and run agent
  const agent = await createToolCallingAgent({
    llm: model,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
    maxIterations: 3,
    returnIntermediateSteps: false,
  });

  // Step 5: Invoke the agent (streamed response)
  await agentExecutor.invoke({
    jd: trimmed_jd,
    resume: trimmed_resume,
    question: userQuestion?.trim() || "", // Pass user question if provided
  });
}
