let cachedSettings: Record<string, string> | null = null;
let pendingFetch: Promise<Record<string, string>> | null = null;

export async function fetchSettingsCached(): Promise<Record<string, string>> {
  if (cachedSettings) return cachedSettings;
  if (pendingFetch) return pendingFetch;

  pendingFetch = fetch("/api/settings")
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        cachedSettings = data;
        return data;
      }
      return {};
    })
    .catch((err) => {
      console.error("Failed to fetch settings:", err);
      return {};
    })
    .finally(() => {
      pendingFetch = null;
    });

  return pendingFetch;
}

export function clearSettingsCache() {
  cachedSettings = null;
  pendingFetch = null;
}
