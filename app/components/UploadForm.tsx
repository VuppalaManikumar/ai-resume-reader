"use client";

import { useState, useRef, DragEvent } from "react";

interface UploadFormProps {
  onAnalyze: (formData: FormData) => void;
  isLoading: boolean;
}

export default function UploadForm({ onAnalyze, isLoading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type === "application/pdf" || dropped.type === "text/plain")) {
      setFile(dropped);
    }
  };

  const handleSubmit = () => {
    const fd = new FormData();

    if (inputMode === "upload" && file) {
      fd.append("resume", file);
    } else if (inputMode === "paste" && textInput.trim()) {
      fd.append("resumeText", textInput);
    } else {
      return;
    }

    if (jobDescription.trim()) {
      fd.append("jobDescription", jobDescription);
    }

    onAnalyze(fd);
  };

  const canSubmit =
    !isLoading &&
    (inputMode === "upload" ? !!file : textInput.trim().length > 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Mode Toggle */}
      <div
        style={{
          display: "flex",
          background: "var(--surface2)",
          borderRadius: "12px",
          padding: "4px",
          gap: "4px",
        }}
      >
        {(["upload", "paste"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setInputMode(mode)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "9px",
              border: "none",
              background: inputMode === mode ? "var(--surface)" : "transparent",
              color: inputMode === mode ? "var(--text)" : "var(--text-muted)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: inputMode === mode ? 600 : 400,
              fontFamily: "Syne, sans-serif",
              transition: "all 0.2s",
              boxShadow:
                inputMode === mode ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
            }}
          >
            {mode === "upload" ? "📄 Upload PDF" : "✏️ Paste Text"}
          </button>
        ))}
      </div>

      {/* Upload Area */}
      {inputMode === "upload" ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? "var(--accent)" : file ? "var(--success)" : "var(--border-bright)"}`,
            borderRadius: "16px",
            padding: "40px 24px",
            textAlign: "center",
            cursor: "pointer",
            background: isDragging
              ? "rgba(108,99,255,0.05)"
              : file
              ? "rgba(0,212,170,0.04)"
              : "transparent",
            transition: "all 0.25s",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>
            {file ? "✅" : "📂"}
          </div>
          {file ? (
            <div>
              <p style={{ fontWeight: 600, color: "var(--success)", fontSize: "14px" }}>
                {file.name}
              </p>
              <p style={{ color: "var(--text-dim)", fontSize: "12px", marginTop: "4px" }}>
                {(file.size / 1024).toFixed(0)} KB · Click to change
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontWeight: 600, fontSize: "15px" }}>
                Drop your resume here
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "6px" }}>
                PDF or TXT · Up to 10MB
              </p>
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Paste your resume text here..."
          rows={10}
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "16px",
            color: "var(--text)",
            fontSize: "13px",
            fontFamily: "DM Sans, sans-serif",
            resize: "vertical",
            outline: "none",
            lineHeight: 1.7,
            transition: "border-color 0.2s",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "var(--accent)")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "var(--border)")
          }
        />
      )}

      {/* Job Description */}
      <div>
        <label
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Job Description{" "}
          <span style={{ color: "var(--text-dim)", fontWeight: 400, textTransform: "none" }}>
            (optional — for match scoring)
          </span>
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description to get a match score..."
          rows={5}
          style={{
            width: "100%",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "14px",
            color: "var(--text)",
            fontSize: "13px",
            fontFamily: "DM Sans, sans-serif",
            resize: "vertical",
            outline: "none",
            lineHeight: 1.7,
            transition: "border-color 0.2s",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "var(--accent)")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "var(--border)")
          }
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          background: canSubmit
            ? "linear-gradient(135deg, #6c63ff, #8b83ff)"
            : "var(--surface2)",
          border: "none",
          borderRadius: "12px",
          padding: "16px 32px",
          color: canSubmit ? "white" : "var(--text-dim)",
          fontSize: "15px",
          fontWeight: 700,
          fontFamily: "Syne, sans-serif",
          cursor: canSubmit ? "pointer" : "not-allowed",
          transition: "all 0.25s",
          position: "relative",
          overflow: "hidden",
          letterSpacing: "0.02em",
          boxShadow: canSubmit ? "0 4px 20px rgba(108,99,255,0.35)" : "none",
        }}
        onMouseEnter={(e) => {
          if (canSubmit) {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 28px rgba(108,99,255,0.45)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = canSubmit
            ? "0 4px 20px rgba(108,99,255,0.35)"
            : "none";
        }}
      >
        {isLoading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.8s linear infinite",
              }}
            />
            Analyzing Resume...
          </span>
        ) : (
          "Analyze Resume →"
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
