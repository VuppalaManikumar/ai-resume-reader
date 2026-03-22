"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export default function ScoreRing({
  score,
  size = 100,
  strokeWidth = 8,
  color = "#6c63ff",
  label,
  sublabel,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return "#00d4aa";
    if (score >= 60) return "#6c63ff";
    if (score >= 40) return "#ffb347";
    return "#ff6b6b";
  };

  const ringColor = color === "auto" ? getColor() : color;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Score ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        {/* Score text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: size < 80 ? "16px" : "22px",
              fontWeight: 700,
              color: ringColor,
              lineHeight: 1,
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "var(--text-muted)",
              lineHeight: 1,
              marginTop: "2px",
            }}
          >
            /100
          </span>
        </div>
      </div>
      {label && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text)",
              fontFamily: "Syne, sans-serif",
            }}
          >
            {label}
          </div>
          {sublabel && (
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {sublabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
