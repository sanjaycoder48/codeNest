function diagnoseDeploymentFailure({ logs = '', repositoryTwin = null, environment = [], requiredEnvironment = [] }) {
  const logStr = String(logs).slice(0, 30000);
  const configuredEnvSet = new Set(Array.isArray(environment) ? environment : []);
  const twinEnvList = repositoryTwin?.environment || [];
  const twinReadiness = repositoryTwin?.readiness?.findings || [];
  const twinDeps = repositoryTwin?.dependencies || [];

  // Scenario 1: Missing Environment Variable (Regex scan + Twin Env cross-reference)
  const envLogMatch = logStr.match(/(?:missing|undefined|not defined|invalid env)[:\s]+([A-Z][A-Z0-9_]{2,})/)
    || logStr.match(/ERROR[:\s]+([A-Z][A-Z0-9_]{2,})\s+is\s+undefined/)
    || logStr.match(/process\.env\.([A-Z][A-Z0-9_]{2,})/)
    || logStr.match(/import\.meta\.env\.([A-Z][A-Z0-9_]{2,})/);

  let targetVar = envLogMatch?.[1];

  // If not explicitly parsed in log snippet, check for unconfigured twin environment variables
  if (!targetVar && twinEnvList.length > 0) {
    const unconfigured = twinEnvList.find(e => !configuredEnvSet.has(e.name));
    if (unconfigured) targetVar = unconfigured.name;
  }

  if (targetVar) {
    const twinEnvMatch = twinEnvList.find(e => e.name === targetVar);
    const affectedFile = twinEnvMatch?.file || 'src/services/api.ts';
    const isSensitive = twinEnvMatch?.sensitive || /KEY|SECRET|TOKEN|PASSWORD|URI/.test(targetVar);

    return {
      status: 'diagnosed',
      rootCause: `${targetVar} is missing from preview environment`,
      evidence: logStr.includes(targetVar) ? `ERROR ${targetVar} is undefined` : `Reference found in ${affectedFile}`,
      affectedFile,
      severity: isSensitive ? 'CRITICAL' : 'HIGH',
      confidence: 98,
      recommendedFix: [
        `Locate ${targetVar} reference in ${affectedFile}`,
        `Configure ${targetVar} in preview environment variables without exposing secret values`,
        'Re-trigger preview deployment runner'
      ],
      sideEffects: `Runtime requests referencing ${targetVar} will crash or return HTTP 500 until configured.`
    };
  }

  // Scenario 2: Missing Module / Dependency (TS2307 / Module not found)
  const moduleLogMatch = logStr.match(/(?:Cannot find module|Module not found|TS2307)[:\s]+['"]([^'"]+)['"]/i);
  if (moduleLogMatch) {
    const missingPkg = moduleLogMatch[1];
    return {
      status: 'diagnosed',
      rootCause: `Missing module dependency: '${missingPkg}'`,
      evidence: moduleLogMatch[0],
      affectedFile: 'package.json',
      severity: 'HIGH',
      confidence: 94,
      recommendedFix: [
        `Add '${missingPkg}' to package.json dependencies`,
        'Run npm install locally to update package-lock.json',
        'Commit package.json and package-lock.json before retrying'
      ],
      sideEffects: 'Build compilation fails at import resolution phase.'
    };
  }

  // Scenario 3: Missing Build Script
  const scriptFinding = twinReadiness.find(f => f.id === 'build');
  if (logStr.includes('missing script: build') || scriptFinding) {
    return {
      status: 'diagnosed',
      rootCause: 'No build command or script defined in package.json',
      evidence: 'npm ERR! missing script: build',
      affectedFile: 'package.json',
      severity: 'CRITICAL',
      confidence: 96,
      recommendedFix: [
        'Open package.json',
        'Add "build": "vite build" or "next build" script',
        'Verify build command locally with npm run build'
      ],
      sideEffects: 'Deployment runner cannot generate static production assets.'
    };
  }

  // Default Fallback
  return {
    status: 'needs-review',
    rootCause: 'Unresolved build or runtime initialization error',
    evidence: logStr.slice(0, 100) || 'Build exited with non-zero status code',
    affectedFile: 'repository root',
    severity: 'MEDIUM',
    confidence: 65,
    recommendedFix: [
      'Inspect full build runner logs',
      'Compare local runtime node version with deployment environment',
      'Re-trigger preview build'
    ],
    sideEffects: 'Deployment stalled pending manual log inspection.'
  };
}

module.exports = { diagnoseDeploymentFailure };
