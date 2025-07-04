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

// const model = new ChatOpenAI({
//   temperature: 0.7,
//   modelName: "gpt-3.5-turbo", // or gpt-4 if needed
// });
//import { ChatOpenAI } from "langchain/chat_models/openai";

// const model = new ChatFireworks({
//   model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
//   temperature: 0,
// });


export async function runAgentWithTools(
  resumeText: string,
  jobDescription: string,
  tokenStreamHandler?: (token: string) => void
) {
  const tools = [CritiqueTool, ATSTool];

  // Trim resume + JD first
  const trimResultRaw = await TrimContentTool.invoke({
    resume: resumeText,
    jd: jobDescription,
  });

  const trimResult = JSON.parse(trimResultRaw);
  const { trimmed_resume, trimmed_jd } = trimResult;

  // Dynamically inject streaming callback into model
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama3-70b-8192",
    callbacks: tokenStreamHandler
      ? [
          {
            handleLLMNewToken: tokenStreamHandler,
          },
        ]
      : [],
  });

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are a helpful career assistant AI. You have access to tools that help you:
  
- Critique a candidate's resume against a job description in enough detail
- Score how well the resume matches the job description
  
Given a resume and job description, choose the appropriate tool to respond helpfully.`
    ),
    HumanMessagePromptTemplate.fromTemplate(
      `Here is the resume:

{resume}

And here is the job description:

{jd}`
    ),
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const agent = await createToolCallingAgent({
    llm: model,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: false,
    maxIterations: 3,
    returnIntermediateSteps: false,
  });

  const result = await agentExecutor.invoke({
    jd: trimmed_jd,
    resume: trimmed_resume,
  });

  return result?.output ?? "No critique was generated.";
}
