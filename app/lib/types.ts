export interface ResumeAnalysis {
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
    languages: string[];
  };
  experience: {
    totalYears: number;
    roles: Array<{
      title: string;
      company: string;
      duration: string;
    }>;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  jobMatch: {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendation: string;
  } | null;
  atsScore: {
    overall: number;
    formatting: number;
    keywords: number;
    sections: number;
    readability: number;
    issues: string[];
    improvements: string[];
  };
  summary: string;
  candidateLevel: "Junior" | "Mid-level" | "Senior" | "Executive";
}

export interface AnalyzeRequest {
  resumeText: string;
  jobDescription?: string;
}
