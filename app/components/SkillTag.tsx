"use client";

interface SkillTagProps {
  label: string;
  variant?: "technical" | "soft" | "tool" | "language" | "matched" | "missing";
}

const variantStyles: Record<
  NonNullable<SkillTagProps["variant"]>,
  { bg: string; color: string; border: string }
> = {
  technical: {
    bg: "rgba(108, 99, 255, 0.12)",
    color: "#a09af0",
    border: "rgba(108, 99, 255, 0.25)",
  },
  soft: {
    bg: "rgba(0, 212, 170, 0.1)",
    color: "#00d4aa",
    border: "rgba(0, 212, 170, 0.2)",
  },
  tool: {
    bg: "rgba(255, 179, 71, 0.1)",
    color: "#ffb347",
    border: "rgba(255, 179, 71, 0.2)",
  },
  language: {
    bg: "rgba(255, 107, 107, 0.1)",
    color: "#ff8a8a",
    border: "rgba(255, 107, 107, 0.2)",
  },
  matched: {
    bg: "rgba(0, 212, 170, 0.12)",
    color: "#00d4aa",
    border: "rgba(0, 212, 170, 0.3)",
  },
  missing: {
    bg: "rgba(255, 107, 107, 0.1)",
    color: "#ff6b6b",
    border: "rgba(255, 107, 107, 0.25)",
  },
};

export default function SkillTag({
  label,
  variant = "technical",
}: SkillTagProps) {
  const style = variantStyles[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 500,
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
