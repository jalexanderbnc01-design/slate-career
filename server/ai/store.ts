import { FieldValue } from "firebase-admin/firestore";
import {
  getAdminFirestore,
  hasAdminWebhookCredentials,
} from "../firebaseStore";
import {
  AIModelInfo,
  ConnectionState,
  ProviderRuntimeConfig,
  UsageLogEntry,
} from "./types";

interface PersistedAIStore {
  configs: Record<string, ProviderRuntimeConfig>;
  usageLogs: UsageLogEntry[];
}

const DEFAULT_CONFIGS: Record<string, ProviderRuntimeConfig> = {
  gemini: { enabled: true },
  openrouter_free: { enabled: true },
  openrouter_paid: { enabled: true, openRouterMonthlyCapUsd: 10 },
  dashscope: {
    enabled: true,
    customModels: ["qwen3.7-max", "qwen3.6-plus", "qwen3-coder-plus"],
  },
  azure_openai: {
    enabled: true,
    azureApiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-10-21",
    azureDeployment: process.env.AZURE_OPENAI_DEPLOYMENT || "",
    customBaseUrl: process.env.AZURE_OPENAI_ENDPOINT || "",
  },
  anthropic: { enabled: true },
  ollama: {
    enabled: true,
    customBaseUrl: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
  },
  lm_studio: {
    enabled: true,
    customBaseUrl: process.env.LM_STUDIO_BASE_URL || "http://127.0.0.1:1234/v1",
  },
  openclaw: { enabled: false },
  comfyui: { enabled: false },
  copilot_enterprise: { enabled: false },
  worker_ai: { enabled: false },
  firebase_ai_logic: { enabled: false },
};

function createDefaultPersistedStore(): PersistedAIStore {
  return {
    configs: JSON.parse(JSON.stringify(DEFAULT_CONFIGS)),
    usageLogs: [],
  };
}

let memoryStore: PersistedAIStore = createDefaultPersistedStore();

const AI_SETTINGS_DOC_ID = "ai_runtime";
let aiStoreOwnerUid: string | null = null;
let hydratedOwnerUid: string | null = null;

export function setAiStoreOwner(uid: string | null): void {
  aiStoreOwnerUid = uid || null;
}

export async function hydrateAiStoreForUser(uid: string): Promise<void> {
  if (!uid || hydratedOwnerUid === uid) return;
  if (!hasAdminWebhookCredentials()) {
    hydratedOwnerUid = uid;
    return;
  }
  try {
    const snap = await getAdminFirestore()
      .doc(`users/${uid}/settings/${AI_SETTINGS_DOC_ID}`)
      .get();
    if (snap.exists) {
      const data = snap.data() as { data?: { store?: Partial<PersistedAIStore> } } | undefined;
      const persisted = data?.data?.store;
      if (persisted) {
        memoryStore = {
          configs: { ...DEFAULT_CONFIGS, ...(persisted.configs || {}) },
          usageLogs: Array.isArray(persisted.usageLogs)
            ? persisted.usageLogs.slice(0, 250)
            : [],
        };
      }
    }
    hydratedOwnerUid = uid;
  } catch (err) {
    console.warn("AI store hydration from Firestore failed:", err);
    hydratedOwnerUid = uid;
  }
}

function persistStore() {
  if (!aiStoreOwnerUid || !hasAdminWebhookCredentials()) return;
  const ownerUid = aiStoreOwnerUid;
  const payload = {
    configs: memoryStore.configs,
    usageLogs: memoryStore.usageLogs,
  };
  const ref = getAdminFirestore().doc(`users/${ownerUid}/settings/${AI_SETTINGS_DOC_ID}`);
  ref
    .get()
    .then((snap) => {
      const prevVersion =
        snap.exists && typeof snap.data()?.version === "number"
          ? (snap.data()!.version as number)
          : 0;
      return ref.set({
        uid: ownerUid,
        kind: AI_SETTINGS_DOC_ID,
        data: { store: payload },
        createdAt: snap.exists && snap.data()?.createdAt ? snap.data()!.createdAt : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        version: prevVersion + 1,
      });
    })
    .catch((err) => console.warn("AI store Firestore persistence failed:", err));
}

// Transient runtime discovery state (not persisted as confirmed across restarts until probed)
const liveStatusCache: Record<
  string,
  { status: ConnectionState; message: string; models: AIModelInfo[]; checkedAt?: string }
> = {};

export function getProviderConfig(providerId: string): ProviderRuntimeConfig {
  return (
    memoryStore.configs[providerId] ||
    DEFAULT_CONFIGS[providerId] || { enabled: false }
  );
}

export function updateProviderConfig(
  providerId: string,
  patch: Partial<ProviderRuntimeConfig>
): ProviderRuntimeConfig {
  const current = getProviderConfig(providerId);
  const updated: ProviderRuntimeConfig = {
    ...current,
    ...(typeof patch.enabled === "boolean" ? { enabled: patch.enabled } : {}),
    ...(typeof patch.customBaseUrl === "string"
      ? { customBaseUrl: patch.customBaseUrl.trim() }
      : {}),
    ...(Array.isArray(patch.customModels)
      ? {
          customModels: Array.from(
            new Set(patch.customModels.map((m) => String(m).trim()).filter(Boolean))
          ),
        }
      : {}),
    ...(typeof patch.azureDeployment === "string"
      ? { azureDeployment: patch.azureDeployment.trim() }
      : {}),
    ...(typeof patch.azureApiVersion === "string"
      ? { azureApiVersion: patch.azureApiVersion.trim() }
      : {}),
    ...(typeof patch.openRouterMonthlyCapUsd === "number" &&
    !Number.isNaN(patch.openRouterMonthlyCapUsd)
      ? { openRouterMonthlyCapUsd: Math.max(0, patch.openRouterMonthlyCapUsd) }
      : {}),
  };

  memoryStore.configs[providerId] = updated;
  persistStore();
  return updated;
}

export function setLiveDiscoveryState(
  providerId: string,
  state: {
    status: ConnectionState;
    message: string;
    models: AIModelInfo[];
    checkedAt?: string;
  }
) {
  liveStatusCache[providerId] = state;
}

export function getLiveDiscoveryState(providerId: string) {
  return liveStatusCache[providerId] || null;
}

export function recordUsageEntry(entry: Omit<UsageLogEntry, "id" | "timestamp">) {
  const full: UsageLogEntry = {
    id: `use-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  memoryStore.usageLogs = [full, ...memoryStore.usageLogs].slice(0, 250);
  persistStore();
  return full;
}

export function getMonthlyOpenRouterPaidSpendUsd(): number {
  const now = new Date();
  const currentMonthPrefix = `${now.getUTCFullYear()}-${String(
    now.getUTCMonth() + 1
  ).padStart(2, "0")}`;

  return Number(
    memoryStore.usageLogs
      .filter(
        (l) =>
          l.providerId === "openrouter_paid" &&
          l.success &&
          l.timestamp.startsWith(currentMonthPrefix)
      )
      .reduce((acc, l) => acc + (l.estimatedCostUsd || 0), 0)
      .toFixed(6)
  );
}

export function getUsageSummary() {
  const byProvider: Record<
    string,
    {
      providerId: string;
      providerName: string;
      requests: number;
      failures: number;
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      estimatedCostUsd: number;
    }
  > = {};

  for (const log of memoryStore.usageLogs) {
    if (!byProvider[log.providerId]) {
      byProvider[log.providerId] = {
        providerId: log.providerId,
        providerName: log.providerName,
        requests: 0,
        failures: 0,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        estimatedCostUsd: 0,
      };
    }
    const bucket = byProvider[log.providerId];
    bucket.requests += 1;
    if (!log.success) bucket.failures += 1;
    bucket.promptTokens += log.promptTokens;
    bucket.completionTokens += log.completionTokens;
    bucket.totalTokens += log.totalTokens;
    bucket.estimatedCostUsd = Number(
      (bucket.estimatedCostUsd + log.estimatedCostUsd).toFixed(6)
    );
  }

  const paidCap = getProviderConfig("openrouter_paid").openRouterMonthlyCapUsd ?? 10;
  const paidSpent = getMonthlyOpenRouterPaidSpendUsd();

  return {
    totalRequests: memoryStore.usageLogs.length,
    totalTokens: memoryStore.usageLogs.reduce((s, l) => s + l.totalTokens, 0),
    totalCostUsd: Number(
      memoryStore.usageLogs
        .reduce((s, l) => s + l.estimatedCostUsd, 0)
        .toFixed(6)
    ),
    openRouterPaidMonthlySpendUsd: paidSpent,
    openRouterPaidMonthlyCapUsd: paidCap,
    byProvider: Object.values(byProvider),
    recentLogs: memoryStore.usageLogs.slice(0, 40),
  };
}

export function resetUsageLogs() {
  memoryStore.usageLogs = [];
  persistStore();
}
