import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export interface SessionInfo {
  id: string;
  username: string;
  passwordMasked: string;
  ip: string;
  userAgent: string;
  riskScore: number;
  riskLevel: string;
  routedToDecoy: boolean;
  timestamp: string;
  cveMapping?: string | null;
  aiExplanation?: string | null;
}

export interface SuspiciousAction {
  id: string;
  sessionId: string;
  actionType: string;
  details: string;
  timestamp: string;
}

interface DBData {
  sessions: SessionInfo[];
  actions: SuspiciousAction[];
}

async function initDB() {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.writeFile(DB_PATH, JSON.stringify({ sessions: [], actions: [] }), "utf-8");
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
    return { sessions: [], actions: [] };
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
  session: Omit<SessionInfo, "id" | "timestamp" | "passwordMasked"> & { password: string }
): Promise<SessionInfo> {
  const db = await readDB();
  const newSession: SessionInfo = {
    id: uuidv4(),
    username: session.username,
    passwordMasked: maskPassword(session.password),
    ip: session.ip,
    userAgent: session.userAgent,
    riskScore: session.riskScore,
    riskLevel: session.riskLevel,
    routedToDecoy: session.routedToDecoy,
    cveMapping: session.cveMapping ?? null,
    aiExplanation: session.aiExplanation ?? null,
    timestamp: new Date().toISOString(),
  };
  db.sessions.unshift(newSession); // latest first
  await writeDB(db);
  return newSession;
}

export async function logAction(action: Omit<SuspiciousAction, "id" | "timestamp"> & { sessionId: string }) {
  const db = await readDB();
  const newAction: SuspiciousAction = {
    ...action,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
  };
  db.actions.push(newAction);
  await writeDB(db);
  return newAction;
}

export async function getRecentSessions(): Promise<SessionInfo[]> {
  const db = await readDB();
  return db.sessions;
}

export async function getActionsForSession(sessionId: string): Promise<SuspiciousAction[]> {
  const db = await readDB();
  return db.actions
    .filter((a) => a.sessionId === sessionId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getAllActions(): Promise<SuspiciousAction[]> {
  const db = await readDB();
  return db.actions.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
