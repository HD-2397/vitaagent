/** @format */

import { runAgentWithTools } from "@/lib/agent/agentExecutor";

export async function POST(req: Request) {
  const { resumeText, jobDescription } = await req.json();

  if (!resumeText || !jobDescription) {
    return new Response("Missing data", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const push = (token: string) => {
        controller.enqueue(encoder.encode(token));
      };

      try {
        await runAgentWithTools(resumeText, jobDescription, push);
        controller.close();
      } catch (err) {
        console.error("Streaming error:", err);
        controller.enqueue(encoder.encode("❌ Error generating critique."));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
    },
  });
}
  
