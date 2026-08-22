import React from 'react';
import { Lightbulb } from 'lucide-react';

const guideTexts = {
  Overview: "Analyze any GitHub repository URL to index source files, detect framework stacks, and view launch readiness scores.",
  Intelligence: "Inspect indexed framework signals, cross-file runtime architecture diagrams, and verified API route locations.",
  Readiness: "Review 10 weighted launch readiness criteria (lockfiles, CI workflows, environment docs, and secret guards).",
  Upgrades: "Review AI-recommended security upgrades and architectural refactorings derived from repository evidence.",
  Deploy: "Track preview build releases and use Deployment Doctor to diagnose missing environment variables from error logs.",
  Collaborate: "Manage team tasks on the Kanban board, review AI change summaries, discuss with @mentions, and approve releases."
};

export function SingleLinePageGuide({ tab }) {
  const text = guideTexts[tab] || guideTexts.Overview;

  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.1) 0%, rgba(31, 111, 235, 0.1) 100%)',
      border: '1px solid rgba(168, 85, 247, 0.25)',
      borderRadius: '6px',
      padding: '8px 14px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.78rem',
      color: '#c9d1d9'
    }}>
      <Lightbulb size={15} style={{ color: '#eab308', flexShrink: 0 }} />
      <span style={{ fontWeight: '700', color: '#f0f6fc', flexShrink: 0 }}>Guide:</span>
      <span style={{ color: '#c9d1d9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  );
}
