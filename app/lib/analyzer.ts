import Anthropic from "@anthropic-ai/sdk";
import { ResumeAnalysis } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string
): Promise<ResumeAnalysis> {
  const jobMatchSection = jobDescription
    ? `
Also analyze the job match against this job description:
---JOB DESCRIPTION---
${jobDescription}
---END JOB DESCRIPTION---

For the jobMatch field, provide:
- score: 0-100 match percentage
- matchedSkills: skills from resume that match job requirements
- missingSkills: skills required in job but missing from resume
- recommendation: 1-2 sentence hiring recommendation
`
    : `Set jobMatch to null as no job description was provided.`;

  const prompt = `You are an expert resume analyst and ATS (Applicant Tracking System) specialist. Analyze the following resume and return a detailed JSON analysis.

---RESUME---
${resumeText}
---END RESUME---

${jobMatchSection}

Return ONLY valid JSON (no markdown, no explanation) matching this exact structure:
{
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"],
    "languages": ["lang1", "lang2"]
  },
  "experience": {
    "totalYears": 5,
    "roles": [
      { "title": "Job Title", "company": "Company Name", "duration": "2020-2023" }
    ]
  },
  "education": [
    { "degree": "B.S. Computer Science", "institution": "University Name", "year": "2019" }
  ],
  "jobMatch": null,
  "atsScore": {
    "overall": 85,
    "formatting": 90,
    "keywords": 80,
    "sections": 85,
    "readability": 88,
    "issues": ["Issue 1", "Issue 2"],
    "improvements": ["Improvement 1", "Improvement 2"]
  },
  "summary": "2-3 sentence professional summary of the candidate",
  "candidateLevel": "Senior"
}

ATS scoring criteria:
- formatting (0-100): Clean structure, consistent fonts, no tables/columns that break parsing, proper whitespace
- keywords (0-100): Industry-relevant terms, quantified achievements, action verbs
- sections (0-100): Has all standard sections (Contact, Summary, Experience, Education, Skills)
- readability (0-100): Clear language, bullet points, scannable content
- overall: weighted average of above

candidateLevel must be exactly one of: "Junior", "Mid-level", "Senior", "Executive"`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  const jsonText = content.text.replace(/```json\n?|\n?```/g, "").trim();
  const analysis: ResumeAnalysis = JSON.parse(jsonText);
  return analysis;
}
