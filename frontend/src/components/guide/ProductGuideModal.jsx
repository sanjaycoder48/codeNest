import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, LayoutGrid, Rocket, X, BookOpen, Layers } from 'lucide-react';

export function ProductGuideModal({ open, onClose, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!open) return null;

  const steps = [
    {
      title: "Welcome to Project Twin",
      eyebrow: "Beginner Guide • Step 1 of 5",
      icon: Sparkles,
      color: "#a855f7",
      description: "Project Twin is your AI-powered engineering intelligence extension for GitHub. GitHub remains your SOURCE OF TRUTH — Project Twin sits above it to help your team understand, improve, collaborate, and deploy with confidence.",
      highlights: [
        "No forced code editing — keep coding in your favorite IDE (VS Code, Cursor, etc.).",
        "Deterministic static analysis + evidence-grounded AI insights.",
        "Complete lifecycle coverage from initial repository scan to production release."
      ],
      ctaText: "Next: Project Intelligence",
      targetTab: "Overview"
    },
    {
      title: "Project Overview & Intelligence",
      eyebrow: "Beginner Guide • Step 2 of 5",
      icon: Layers,
      color: "#58a6ff",
      description: "Learn how Project Twin analyzes your GitHub repository structure, frameworks, dependencies, and API routes.",
      highlights: [
        "Framework & Stack Detection: Instantly identifies React, Express, Mongoose, PostgreSQL, etc.",
        "Interactive Architecture Diagram: View how entry layers, runtime boundaries, and services connect.",
        "Indexed API Routes & Models: Inspect all endpoints supported by evidence files."
      ],
      ctaText: "Next: Production Readiness",
      targetTab: "Intelligence"
    },
    {
      title: "Production Readiness Scoring",
      eyebrow: "Beginner Guide • Step 3 of 5",
      icon: ShieldCheck,
      color: "#3fb950",
      description: "Project Twin evaluates 10 weighted launch criteria to give your repository a real score from 0 to 100.",
      highlights: [
        "Build & Lockfiles: Verifies package lockfiles and npm build scripts.",
        "CI Workflows & Tests: Checks for automated GitHub Actions and test runners.",
        "Environment & Secrets Guard: Detects missing .env documentation and sensitive secret risks."
      ],
      ctaText: "Next: Team Collaboration",
      targetTab: "Readiness"
    },
    {
      title: "Team Collaboration Workspace",
      eyebrow: "Beginner Guide • Step 4 of 5",
      icon: LayoutGrid,
      color: "#eab308",
      description: "Your team's shared control room — assign tasks, review human-readable AI change summaries, and approve release actions.",
      highlights: [
        "Task & Feature Kanban Board: Track To Do, In Progress, Review, and Done tasks with AI context notes.",
        "AI Change Summaries: Understand what changed, affected modules, and recommended tests.",
        "Discussions & Approvals: Threaded @mentions and team approval workflow before production execution."
      ],
      ctaText: "Next: Deployment & AI Doctor",
      targetTab: "Collaborate"
    },
    {
      title: "Deployment & AI Deployment Doctor",
      eyebrow: "Beginner Guide • Step 5 of 5",
      icon: Rocket,
      color: "#ec4899",
      description: "Preview releases and diagnose build failures automatically from build logs.",
      highlights: [
        "Deployment Pipeline: Tracks build progress from preview check to live production.",
        "Deployment Doctor: Regex log parser that identifies missing environment variables (e.g. VITE_API_URL).",
        "Confidence & Fix Recommendations: Provides root-cause analysis with actionable solutions."
      ],
      ctaText: "Finish & Start Using Project Twin",
      targetTab: "Deploy"
    }
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (onNavigate && steps[nextStep].targetTab) {
        onNavigate(steps[nextStep].targetTab);
      }
    } else {
      localStorage.setItem("project-twin-guided", "true");
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (onNavigate && steps[prevStep].targetTab) {
        onNavigate(steps[prevStep].targetTab);
      }
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "16px" }}>
      <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "12px", width: "540px", maxWidth: "95vw", boxShadow: "0 24px 60px rgba(0,0,0,0.8)", overflow: "hidden", color: "#c9d1d9" }}>
        
        {/* Header Bar */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #30363d", background: "#0d1117", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: step.color, display: "grid", placeItems: "center", color: "#fff" }}>
              <StepIcon size={16} />
            </div>
            <div>
              <span style={{ fontSize: "0.68rem", color: step.color, fontWeight: "700", textTransform: "uppercase" }}>{step.eyebrow}</span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#f0f6fc", margin: 0 }}>{step.title}</h3>
            </div>
          </div>

          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#8b949e", cursor: "pointer", padding: "4px" }}>
            <X size={18} />
          </button>
        </div>

        {/* Progress Track Bar */}
        <div style={{ height: "4px", background: "#0d1117", width: "100%" }}>
          <div style={{ height: "100%", background: step.color, width: `${((currentStep + 1) / steps.length) * 100}%`, transition: "width 0.3s ease" }} />
        </div>

        {/* Content Body */}
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: "0.85rem", color: "#e6edf3", lineHeight: "1.5", margin: "0 0 16px 0" }}>
            {step.description}
          </p>

          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <strong style={{ fontSize: "0.75rem", color: "#8b949e", textTransform: "uppercase" }}>Key Takeaways & Workflow:</strong>
            {step.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.8rem", color: "#c9d1d9", lineHeight: "1.4" }}>
                <CheckCircle2 size={15} style={{ color: step.color, flexShrink: 0, marginTop: "2px" }} />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #30363d", background: "#0d1117", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Dots Indicator */}
          <div style={{ display: "flex", gap: "6px" }}>
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                  if (onNavigate && steps[idx].targetTab) onNavigate(steps[idx].targetTab);
                }}
                style={{
                  width: idx === currentStep ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: idx === currentStep ? step.color : "#30363d",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                style={{ background: "#21262d", border: "1px solid #30363d", color: "#c9d1d9", borderRadius: "6px", padding: "6px 12px", fontSize: "0.78rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            )}

            <button
              onClick={handleNext}
              style={{ background: step.color, border: "none", color: "#fff", borderRadius: "6px", padding: "6px 16px", fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>{step.ctaText}</span>
              {currentStep < steps.length - 1 && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
