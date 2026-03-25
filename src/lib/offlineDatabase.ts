export interface OfflineUser {
  id: string;
  email: string;
  name: string;
  role: 'manager' | 'employee';
  passwordHash: string | null;
  createdAt: string;
}

interface LegacyOfflineUser {
  id: string;
  email: string;
  name: string;
  role: 'manager' | 'employee';
  passwordHintHash?: string;
  passwordHash?: string | null;
  createdAt: string;
}

interface AnalyticsSnapshot {
  generatedAt: string;
  rows: Array<Record<string, string | number>>;
}

interface OfflineStore {
  users: OfflineUser[];
  lastSessionUserId: string | null;
  analyticsSnapshots: AnalyticsSnapshot[];
}

const STORAGE_KEY = 'performance-ai-offline-db';

const defaultStore: OfflineStore = {
  users: [],
  lastSessionUserId: null,
  analyticsSnapshots: [],
};

function normalizeUser(user: LegacyOfflineUser): OfflineUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    passwordHash: user.passwordHash ?? user.passwordHintHash ?? null,
    createdAt: user.createdAt,
  };
}

function safeParse(raw: string | null): OfflineStore {
  if (!raw) return { ...defaultStore };

  try {
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users.map(normalizeUser) : [],
      lastSessionUserId: typeof parsed.lastSessionUserId === 'string' ? parsed.lastSessionUserId : null,
      analyticsSnapshots: Array.isArray(parsed.analyticsSnapshots) ? parsed.analyticsSnapshots : [],
    };
  } catch {
    return { ...defaultStore };
  }
}

function save(store: OfflineStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(password));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function readOfflineStore(): OfflineStore {
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

export function upsertOfflineUser(user: OfflineUser) {
  const store = readOfflineStore();
  const users = store.users.filter((u) => u.id !== user.id && u.email !== user.email);
  users.push(user);

  save({
    ...store,
    users,
  });
}

export function setOfflineSession(userId: string | null) {
  const store = readOfflineStore();
  save({ ...store, lastSessionUserId: userId });
}

export function getOfflineSessionUser() {
  const store = readOfflineStore();
  return store.users.find((user) => user.id === store.lastSessionUserId) ?? null;
}

export function findOfflineUserByEmail(email: string) {
  const store = readOfflineStore();
  return store.users.find((user) => user.email === email) ?? null;
}

export function storeAnalyticsSnapshot(rows: Array<Record<string, string | number>>) {
  const store = readOfflineStore();
  const next = [{ generatedAt: new Date().toISOString(), rows }, ...store.analyticsSnapshots].slice(0, 20);
  save({ ...store, analyticsSnapshots: next });
}

export function readAnalyticsSnapshots() {
  return readOfflineStore().analyticsSnapshots;
}
