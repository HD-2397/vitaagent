/** @format */

import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod/v3";

export const ATSTool = new DynamicStructuredTool({
  name: "ATSScoring",
  description:
    "Critiques a resume for a specific job description and returns an ATS compatibility score and recommendations",
  schema: z.object({
    resume: z
      .string()
      .describe("The full plain-text version of the resume to evaluate"),
    jd: z
      .string()
      .describe("The full plain-text job description to evaluate against"),
  }),
  func: async ({ resume, jd }) => {
    return `
You are an expert ATS (Applicant Tracking System) evaluator. Compare the resume with the job description and return the following:

1. **Overall Match Score (0–100%)** – Based on relevance, keyword overlap, and formatting.
2. **Keyword Match** – List keywords from the JD that are present and missing in the resume.
3. **ATS Formatting Issues** – Flag any problems (e.g., columns, tables, graphics, unusual fonts, missing section headers).
4. **Action Verbs Check** – Does the resume use strong, measurable action verbs? Give examples or suggestions.
5. **Relevance Check** – Point out any irrelevant experience or gaps in qualifications.
6. **Suggestions for Improvement** – Concrete advice to improve alignment, phrasing, or keyword inclusion.
7. **Breakdown Score** – 
    - Keyword Match (out of 30)
    - Formatting & ATS Compliance (out of 20)
    - Relevance to JD (out of 30)
    - Language & Action Verbs (out of 20)

Respond in a clean markdown format.

Resume:
\`\`\`
${resume}
\`\`\`

Job Description:
\`\`\`
${jd}
\`\`\`
    `;
  },
});
