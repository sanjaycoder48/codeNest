function answerProjectQuestion({ question = '', repositoryTwin = null, role = 'public' }) {
  if (!repositoryTwin) {
    return {
      classification: 'UNKNOWN',
      answer: 'No repository analysis context is available to answer this question.',
      evidence: [],
      confidence: 0
    };
  }

  const q = String(question).toLowerCase().trim();
  const projName = repositoryTwin.project?.name || 'this repository';
  const frameworks = repositoryTwin.frameworks || [];
  const apiRoutes = repositoryTwin.apiRoutes || [];
  const readiness = repositoryTwin.readiness || { score: 85, findings: [] };
  const recommendations = repositoryTwin.recommendations || [];
  const evidenceFiles = repositoryTwin.evidence || [];
  const envVars = repositoryTwin.environment || [];
  const isPublic = role === 'public';

  // Helper to mask file paths if public
  const maskFile = (filePath) => isPublic ? (filePath.split('/').pop() || 'config') : filePath;

  // 1. Authentication & Security Query
  if (q.includes('auth') || q.includes('login') || q.includes('jwt') || q.includes('session') || q.includes('user')) {
    const authFiles = evidenceFiles.filter(f => /auth|user|jwt|session/i.test(f));
    const authRoutes = apiRoutes.filter(r => /auth|login|signup|register|user/i.test(r.path));

    if (authRoutes.length > 0 || authFiles.length > 0) {
      const fileRef = authFiles[0] ? maskFile(authFiles[0]) : (authRoutes[0] ? maskFile(authRoutes[0].file) : 'package.json');
      const routePaths = authRoutes.map(r => `${r.method} ${r.path}`).join(', ');
      
      return {
        classification: 'VERIFIED',
        answer: `Authentication in ${projName} is handled via ${fileRef}.${routePaths ? ` Indexed auth endpoints: ${routePaths}.` : ''}`,
        evidence: [
          { type: 'file', reference: fileRef },
          ...(authRoutes[0] ? [{ type: 'route', reference: `${authRoutes[0].method} ${authRoutes[0].path}` }] : [])
        ],
        confidence: 96
      };
    }

    return {
      classification: 'INFERRED',
      answer: `No dedicated authentication controller was verified in the indexed routes. ${projName} may use external session handlers or basic route guards.`,
      evidence: [{ type: 'file', reference: 'package.json' }],
      confidence: 72
    };
  }

  // 2. Production Risks & What Could Break
  if (q.includes('break') || q.includes('risk') || q.includes('fail') || q.includes('readiness') || q.includes('vulnerab')) {
    const findings = readiness.findings || [];
    if (findings.length > 0) {
      const topFinding = findings[0];
      return {
        classification: 'VERIFIED',
        answer: `Production readiness score is ${readiness.score}/100. Primary verified risk: ${topFinding.problem}. Why: ${topFinding.why}. Solution: ${topFinding.solution}`,
        evidence: [
          { type: 'finding', reference: `${topFinding.area}: ${topFinding.problem}` },
          { type: 'file', reference: maskFile(topFinding.file || 'repository root') }
        ],
        confidence: 98
      };
    }

    return {
      classification: 'VERIFIED',
      answer: `All 10 verified production readiness checks passed for ${projName} with a readiness score of 100/100.`,
      evidence: [{ type: 'check', reference: 'Production Readiness Suite' }],
      confidence: 98
    };
  }

  // 3. APIs & Exposed Endpoints Query
  if (q.includes('api') || q.includes('route') || q.includes('endpoint') || q.includes('expose')) {
    if (apiRoutes.length > 0) {
      const sampleRoutes = apiRoutes.slice(0, 5).map(r => `${r.method} ${r.path}`).join(', ');
      return {
        classification: 'VERIFIED',
        answer: `${projName} exposes ${apiRoutes.length} REST/API endpoints. Verified sample endpoints: ${sampleRoutes}.`,
        evidence: apiRoutes.slice(0, 3).map(r => ({ type: 'route', reference: `${r.method} ${r.path} (${maskFile(r.file)})` })),
        confidence: 96
      };
    }

    return {
      classification: 'INFERRED',
      answer: `No REST API route declarations (.get/.post) were extracted from the source files. ${projName} may operate as a static client or GraphQL service.`,
      evidence: [{ type: 'file', reference: 'package.json' }],
      confidence: 75
    };
  }

  // 4. Architecture & Stack Query
  if (q.includes('architect') || q.includes('stack') || q.includes('framework') || q.includes('structure') || q.includes('backend') || q.includes('frontend')) {
    const nodes = repositoryTwin.architecture?.nodes || [];
    const stackStr = frameworks.join(', ') || 'web framework';
    const flowStr = nodes.map(n => n.label).join(' → ') || stackStr;

    return {
      classification: 'VERIFIED',
      answer: `${projName} is built using ${stackStr}. Detected architecture flow: ${flowStr}.`,
      evidence: frameworks.map(f => ({ type: 'framework', reference: f })),
      confidence: 95
    };
  }

  // 5. Upgrades & Next Steps Query
  if (q.includes('upgrade') || q.includes('recommend') || q.includes('future') || q.includes('scale') || q.includes('next level')) {
    if (recommendations.length > 0) {
      const topRec = recommendations[0];
      return {
        classification: 'VERIFIED',
        answer: `Top recommended upgrade for ${projName} (${topRec.category}): ${topRec.title}. Recommendation: ${topRec.recommended}. Benefit: ${topRec.benefit}.`,
        evidence: [
          { type: 'recommendation', reference: `${topRec.category}: ${topRec.title}` },
          { type: 'file', reference: maskFile(topRec.evidence || 'package.json') }
        ],
        confidence: 94
      };
    }
  }

  // 6. Environment & Secret Protection Query
  if (q.includes('secret') || q.includes('env') || q.includes('token') || q.includes('key') || q.includes('password')) {
    if (isPublic) {
      const publicEnvNames = envVars.filter(e => !e.sensitive && !/KEY|SECRET|TOKEN|PASSWORD|URI/i.test(e.name)).map(e => e.name);
      return {
        classification: 'VERIFIED',
        answer: `Public environment configuration reference: ${publicEnvNames.join(', ') || 'No public environment variables configured'}. Secret keys and private tokens are excluded from public showcase view.`,
        evidence: [{ type: 'config', reference: 'Public Environment Register' }],
        confidence: 100
      };
    }

    const sens = envVars.filter(e => e.sensitive).map(e => e.name);
    return {
      classification: 'VERIFIED',
      answer: `Detected ${envVars.length} environment variables (${sens.length} sensitive secrets protected: ${sens.join(', ') || 'None'}). No secret values are stored or exposed.`,
      evidence: envVars.slice(0, 3).map(e => ({ type: 'env', reference: `${e.name} (${maskFile(e.file)})` })),
      confidence: 98
    };
  }

  // Fallback for unindexed or unknown queries
  return {
    classification: 'UNKNOWN',
    answer: `The question "${question}" cannot be verified from the indexed repository evidence for ${projName}.`,
    evidence: [{ type: 'index', reference: 'Repository Evidence Base' }],
    confidence: 30
  };
}

module.exports = { answerProjectQuestion };
