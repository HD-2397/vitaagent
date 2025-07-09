/** @format */
import { ChatOpenAI } from "@langchain/openai";
import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

// Zod schema
const trimSchema = z.object({
  trimmed_resume: z.string().describe("The trimmed down version of the resume"),
  trimmed_jd: z
    .string()
    .describe("The trimmed down version of the job description"),
});

const parser = StructuredOutputParser.fromZodSchema(trimSchema);

const formatInstructions = parser.getFormatInstructions();

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an assistant that extracts only the most relevant sections from a resume and job description for AI-based critique and scoring.
  
  Always return a valid JSON object. 
  ❌ Do NOT include code blocks, backticks, or markdown syntax (e.g. \`\`\`json).
  ✅ Only respond with raw JSON starting with {{ and ending with }}.`,
  ],
  [
    "human",
    `Trim the following resume and job description to only the most important and relevant sections for ATS-based critique and scoring.
  
  ### Guidelines:
  
  1. **Preserve content that improves ATS scoring**, including:
     - Strong action verbs (e.g., led, built, optimized, implemented).
     - Measurable achievements and quantified impact.
     - Skills, tools, technologies, certifications.
     - Relevant job titles, company names, and dates.
  
  2. **Prioritize Job Relevance**:
     - Keep only experience, projects, and skills that align with the job description.
     - Summarize long or repetitive entries, but retain evaluative substance.
  
  3. **Job Description Trimming**:
     - Retain all core responsibilities, required skills, and qualifications.
     - Remove generic intro/outro text, company mission/culture blurbs.
  
  4. **Output Limits**:
     - Try to keep the total combined token count under 6000.
     - If trimming is needed, prioritize the **resume** over the job description.
  
  5. **Format**:
     - Respond with raw JSON only (no markdown or code blocks).
     - Structure: 
       {{
         "trimmed_resume": "Optimized resume content here...",
         "trimmed_jd": "Optimized job description content here..."
  }}
  
  {formatInstructions}
  
  Resume:
  {resume}
  
  Job Description:
  {jd}
  `,
  ],
]);
  

/*
    Using gpt-3.5-turbo for faster, cheaper processing, before passing to Groq for final critique.
    This allows to keep token counts low and avoid hitting Groq's limits.
*/
const lightModel = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-3.5-turbo",
  temperature: 0.3,
});

export const TrimContentTool = new DynamicStructuredTool({
  name: "TrimContent",
  description:
    "Trims resume and job description to only include relevant sections for AI critique. Ensures content stays within 6000 tokens when combined.",
  schema: z.object({
    resume: z.string().describe("Full resume text"),
    jd: z.string().describe("Full job description text"),
  }),
  func: async ({ resume, jd }) => {

    console.log("Calling TrimContentTool with resume and JD...");
    const prompt = await promptTemplate.formatMessages({
      resume,
      jd,
      formatInstructions,
    });

    const response = await lightModel.invoke(prompt);

    try {
      const rawContent = Array.isArray(response.content)
        ? response.content.map((c) => ("text" in c ? c.text : "")).join("\n")
        : response.content.toString();

      const cleanedContent = rawContent.replace(/```json|```/g, "").trim();

      const parsed = await parser.parse(cleanedContent);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      console.error("❌ Error parsing JSON:", e);
      console.log("🔎 LLM Response:", response.content);
      return "Failed to parse JSON.";
    }
  },
});
