import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const jobDescription = formData.get("jobDescription") as string || "";

    if (!file) {
      return NextResponse.json({ error: "No resume file provided" }, { status: 400 });
    }

    let resumeText = "";

    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const pdfParse = (await import("pdf-parse")).default;
      const pdfData = await pdfParse(buffer);
      resumeText = pdfData.text;
    } else {
      resumeText = await file.text();
    }

    if (!resumeText.trim()) {
      return NextResponse.json({ error: "Could not extract text from the resume" }, { status: 400 });
    }

    const systemPrompt = `You are an expert resume analyst, career coach, and ATS (Applicant Tracking System) specialist with 15+ years of experience. 
Analyze resumes comprehensively and return ONLY valid JSON — no markdown, no explanation.`;

    const userPrompt = `Analyze this resume and return a JSON object with EXACTLY this structure:

{
  "candidate": {
    "name": "string",
    "email": "string or null",
    "phone": "string or null",
    "location": "string or null",
    "linkedin": "string or null",
    "summary": "2-3 sentence professional summary"
  },
  "skills": {
    "technical": ["array of technical skills"],
    "soft": ["array of soft skills"],
    "languages": ["programming/spoken languages"],
    "tools": ["tools, frameworks, platforms"]
  },
  "experience": {
    "totalYears": number,
    "level": "Entry | Junior | Mid | Senior | Lead | Executive",
    "roles": [{"title": "string", "company": "string", "duration": "string"}]
  },
  "education": [{"degree": "string", "institution": "string", "year": "string or null"}],
  "atsScore": {
    "score": number (0-100),
    "grade": "A | B | C | D | F",
    "issues": ["list of ATS problems found"],
    "improvements": ["actionable improvements"],
    "keywordDensity": "Low | Medium | High",
    "formattingScore": number (0-100),
    "contentScore": number (0-100)
  },
  "jobMatch": {
    "score": number (0-100, or null if no job description),
    "matchedSkills": ["skills that match the job"],
    "missingSkills": ["important skills missing"],
    "recommendation": "string summary of fit"
  },
  "overallScore": number (0-100),
  "strengths": ["top 3-5 resume strengths"],
  "weaknesses": ["top 3-5 areas to improve"],
  "verdict": "one sentence overall assessment"
}

Resume text:
---
${resumeText}
---

${jobDescription ? `Job Description to match against:\n---\n${jobDescription}\n---` : "No job description provided. Set jobMatch.score to null and jobMatch.recommendation to 'No job description provided'."}

Return ONLY the JSON object. No markdown fences, no explanation.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response from AI" }, { status: 500 });
    }

    let analysis;
    try {
      const cleaned = content.text.replace(/```json|```/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error: unknown) {
    console.error("Resume analysis error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
