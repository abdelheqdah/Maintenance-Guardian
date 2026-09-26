/**
 * Storage Layer Abstraction
 * Isolates all localStorage interactions so the data layer can easily be
 * swapped with an HTTP client (Axios / Fetch) pointing to a REST API in future versions.
 */

export const DEFAULT_COMPANY_ID = 'default-company';

const PREFIX = 'mg_v1_';

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (err) {
      console.error(`[Storage] Failed to read key "${key}":`, err);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    } catch (err) {
      console.error(`[Storage] Failed to write key "${key}":`, err);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(`${PREFIX}${key}`);
    } catch (err) {
      console.error(`[Storage] Failed to remove key "${key}":`, err);
    }
  },

  clearAll(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (err) {
      console.error('[Storage] Failed to clear application keys:', err);
    }
  },
};
