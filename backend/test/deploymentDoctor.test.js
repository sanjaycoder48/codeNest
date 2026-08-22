const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { diagnoseDeploymentFailure } = require('../services/deploymentDoctor');

describe('Deployment Doctor Diagnostics Engine', () => {
  it('diagnoses missing environment variable with root cause, evidence, severity, and fixes', () => {
    const logs = `
      12:42:08 Running vite build
      12:42:11 Transforming 2191 modules
      12:42:13 ERROR VITE_API_URL is undefined
      12:42:13 Build exited with code 1
    `;

    const twin = {
      environment: [{ name: 'VITE_API_URL', file: 'src/services/api.ts', sensitive: false }]
    };

    const diagnosis = diagnoseDeploymentFailure({ logs, repositoryTwin: twin });
    assert.equal(diagnosis.status, 'diagnosed');
    assert.ok(diagnosis.rootCause.includes('VITE_API_URL'), 'rootCause must specify missing VITE_API_URL');
    assert.equal(diagnosis.affectedFile, 'src/services/api.ts');
    assert.equal(diagnosis.severity, 'HIGH');
    assert.ok(diagnosis.confidence >= 90, 'confidence must be >= 90%');
    assert.ok(Array.isArray(diagnosis.recommendedFix) && diagnosis.recommendedFix.length > 0);
    assert.ok(typeof diagnosis.sideEffects === 'string' && diagnosis.sideEffects.length > 0);
  });

  it('diagnoses missing module dependency TS2307', () => {
    const logs = "ERROR TS2307: Cannot find module 'axios' or its corresponding type declarations.";
    const diagnosis = diagnoseDeploymentFailure({ logs });

    assert.equal(diagnosis.status, 'diagnosed');
    assert.ok(diagnosis.rootCause.includes("axios"));
    assert.equal(diagnosis.affectedFile, 'package.json');
    assert.equal(diagnosis.severity, 'HIGH');
    assert.ok(diagnosis.recommendedFix.some(fix => fix.includes('package.json')));
  });

  it('diagnoses missing build script', () => {
    const logs = 'npm ERR! missing script: build';
    const diagnosis = diagnoseDeploymentFailure({ logs });

    assert.equal(diagnosis.status, 'diagnosed');
    assert.ok(diagnosis.rootCause.includes('No build command or script defined'));
    assert.equal(diagnosis.affectedFile, 'package.json');
    assert.equal(diagnosis.severity, 'CRITICAL');
  });

  it('returns graceful needs-review fallback for unclassified logs', () => {
    const logs = 'Unknown exit code 137';
    const diagnosis = diagnoseDeploymentFailure({ logs });

    assert.equal(diagnosis.status, 'needs-review');
    assert.ok(diagnosis.confidence < 80);
    assert.ok(Array.isArray(diagnosis.recommendedFix));
  });
});
