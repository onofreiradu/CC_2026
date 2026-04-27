export type AuthMeResponse = {
  userId: number;
  username: string;
};

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  birth_date: string | null;
  phone_number: string | null;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
};

type MockSession = {
  userId: number;
};

type RegisterPayload = {
  username: string;
  email: string;
  full_name: string;
  password: string;
  birth_date: string | null;
  phone_number: string | null;
};

type LoginPayload = {
  email: string;
  password: string;
};

const SESSION_KEY = 'mock_session_v1';
const USERS_KEY = 'mock_users_v1';
const PASSWORDS_KEY = 'mock_passwords_v1';

type UserMap = Record<number, UserProfile>;
type PasswordMap = Record<number, string>;

class MockApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const readJson = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getUsers = () => readJson<UserMap>(USERS_KEY, {});
const setUsers = (users: UserMap) => writeJson(USERS_KEY, users);

const getPasswords = () => readJson<PasswordMap>(PASSWORDS_KEY, {});
const setPasswords = (passwords: PasswordMap) => writeJson(PASSWORDS_KEY, passwords);

const getSession = () => readJson<MockSession | null>(SESSION_KEY, null);
const setSession = (session: MockSession | null) => {
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  writeJson(SESSION_KEY, session);
};

const nextUserId = (users: UserMap) => {
  const ids = Object.keys(users).map((id) => Number(id));
  return ids.length ? Math.max(...ids) + 1 : 1;
};

export const mockRegisterEndpoint = async (payload: RegisterPayload): Promise<UserProfile> => {
  await sleep(180);

  const users = getUsers();
  const duplicate = Object.values(users).some((user) => user.email === payload.email);
  if (duplicate) {
    throw new MockApiError(409, 'Email already registered');
  }

  const now = new Date().toISOString();
  const id = nextUserId(users);

  const user: UserProfile = {
    id,
    username: payload.username,
    email: payload.email,
    full_name: payload.full_name,
    birth_date: payload.birth_date,
    phone_number: payload.phone_number,
    profile_picture_url: null,
    created_at: now,
    updated_at: now,
  };

  users[id] = user;
  setUsers(users);

  const passwords = getPasswords();
  passwords[id] = payload.password;
  setPasswords(passwords);

  return user;
};

export const mockLoginEndpoint = async (payload: LoginPayload): Promise<{ success: true }> => {
  await sleep(180);

  const users = getUsers();
  const passwords = getPasswords();
  const user = Object.values(users).find((entry) => entry.email === payload.email);

  if (!user) {
    throw new MockApiError(401, 'Invalid credentials');
  }

  if (passwords[user.id] !== payload.password) {
    throw new MockApiError(401, 'Invalid credentials');
  }

  setSession({ userId: user.id });
  return { success: true };
};

export const mockAuthMeEndpoint = async (): Promise<AuthMeResponse> => {
  await sleep(100);

  const session = getSession();
  if (!session) {
    throw new MockApiError(401, 'Unauthorized');
  }

  const users = getUsers();
  const user = users[session.userId];
  if (!user) {
    throw new MockApiError(404, 'User not found');
  }

  return { userId: user.id, username: user.username };
};

export const mockUsersMeEndpoint = async (): Promise<UserProfile> => {
  await sleep(130);

  const session = getSession();
  if (!session) {
    throw new MockApiError(401, 'Unauthorized');
  }

  const users = getUsers();
  const user = users[session.userId];
  if (!user) {
    throw new MockApiError(404, 'User not found');
  }

  return user;
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new MockApiError(500, 'Failed to read file'));
    reader.readAsDataURL(file);
  });

export const mockUploadProfilePictureEndpoint = async (file: File): Promise<UserProfile> => {
  await sleep(220);

  const session = getSession();
  if (!session) {
    throw new MockApiError(401, 'Unauthorized');
  }

  const users = getUsers();
  const user = users[session.userId];
  if (!user) {
    throw new MockApiError(404, 'User not found');
  }

  const pictureUrl = await fileToDataUrl(file);
  const updatedUser: UserProfile = {
    ...user,
    profile_picture_url: pictureUrl,
    updated_at: new Date().toISOString(),
  };

  users[session.userId] = updatedUser;
  setUsers(users);

  return updatedUser;
};

export const isMockApiError = (error: unknown): error is MockApiError =>
  error instanceof MockApiError;
