/** @format */

import { runAgentWithTools } from "@/lib/agent/agentExecutor";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const critique = await runAgentWithTools(resumeText, jobDescription);

    if (!critique) {
      return NextResponse.json(
        { error: "Agent returned no critique" },
        { status: 500 }
      );
    }

    return NextResponse.json({ critique }, { status: 200 });
  } catch (err) {
    console.error("Error running critique:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
