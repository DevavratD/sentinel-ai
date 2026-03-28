export interface SessionRiskInput {
  username?: string;
  email?: string;
  ip?: string;
  password?: string;
  userAgent?: string;
  retryCount?: number;
}

export function calculateSessionRisk(input: SessionRiskInput) {
  let sessionRisk = 10; // Baseline

  const targetIdentifier = (input.username || input.email || "").toLowerCase();

  // Username checks
  const suspiciousKeywords = ['admin', 'root', 'test', 'Demo_suspicious'];
  if (suspiciousKeywords.some(keyword => targetIdentifier.includes(keyword))) {
    sessionRisk += 40;
  }

  // Password heuristic check
  const weakPasswords = ['admin', '123456', 'password', 'root'];
  if (input.password && weakPasswords.includes(input.password)) {
    sessionRisk += 20;
  }

  // IP anomaly (Simulated for MVP)
  if (input.ip && input.ip.startsWith('104.28.')) {
    sessionRisk += 20;
  }

  // Retry checks
  if (input.retryCount && input.retryCount > 1) {
    // Add 15 points for every retry beyond the first attempt (capped at 45)
    sessionRisk += Math.min((input.retryCount - 1) * 15, 45);
  }

  // Add a random jitter (0-10) to simulate variability
  sessionRisk += Math.floor(Math.random() * 11);

  // Risk Score = Session Risk × Asset Criticality × Exploit Likelihood
  const assetCriticality = 1.5; // Auth system
  const exploitLikelihood = sessionRisk >= 40 ? 1.2 : 1.0;

  let finalScore = sessionRisk * assetCriticality * exploitLikelihood;

  if (finalScore > 100) finalScore = 100;
  if (finalScore < 0) finalScore = 0;

  finalScore = Math.round(finalScore);

  let riskLevel = "Low";
  if (finalScore >= 70) {
    riskLevel = "High";
  } else if (finalScore >= 40) {
    riskLevel = "Medium";
  }

  return {
    riskScore: finalScore,
    riskLevel
  };
}