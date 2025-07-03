/** @format */

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { resumeText, jobDescription } = await req.json();

  if (!resumeText || !jobDescription) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  //const critique = await generateCritique(resumeText, jobDescription); // your GenAI call

  // Simulate AI critique
  const critique = `
   Your resume is mostly aligned with the JD, but consider:
   - Adding more measurable impact on your past roles.
   - Emphasizing leadership/initiative using action verbs.
   - Tailoring your skills section to match keywords like "${
     jobDescription?.split(" ")[0]
   }".
   `;

  return NextResponse.json({ critique }, { status: 200 });
}
