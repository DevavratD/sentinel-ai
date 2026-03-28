import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export type Session = {
  sessionId: string;
  username: string;
  maskedPassword: string;
  timestamp: string;
  route: "real" | "decoy";

  sessionRisk: number;
  intentScore: number;
  finalRisk: number;
  riskLevel: "Low" | "Medium" | "High";

  reasons: string[];
  observedIntent: string;

  pagesVisited: string[];
  events: {
    type: string;
    label: string;
    timestamp: string;
  }[];
};

interface DBData {
  sessions: Session[];
}

async function initDB() {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.writeFile(DB_PATH, JSON.stringify({ sessions: [] }), "utf-8");
    }
  } catch (error) {
    console.error("DB Init Error:", error);
  }
}

export async function readDB(): Promise<DBData> {
  await initDB();
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return { sessions: [] };
  }
}

async function writeDB(data: DBData) {
  await initDB();
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function maskPassword(password: string): string {
  if (!password || password.length === 0) return "****";
  if (password.length <= 3) return "*".repeat(password.length);
  return password[0] + "*".repeat(password.length - 2) + password[password.length - 1];
}

export async function logSession(
  session: Omit<Session, "sessionId" | "timestamp" | "maskedPassword" | "events" | "pagesVisited"> & { password: string }
): Promise<Session> {
  const db = await readDB();
  const newSession: Session = {
    sessionId: uuidv4(),
    username: session.username,
    maskedPassword: maskPassword(session.password),
    route: session.route,
    sessionRisk: session.sessionRisk,
    intentScore: session.intentScore,
    finalRisk: session.finalRisk,
    riskLevel: session.riskLevel,
    reasons: session.reasons || [],
    observedIntent: session.observedIntent || "",
    pagesVisited: [],
    events: [],
    timestamp: new Date().toISOString(),
  };
  db.sessions.unshift(newSession); // latest first
  await writeDB(db);
  return newSession;
}

export async function logEvent(
  sessionId: string,
  event: { type: string; label: string; isNav?: boolean }
) {
  const db = await readDB();
  const sessionIndex = db.sessions.findIndex((s) => s.sessionId === sessionId);
  if (sessionIndex === -1) return null;

  const session = db.sessions[sessionIndex];
  
  if (event.isNav) {
    session.pagesVisited.push(event.label);
  } else {
    session.events.unshift({
      type: event.type,
      label: event.label,
      timestamp: new Date().toISOString(),
    });
  }

  // Calculate new intent score based on event type
  let intentIncrement = 0;
  if (event.type.includes("download")) intentIncrement += 20;
  if (event.type.includes("settings") || event.type.includes("log_entry")) intentIncrement += 10;
  if (event.type.includes("employee_view")) intentIncrement += 5;
  if (event.isNav) intentIncrement += 2;

  if (intentIncrement > 0) {
    session.intentScore += intentIncrement;
    if (session.intentScore > 100) session.intentScore = 100;
    
    // Update final risk dynamically
    session.finalRisk = Math.min(100, Math.round(session.sessionRisk + session.intentScore * 0.6));
    
    if (session.finalRisk >= 70) session.riskLevel = "High";
    else if (session.finalRisk >= 40) session.riskLevel = "Medium";
    else session.riskLevel = "Low";
  }

  await writeDB(db);
  return session;
}

export async function getRecentSessions(): Promise<Session[]> {
  const db = await readDB();
  return db.sessions;
}

export async function getSessionById(sessionId: string): Promise<Session | null> {
  const db = await readDB();
  return db.sessions.find(s => s.sessionId === sessionId) || null;
}
