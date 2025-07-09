/** @format */

import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";

export const StrategyTool = new DynamicStructuredTool({
  name: "strategy_tool",
  description:
    "Use this to answer user-specific questions about the resume and job description, such as how to improve, tailor, or position the resume better.",
  schema: z.object({
    resume: z.string(),
    jd: z.string(),
    question: z.string(),
  }),
  func: async ({ resume, jd, question }) => {
    const prompt = `
                You are a strategic career advisor AI.

                Given the following:
                - Resume content
                - Job description
                - A specific question from the user

                Your task is to give clear, actionable, and personalized guidance to the user. Focus on:
                - How they can better tailor their resume for this job
                - Strategic positioning advice for specific roles
                - Resume narrative alignment
                - Highlighting or adjusting key skills
                - Addressing user concerns directly

                Resume:
                ${resume}

                Job Description:
                ${jd}

                User Question:
                ${question}

                Your answer:
                `;

    return prompt;
  },
});
