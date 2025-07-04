import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod/v3";

export const ATSTool = new DynamicStructuredTool({
  name: "ATSScoring",
  description: "Returns a resume's match score for a job description",
  schema: z.object({
    resume: z.string().describe("The resume text to critique"),
    jd: z.string().describe("The job description text to use for critique"),
  }),
  func: async ({ resume, jd }) => {
    return `Score the resume on a scale of 0–100% for this JD:\n\nResume:\n${resume}\n\nJD:\n${jd}`;
  },
});