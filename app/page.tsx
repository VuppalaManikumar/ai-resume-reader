"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Briefcase, Zap, CheckCircle, XCircle, AlertTriangle, ChevronRight, Loader2, RotateCcw, Star, TrendingUp, Shield } from "lucide-react";

interface ResumeAnalysis {
  candidate: { name: string; email: string | null; phone: string | null; location: string | null; linkedin: string | null; summary: string; };
  skills: { technical: string[]; soft: string[]; languages: string[]; tools: string[]; };
  experience: { totalYears: number; level: string; roles: { title: string; company: string; duration: string }[]; };
  education: { degree: string; institution: string; year: string | null }[];
  atsScore: { score: number; grade: string; issues: string[]; improvements: string[]; keywordDensity: string; formattingScore: number; contentScore: number; };
  jobMatch: { score: number | null; matchedSkills: string[]; missingSkills: string[]; recommendation: string; };
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  verdict: string;
}

function ScoreRing({ score, size = 80, color = "#7b6cff" }: { score: number; size?: number; color?: string }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }} />
    </svg>
  );
}

function ScoreCard({ label, score, color, icon }: { label: string; score: number | null; color: string; icon: React.ReactNode }) {
  const displayScore = score ?? 0;
  return (
    <div className="score-card" style={{ "--card-color": color } as React.CSSProperties}>
      <div className="score-ring-wrap">
        <ScoreRing score={displayScore} size={72} color={color} />
        <div className="score-number">{score !== null ? score : "N/A"}</div>
      </div>
      <div className="score-meta">
        <div className="score-icon">{icon}</div>
        <div className="score-label">{label}</div>
      </div>
    </div>
  );
}

function SkillPill({ skill, variant = "default" }: { skill: string; variant?: "default" | "matched" | "missing" }) {
  return <span className={`skill-pill skill-pill--${variant}`}>{skill}</span>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="result-section">
      <h3 className="section-title">{title}</h3>
      {children}
    </div>
  );
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type === "application/pdf" || dropped.type === "text/plain")) {
      setFile(dropped);
      setError(null);
    } else {
      setError("Please upload a PDF or TXT file.");
    }
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      if (jobDesc.trim()) fd.append("jobDescription", jobDesc);
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setAnalysis(null); setError(null); setJobDesc(""); };

  const gradeColor = (grade: string) => {
    const map: Record<string, string> = { A: "#4ade80", B: "#86efac", C: "#facc15", D: "#fb923c", F: "#f87171" };
    return map[grade] || "#7b6cff";
  };

  return (
    <>
      <style>{`
        .app { min-height: 100vh; background: var(--bg); }

        /* HERO */
        .hero { padding: 64px 24px 0; text-align: center; position: relative; overflow: hidden; }
        .hero::before {
          content: ''; position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(123,108,255,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(123,108,255,0.1); border: 1px solid rgba(123,108,255,0.25);
          color: #a89fff; padding: 5px 14px; border-radius: 100px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 28px;
        }
        .hero-title {
          font-family: var(--font-display); font-size: clamp(36px, 6vw, 72px);
          font-weight: 800; line-height: 1.05; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #f0eff8 0%, #a89fff 50%, #ff6c9d 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; margin-bottom: 20px;
        }
        .hero-sub { color: var(--text-muted); font-size: 17px; max-width: 520px; margin: 0 auto 48px; line-height: 1.7; }

        /* FEATURES */
        .features { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 56px; }
        .feature-chip {
          display: flex; align-items: center; gap: 8px;
          background: var(--bg2); border: 1px solid var(--border);
          padding: 8px 16px; border-radius: 8px; font-size: 13px; color: var(--text-muted);
        }
        .feature-chip svg { color: var(--accent); }

        /* MAIN CONTAINER */
        .main { max-width: 900px; margin: 0 auto; padding: 0 24px 80px; }

        /* UPLOAD CARD */
        .card {
          background: var(--bg2); border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden; margin-bottom: 16px;
        }
        .card-header {
          padding: 20px 24px 0; display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display); font-size: 15px; font-weight: 700; letter-spacing: 0.02em;
          color: var(--text-muted); text-transform: uppercase;
        }
        .card-header svg { color: var(--accent); }
        .step-num {
          width: 22px; height: 22px; border-radius: 50%; background: var(--accent);
          color: white; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center;
        }

        /* DROP ZONE */
        .dropzone {
          margin: 16px 20px 20px; border: 2px dashed var(--border-bright);
          border-radius: 12px; padding: 40px 24px; text-align: center;
          cursor: pointer; transition: all 0.25s ease; position: relative;
          background: rgba(255,255,255,0.01);
        }
        .dropzone:hover, .dropzone--active {
          border-color: var(--accent); background: rgba(123,108,255,0.04);
        }
        .dropzone--has-file { border-color: #4ade80; background: rgba(74,222,128,0.04); border-style: solid; }
        .dz-icon { color: var(--text-dim); margin-bottom: 12px; }
        .dz-icon--success { color: #4ade80; }
        .dz-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; margin-bottom: 6px; }
        .dz-sub { font-size: 13px; color: var(--text-muted); }
        .dz-formats { font-size: 11px; color: var(--text-dim); margin-top: 8px; }
        .file-info {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2);
          border-radius: 8px; padding: 10px 16px; margin-top: 12px; font-size: 13px;
        }
        .file-info svg { color: #4ade80; flex-shrink: 0; }

        /* JOB DESC */
        .job-textarea {
          width: calc(100% - 40px); margin: 12px 20px 20px;
          background: rgba(255,255,255,0.02); border: 1px solid var(--border);
          border-radius: 10px; padding: 14px 16px; color: var(--text); font-size: 14px;
          resize: vertical; min-height: 110px; outline: none; transition: border-color 0.2s;
          display: block;
        }
        .job-textarea:focus { border-color: var(--accent); }
        .job-textarea::placeholder { color: var(--text-dim); }

        /* ANALYZE BTN */
        .analyze-btn {
          width: 100%; padding: 16px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, var(--accent) 0%, #a855f7 100%);
          color: white; font-family: var(--font-display); font-size: 16px; font-weight: 700;
          letter-spacing: 0.02em; display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.25s ease; position: relative; overflow: hidden;
          margin-bottom: 16px;
        }
        .analyze-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%); transition: transform 0.5s ease;
        }
        .analyze-btn:hover::before { transform: translateX(100%); }
        .analyze-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(123,108,255,0.35); }
        .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* ERROR */
        .error-box {
          background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.25);
          border-radius: 10px; padding: 12px 16px; color: #f87171;
          display: flex; align-items: center; gap: 10px; font-size: 14px; margin-bottom: 16px;
        }

        /* RESULTS */
        .results { animation: fadeInUp 0.5s ease forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .result-header {
          background: var(--bg2); border: 1px solid var(--border);
          border-radius: 16px; padding: 28px; margin-bottom: 16px;
        }
        .candidate-info { margin-bottom: 20px; }
        .candidate-name { font-family: var(--font-display); font-size: 26px; font-weight: 800; margin-bottom: 4px; }
        .candidate-details { display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; color: var(--text-muted); margin-bottom: 12px; }
        .candidate-details span { display: flex; align-items: center; gap: 5px; }
        .candidate-summary { font-size: 14px; color: var(--text-muted); line-height: 1.7; padding: 14px; background: rgba(255,255,255,0.02); border-radius: 8px; border-left: 3px solid var(--accent); }
        .verdict-banner {
          background: linear-gradient(135deg, rgba(123,108,255,0.1), rgba(255,108,157,0.05));
          border: 1px solid rgba(123,108,255,0.2); border-radius: 10px;
          padding: 14px 18px; font-size: 14px; color: var(--text-muted); margin-bottom: 20px;
          display: flex; align-items: flex-start; gap: 10px;
        }
        .verdict-banner svg { color: var(--accent); flex-shrink: 0; margin-top: 1px; }

        /* SCORES ROW */
        .scores-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .score-card {
          background: var(--bg3); border: 1px solid var(--border); border-radius: 12px;
          padding: 20px 16px; display: flex; flex-direction: column; align-items: center; gap: 12px;
          position: relative; overflow: hidden;
        }
        .score-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--card-color, var(--accent));
        }
        .score-ring-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
        .score-number {
          position: absolute; font-family: var(--font-display); font-size: 18px; font-weight: 800;
        }
        .score-meta { text-align: center; }
        .score-icon { color: var(--text-dim); margin-bottom: 4px; display: flex; justify-content: center; }
        .score-label { font-size: 12px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }

        /* RESULT SECTION */
        .result-section {
          background: var(--bg2); border: 1px solid var(--border);
          border-radius: 16px; padding: 24px; margin-bottom: 16px;
        }
        .section-title {
          font-family: var(--font-display); font-size: 13px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted);
          margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
        }
        .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        /* SKILLS */
        .skills-grid { display: flex; flex-direction: column; gap: 12px; }
        .skills-group label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-dim); display: block; margin-bottom: 8px; }
        .skills-pills { display: flex; flex-wrap: wrap; gap: 6px; }
        .skill-pill {
          padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 500;
          border: 1px solid;
        }
        .skill-pill--default { background: rgba(123,108,255,0.08); border-color: rgba(123,108,255,0.2); color: #a89fff; }
        .skill-pill--matched { background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.2); color: #4ade80; }
        .skill-pill--missing { background: rgba(248,113,113,0.08); border-color: rgba(248,113,113,0.2); color: #f87171; }

        /* ATS SCORES */
        .ats-bars { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
        .ats-bar-row { display: flex; flex-direction: column; gap: 6px; }
        .ats-bar-header { display: flex; justify-content: space-between; font-size: 13px; }
        .ats-bar-header span:last-child { color: var(--text-muted); font-weight: 600; }
        .ats-bar-track { height: 6px; background: var(--bg3); border-radius: 3px; overflow: hidden; }
        .ats-bar-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }

        /* LISTS */
        .check-list { display: flex; flex-direction: column; gap: 8px; }
        .check-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; line-height: 1.5; }
        .check-item svg { flex-shrink: 0; margin-top: 2px; }
        .check-item--good svg { color: #4ade80; }
        .check-item--warn svg { color: #facc15; }
        .check-item--bad svg { color: #f87171; }

        /* EXPERIENCE */
        .exp-roles { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .exp-role {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 14px; background: var(--bg3); border-radius: 8px; font-size: 13px;
        }
        .exp-role-left { font-weight: 500; }
        .exp-role-right { color: var(--text-muted); font-size: 12px; }

        .level-badge {
          display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 100px;
          font-size: 12px; font-weight: 600; background: rgba(123,108,255,0.12);
          border: 1px solid rgba(123,108,255,0.25); color: var(--accent); margin-bottom: 12px;
        }

        /* TWO COL */
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        /* GRADE */
        .grade-display { text-align: center; margin-bottom: 20px; }
        .grade-letter { font-family: var(--font-display); font-size: 64px; font-weight: 800; line-height: 1; }

        /* RESET */
        .reset-btn {
          display: flex; align-items: center; gap: 8px; background: transparent;
          border: 1px solid var(--border); color: var(--text-muted); padding: 10px 20px;
          border-radius: 8px; font-size: 14px; transition: all 0.2s; margin: 0 auto 40px;
        }
        .reset-btn:hover { border-color: var(--accent); color: var(--accent); }

        @media (max-width: 640px) {
          .scores-row { grid-template-columns: 1fr; }
          .two-col { grid-template-columns: 1fr; }
          .hero-title { font-size: 36px; }
        }
      `}</style>

      <div className="app">
        <div className="hero">
          <div className="hero-badge"><Zap size={12} /> AI-Powered Analysis</div>
          <h1 className="hero-title">Resume Intelligence<br />at Your Fingertips</h1>
          <p className="hero-sub">Upload your resume and get instant AI-powered insights — skill extraction, ATS scoring, and job match analysis.</p>
          <div className="features">
            {[
              { icon: <FileText size={14} />, label: "PDF Parsing" },
              { icon: <Zap size={14} />, label: "Skill Extraction" },
              { icon: <Shield size={14} />, label: "ATS Checker" },
              { icon: <TrendingUp size={14} />, label: "Job Match Score" },
            ].map((f) => (
              <div key={f.label} className="feature-chip">{f.icon}{f.label}</div>
            ))}
          </div>
        </div>

        <div className="main">
          {!analysis ? (
            <>
              {/* Step 1: Upload */}
              <div className="card">
                <div className="card-header">
                  <div className="step-num">1</div>
                  <Upload size={15} /> Upload Resume
                </div>
                <div
                  className={`dropzone ${isDragging ? "dropzone--active" : ""} ${file ? "dropzone--has-file" : ""}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <input ref={fileRef} type="file" accept=".pdf,.txt" style={{ display: "none" }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setError(null); } }} />
                  {file ? (
                    <>
                      <div className="dz-icon dz-icon--success"><CheckCircle size={40} /></div>
                      <div className="dz-title">Resume Ready</div>
                      <div className="file-info">
                        <FileText size={16} />
                        <span>{file.name}</span>
                        <span style={{ color: "var(--text-dim)" }}>({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="dz-icon"><Upload size={40} /></div>
                      <div className="dz-title">Drop your resume here</div>
                      <div className="dz-sub">or click to browse files</div>
                      <div className="dz-formats">PDF or TXT • Max 10MB</div>
                    </>
                  )}
                </div>
              </div>

              {/* Step 2: Job Desc */}
              <div className="card">
                <div className="card-header">
                  <div className="step-num">2</div>
                  <Briefcase size={15} /> Job Description <span style={{ color: "var(--text-dim)", fontSize: 12, fontWeight: 400 }}>(optional)</span>
                </div>
                <textarea
                  className="job-textarea"
                  placeholder="Paste the job description here to get a match score and identify skill gaps..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  rows={5}
                />
              </div>

              {/* Analyze */}
              {error && (
                <div className="error-box">
                  <XCircle size={16} />
                  {error}
                </div>
              )}
              <button className="analyze-btn" onClick={handleAnalyze} disabled={!file || loading}>
                {loading ? (
                  <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Analyzing Resume...</>
                ) : (
                  <><Zap size={18} /> Analyze Resume <ChevronRight size={16} /></>
                )}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </>
          ) : (
            <div className="results">
              {/* Candidate Header */}
              <div className="result-header">
                <div className="candidate-info">
                  <div className="candidate-name">{analysis.candidate.name}</div>
                  <div className="candidate-details">
                    {analysis.candidate.email && <span>✉ {analysis.candidate.email}</span>}
                    {analysis.candidate.phone && <span>📞 {analysis.candidate.phone}</span>}
                    {analysis.candidate.location && <span>📍 {analysis.candidate.location}</span>}
                  </div>
                  {analysis.candidate.summary && (
                    <div className="candidate-summary">{analysis.candidate.summary}</div>
                  )}
                </div>

                {analysis.verdict && (
                  <div className="verdict-banner">
                    <Star size={16} />
                    <span>{analysis.verdict}</span>
                  </div>
                )}

                <div className="scores-row">
                  <ScoreCard label="Overall Score" score={analysis.overallScore} color="#7b6cff" icon={<Star size={14} />} />
                  <ScoreCard label="ATS Score" score={analysis.atsScore.score} color={gradeColor(analysis.atsScore.grade)} icon={<Shield size={14} />} />
                  <ScoreCard label="Job Match" score={analysis.jobMatch.score} color="#ff6c9d" icon={<TrendingUp size={14} />} />
                </div>
              </div>

              {/* Skills */}
              <Section title="Skills Extracted">
                <div className="skills-grid">
                  {analysis.skills.technical.length > 0 && (
                    <div className="skills-group">
                      <label>Technical</label>
                      <div className="skills-pills">{analysis.skills.technical.map(s => <SkillPill key={s} skill={s} />)}</div>
                    </div>
                  )}
                  {analysis.skills.tools.length > 0 && (
                    <div className="skills-group">
                      <label>Tools & Frameworks</label>
                      <div className="skills-pills">{analysis.skills.tools.map(s => <SkillPill key={s} skill={s} />)}</div>
                    </div>
                  )}
                  {analysis.skills.soft.length > 0 && (
                    <div className="skills-group">
                      <label>Soft Skills</label>
                      <div className="skills-pills">{analysis.skills.soft.map(s => <SkillPill key={s} skill={s} variant="default" />)}</div>
                    </div>
                  )}
                  {analysis.skills.languages.length > 0 && (
                    <div className="skills-group">
                      <label>Languages</label>
                      <div className="skills-pills">{analysis.skills.languages.map(s => <SkillPill key={s} skill={s} />)}</div>
                    </div>
                  )}
                </div>
              </Section>

              {/* ATS */}
              <Section title="ATS Compatibility">
                <div className="grade-display">
                  <div className="grade-letter" style={{ color: gradeColor(analysis.atsScore.grade) }}>
                    {analysis.atsScore.grade}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: 13 }}>ATS Grade</div>
                </div>
                <div className="ats-bars">
                  {[
                    { label: "Overall ATS Score", val: analysis.atsScore.score, color: gradeColor(analysis.atsScore.grade) },
                    { label: "Formatting Score", val: analysis.atsScore.formattingScore, color: "#7b6cff" },
                    { label: "Content Score", val: analysis.atsScore.contentScore, color: "#6cffd4" },
                  ].map(b => (
                    <div key={b.label} className="ats-bar-row">
                      <div className="ats-bar-header">
                        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{b.label}</span>
                        <span>{b.val}/100</span>
                      </div>
                      <div className="ats-bar-track">
                        <div className="ats-bar-fill" style={{ width: `${b.val}%`, background: b.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="two-col">
                  {analysis.atsScore.issues.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: 10 }}>Issues Found</div>
                      <div className="check-list">
                        {analysis.atsScore.issues.map(i => (
                          <div key={i} className="check-item check-item--bad">
                            <XCircle size={14} /><span>{i}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.atsScore.improvements.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: 10 }}>Improvements</div>
                      <div className="check-list">
                        {analysis.atsScore.improvements.map(i => (
                          <div key={i} className="check-item check-item--warn">
                            <AlertTriangle size={14} /><span>{i}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Section>

              {/* Job Match */}
              {analysis.jobMatch.score !== null && (
                <Section title="Job Match Analysis">
                  <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>{analysis.jobMatch.recommendation}</p>
                  <div className="two-col">
                    {analysis.jobMatch.matchedSkills.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: 10 }}>Matched Skills</div>
                        <div className="skills-pills">{analysis.jobMatch.matchedSkills.map(s => <SkillPill key={s} skill={s} variant="matched" />)}</div>
                      </div>
                    )}
                    {analysis.jobMatch.missingSkills.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: 10 }}>Missing Skills</div>
                        <div className="skills-pills">{analysis.jobMatch.missingSkills.map(s => <SkillPill key={s} skill={s} variant="missing" />)}</div>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* Experience */}
              <Section title="Experience">
                <div className="level-badge">{analysis.experience.level} Level • {analysis.experience.totalYears}+ years</div>
                <div className="exp-roles">
                  {analysis.experience.roles.map((r, i) => (
                    <div key={i} className="exp-role">
                      <div className="exp-role-left">{r.title} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>@ {r.company}</span></div>
                      <div className="exp-role-right">{r.duration}</div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Strengths & Weaknesses */}
              <div className="two-col">
                <Section title="Strengths">
                  <div className="check-list">
                    {analysis.strengths.map(s => (
                      <div key={s} className="check-item check-item--good">
                        <CheckCircle size={14} /><span>{s}</span>
                      </div>
                    ))}
                  </div>
                </Section>
                <Section title="Areas to Improve">
                  <div className="check-list">
                    {analysis.weaknesses.map(w => (
                      <div key={w} className="check-item check-item--warn">
                        <AlertTriangle size={14} /><span>{w}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>

              <button className="reset-btn" onClick={reset}>
                <RotateCcw size={15} /> Analyze Another Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
