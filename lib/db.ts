import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export interface SessionInfo {
  id: string;
  username: string;
  ip: string;
  userAgent: string;
  riskScore: number;
  routedToDecoy: boolean;
  timestamp: string;
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

// Ensure the data directory and db file exist
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

export async function logSession(session: Omit<SessionInfo, "id" | "timestamp">) {
  const db = await readDB();
  const newSession: SessionInfo = {
    ...session,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
  };
  db.sessions.push(newSession);
  await writeDB(db);
  return newSession;
}

export async function logAction(action: Omit<SuspiciousAction, "id" | "timestamp">) {
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
  return db.sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getActionsForSession(sessionId: string): Promise<SuspiciousAction[]> {
  const db = await readDB();
  return db.actions
    .filter((a) => a.sessionId === sessionId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
