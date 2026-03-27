export function getSuspicionScore(email: string) {
  let score = 0;

  if (!email.includes("@")) score += 0.4;
  if (email.includes("admin")) score += 0.3;
  if (email.includes("test")) score += 0.3;

  return Math.min(score, 1);
}