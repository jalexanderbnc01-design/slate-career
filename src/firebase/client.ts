import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
} from "firebase/auth";
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDocFromServer,
  serverTimestamp,
  runTransaction,
  type Firestore,
  type DocumentReference,
  type DocumentData,
} from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-applet-config.json";

export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;
export const FIRESTORE_DATABASE_ID = firebaseConfig.firestoreDatabaseId;

const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

function createFirestoreInstance(firebaseApp: FirebaseApp): Firestore {
  try {
    return initializeFirestore(
      firebaseApp,
      {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      },
      FIRESTORE_DATABASE_ID
    );
  } catch {
    return getFirestore(firebaseApp, FIRESTORE_DATABASE_ID);
  }
}

export const db: Firestore = createFirestoreInstance(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutFirebase() {
  return signOut(auth);
}

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export class StaleEditError extends Error {
  readonly path: string;
  readonly expectedVersion: number;
  readonly actualVersion: number;

  constructor(path: string, expectedVersion: number, actualVersion: number) {
    super(
      `Stale edit detected at ${path}: your copy is v${expectedVersion}, but Firestore has v${actualVersion}. Refresh before overwriting.`
    );
    this.name = "StaleEditError";
    this.path = path;
    this.expectedVersion = expectedVersion;
    this.actualVersion = actualVersion;
  }
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("the client is offline")
    ) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
void testConnection();

export function sanitizeDocId(raw: string, fallbackPrefix = "doc"): string {
  const cleaned = String(raw || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120);
  return cleaned || `${fallbackPrefix}_${Date.now().toString(36)}`;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const authHeaders = await getAuthHeaders();
  const headers = new Headers(init.headers || {});
  if (authHeaders.Authorization && !headers.has("Authorization")) {
    headers.set("Authorization", authHeaders.Authorization);
  }
  return fetch(input, { ...init, headers });
}

export async function createVersionedDoc<T extends Record<string, any>>(
  ref: DocumentReference<DocumentData>,
  uid: string,
  payload: T,
  pathForLog: string
): Promise<void> {
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (snap.exists()) {
        const existing = snap.data();
        const curVersion = typeof existing.version === "number" ? existing.version : 1;
        tx.set(ref, {
          ...payload,
          uid,
          createdAt: existing.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
          version: curVersion + 1,
        });
      } else {
        tx.set(ref, {
          ...payload,
          uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          version: 1,
        });
      }
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, pathForLog);
  }
}

export async function updateVersionedDoc(
  ref: DocumentReference<DocumentData>,
  uid: string,
  patch: Record<string, any>,
  expectedVersion: number | undefined,
  pathForLog: string
): Promise<number> {
  try {
    return await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) {
        throw new Error(`Document does not exist at ${pathForLog}`);
      }
      const existing = snap.data();
      const currentVersion =
        typeof existing.version === "number" ? existing.version : 1;
      if (
        typeof expectedVersion === "number" &&
        expectedVersion > 0 &&
        currentVersion !== expectedVersion
      ) {
        throw new StaleEditError(pathForLog, expectedVersion, currentVersion);
      }
      const nextVersion = currentVersion + 1;
      tx.update(ref, {
        ...patch,
        uid,
        updatedAt: serverTimestamp(),
        version: nextVersion,
      });
      return nextVersion;
    });
  } catch (err) {
    if (err instanceof StaleEditError) {
      throw err;
    }
    handleFirestoreError(err, OperationType.UPDATE, pathForLog);
  }
}

export async function upsertVersionedDoc(
  ref: DocumentReference<DocumentData>,
  uid: string,
  data: Record<string, any>,
  pathForLog: string,
  expectedVersion?: number
): Promise<number> {
  try {
    return await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) {
        tx.set(ref, {
          ...data,
          uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          version: 1,
        });
        return 1;
      }
      const existing = snap.data();
      const currentVersion =
        typeof existing.version === "number" ? existing.version : 1;
      if (
        typeof expectedVersion === "number" &&
        expectedVersion > 0 &&
        currentVersion !== expectedVersion
      ) {
        throw new StaleEditError(pathForLog, expectedVersion, currentVersion);
      }
      const nextVersion = currentVersion + 1;
      tx.set(ref, {
        ...data,
        uid,
        createdAt: existing.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
        version: nextVersion,
      });
      return nextVersion;
    });
  } catch (err) {
    if (err instanceof StaleEditError) {
      throw err;
    }
    handleFirestoreError(err, OperationType.WRITE, pathForLog);
  }
}
