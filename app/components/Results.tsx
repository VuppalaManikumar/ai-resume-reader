"use client";

import { ResumeAnalysis } from "@/app/lib/types";
import ScoreRing from "./ScoreRing";
import SkillTag from "./SkillTag";

interface ResultsProps {
  analysis: ResumeAnalysis;
  onReset: () => void;
}

const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      padding: "24px",
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionTitle = ({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: string;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
    }}
  >
    <span style={{ fontSize: "18px" }}>{icon}</span>
    <h2
      style={{
        fontFamily: "Syne, sans-serif",
        fontSize: "15px",
        fontWeight: 700,
        color: "var(--text)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </h2>
  </div>
);

const levelColors: Record<string, string> = {
  Junior: "#ffb347",
  "Mid-level": "#6c63ff",
  Senior: "#00d4aa",
  Executive: "#ff6b6b",
};

export default function Results({ analysis, onReset }: ResultsProps) {
  const levelColor = levelColors[analysis.candidateLevel] || "#6c63ff";

  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "28px",
                fontWeight: 800,
              }}
            >
              Analysis Complete
            </h1>
            <span
              style={{
                background: `${levelColor}20`,
                color: levelColor,
                border: `1px solid ${levelColor}40`,
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: "Syne, sans-serif",
              }}
            >
              {analysis.candidateLevel}
            </span>
          </div>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              marginTop: "6px",
              maxWidth: "500px",
            }}
          >
            {analysis.summary}
          </p>
        </div>
        <button
          onClick={onReset}
          style={{
            background: "transparent",
            border: "1px solid var(--border-bright)",
            color: "var(--text-muted)",
            padding: "8px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "13px",
            fontFamily: "DM Sans, sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-bright)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          ← Analyze Another
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {/* ATS Score Card */}
        <Card>
          <SectionTitle icon="🎯">ATS Compatibility</SectionTitle>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <ScoreRing
              score={analysis.atsScore.overall}
              size={110}
              color="auto"
              label="Overall"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                flex: 1,
                minWidth: "160px",
              }}
            >
              {[
                { label: "Formatting", value: analysis.atsScore.formatting },
                { label: "Keywords", value: analysis.atsScore.keywords },
                { label: "Sections", value: analysis.atsScore.sections },
                { label: "Readability", value: analysis.atsScore.readability },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {label}
                    </span>
                    <span
                      style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)" }}
                    >
                      {value}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "4px",
                      background: "var(--surface2)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${value}%`,
                        background:
                          value >= 80
                            ? "var(--success)"
                            : value >= 60
                            ? "var(--accent)"
                            : value >= 40
                            ? "var(--warning)"
                            : "var(--danger)",
                        borderRadius: "2px",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {analysis.atsScore.issues.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--danger)",
                  marginBottom: "8px",
                }}
              >
                ⚠ Issues Found
              </p>
              {analysis.atsScore.issues.map((issue, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    padding: "6px 10px",
                    background: "rgba(255,107,107,0.06)",
                    borderLeft: "2px solid var(--danger)",
                    marginBottom: "6px",
                    borderRadius: "0 6px 6px 0",
                  }}
                >
                  {issue}
                </div>
              ))}
            </div>
          )}

          {analysis.atsScore.improvements.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--success)",
                  marginBottom: "8px",
                }}
              >
                ✓ Improvements
              </p>
              {analysis.atsScore.improvements.map((imp, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    padding: "6px 10px",
                    background: "rgba(0,212,170,0.06)",
                    borderLeft: "2px solid var(--success)",
                    marginBottom: "6px",
                    borderRadius: "0 6px 6px 0",
                  }}
                >
                  {imp}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Job Match Card */}
        {analysis.jobMatch ? (
          <Card>
            <SectionTitle icon="🔗">Job Match</SectionTitle>
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <ScoreRing
                score={analysis.jobMatch.score}
                size={110}
                color="auto"
                label="Match"
              />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    marginBottom: "16px",
                  }}
                >
                  {analysis.jobMatch.recommendation}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--success)",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  ✓ Matched Skills
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {analysis.jobMatch.matchedSkills.map((s) => (
                    <SkillTag key={s} label={s} variant="matched" />
                  ))}
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--danger)",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  ✗ Missing Skills
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {analysis.jobMatch.missingSkills.map((s) => (
                    <SkillTag key={s} label={s} variant="missing" />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              minHeight: "200px",
              border: "1px dashed var(--border)",
              background: "transparent",
            }}
          >
            <span style={{ fontSize: "32px", marginBottom: "12px" }}>🔗</span>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              No job description provided.
            </p>
            <p style={{ color: "var(--text-dim)", fontSize: "12px", marginTop: "6px" }}>
              Add a job description to see match analysis.
            </p>
          </Card>
        )}

        {/* Skills Card */}
        <Card style={{ gridColumn: "1 / -1" }}>
          <SectionTitle icon="⚡">Extracted Skills</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                title: "Technical",
                skills: analysis.skills.technical,
                variant: "technical" as const,
              },
              {
                title: "Soft Skills",
                skills: analysis.skills.soft,
                variant: "soft" as const,
              },
              {
                title: "Tools & Platforms",
                skills: analysis.skills.tools,
                variant: "tool" as const,
              },
              {
                title: "Languages & Frameworks",
                skills: analysis.skills.languages,
                variant: "language" as const,
              },
            ].map(({ title, skills, variant }) => (
              <div key={title}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "10px",
                  }}
                >
                  {title}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {skills.length > 0 ? (
                    skills.map((s) => (
                      <SkillTag key={s} label={s} variant={variant} />
                    ))
                  ) : (
                    <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                      None detected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Experience Card */}
        <Card>
          <SectionTitle icon="💼">Experience</SectionTitle>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(108,99,255,0.1)",
              border: "1px solid rgba(108,99,255,0.2)",
              padding: "6px 14px",
              borderRadius: "20px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "20px",
                fontWeight: 800,
                color: "var(--accent)",
              }}
            >
              {analysis.experience.totalYears}
            </span>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              years total
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {analysis.experience.roles.map((role, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "12px",
                  background: "var(--surface2)",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    marginTop: "5px",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "var(--text)",
                    }}
                  >
                    {role.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {role.company} · {role.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Education Card */}
        <Card>
          <SectionTitle icon="🎓">Education</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {analysis.education.length > 0 ? (
              analysis.education.map((edu, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px",
                    background: "var(--surface2)",
                    borderRadius: "10px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    {edu.degree}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>
                    {edu.institution}
                  </p>
                  {edu.year && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-dim)",
                        marginTop: "2px",
                      }}
                    >
                      {edu.year}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p style={{ fontSize: "13px", color: "var(--text-dim)" }}>
                No education details found
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
