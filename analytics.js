(function () {
  "use strict";

  const ANALYTICS_ENDPOINT = "";
  const BEACON_INTERVAL_MS = 5 * 60 * 1000;
  const STORAGE_KEY = "wcd_analytics";
  const SESSION_KEY = "wcd_session";

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  async function getOrCreateInstallId() {
    try {
      const result = await browser.storage.local.get("wcd_install_id");
      if (result.wcd_install_id) return result.wcd_install_id;
      const id = generateId();
      await browser.storage.local.set({ wcd_install_id: id });
      return id;
    } catch {
      return "unknown";
    }
  }

  function getSessionId() {
    if (!window[SESSION_KEY]) {
      window[SESSION_KEY] = generateId();
    }
    return window[SESSION_KEY];
  }

  async function getQueue() {
    try {
      const result = await browser.storage.local.get(STORAGE_KEY);
      return result[STORAGE_KEY] || [];
    } catch {
      return [];
    }
  }

  async function saveQueue(queue) {
    const trimmed = queue.slice(-500);
    try {
      await browser.storage.local.set({ [STORAGE_KEY]: trimmed });
    } catch { /* storage full — drop silently */ }
  }

  const analytics = {
    _installId: null,

    async init() {
      this._installId = await getOrCreateInstallId();
      this.track("session_start");
      this._startBeacon();
    },

    async track(event, properties) {
      const entry = {
        event: event,
        properties: properties || {},
        installId: this._installId,
        sessionId: getSessionId(),
        timestamp: new Date().toISOString(),
        version: browser.runtime.getManifest().version,
      };

      const queue = await getQueue();
      queue.push(entry);
      await saveQueue(queue);
    },

    _startBeacon() {
      setInterval(() => this._flush(), BEACON_INTERVAL_MS);
      window.addEventListener("beforeunload", () => this._flush());
    },

    async _flush() {
      if (!ANALYTICS_ENDPOINT) return;
      const queue = await getQueue();
      if (queue.length === 0) return;

      try {
        const resp = await fetch(ANALYTICS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ events: queue }),
        });
        if (resp.ok) {
          await saveQueue([]);
        }
      } catch { /* network error — keep events for next flush */ }
    },

    async getStats() {
      const queue = await getQueue();
      const counts = {};
      for (const entry of queue) {
        counts[entry.event] = (counts[entry.event] || 0) + 1;
      }
      return { totalEvents: queue.length, counts: counts, oldestEvent: queue[0]?.timestamp || null };
    },
  };

  window.wcdAnalytics = analytics;
})();
