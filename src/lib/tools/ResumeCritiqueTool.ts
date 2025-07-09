import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod/v3";

// TOOL 1: Resume Critique Tool
export const CritiqueTool = new DynamicStructuredTool({
  name: "CritiqueResume",
  description: "Provides detailed resume critique based on job description",
  schema: z.object({
    resume: z.string().describe("The resume text to critique"),
    jd: z.string().describe("The job description text to use for critique"),
  }),
  func: async ({ resume, jd }) => {
    return `Pretend you're a hiring manager. Critique this resume:\n\nResume:\n${resume}\n\nFor Job Description:\n${jd}. Be strict and detailed.`;
  },
});
