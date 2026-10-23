// Real-time WebSocket Client with Auto-Reconnect & Event Bus

const WS_URL =
  import.meta.env.VITE_WS_URL ||
  (window.location.protocol === "https:" ? "wss://" : "ws://") +
    (window.location.hostname || "localhost") +
    ":5000/ws";

class WebSocketClient {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.globalListeners = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectDelay = 10000;
    this.isConnected = false;
    this.isExplicitlyClosed = false;
    this.reconnectTimer = null;
    this.connect();
  }

  connect() {
    if (this.isExplicitlyClosed) return;

    // Guard against duplicate active connections
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.log("⚡ [WebSocket] Connected to Dzire Real-time Hub");
        this.emitLocal("connection_status", { status: "connected" });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!data || !data.type) return;

          // Dispatch to specific event listeners
          const callbacks = this.listeners.get(data.type);
          if (callbacks) {
            callbacks.forEach((cb) => {
              try {
                cb(data.payload, data);
              } catch (err) {
                console.error(`[WebSocket] Listener error for ${data.type}:`, err);
              }
            });
          }

          // Dispatch to global listeners
          this.globalListeners.forEach((cb) => {
            try {
              cb(data);
            } catch (err) {
              console.error("[WebSocket] Global listener error:", err);
            }
          });
        } catch (e) {
          // Non-JSON message, ignore
        }
      };

      this.ws.onerror = () => {
        // Silently handle connection errors while server is restarting
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.emitLocal("connection_status", { status: "disconnected" });
        if (!this.isExplicitlyClosed) {
          const delay = Math.min(
            2000 * Math.pow(1.5, Math.min(this.reconnectAttempts, 5)),
            this.maxReconnectDelay
          );
          this.reconnectAttempts++;
          this.reconnectTimer = setTimeout(() => this.connect(), delay);
        }
      };
    } catch (e) {
      this.reconnectTimer = setTimeout(() => this.connect(), 3000);
    }
  }

  // Subscribe to a specific message type
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  // Alias for on
  subscribe(eventType, callback) {
    return this.on(eventType, callback);
  }

  // Subscribe to all messages
  onAny(callback) {
    this.globalListeners.add(callback);
    return () => {
      this.globalListeners.delete(callback);
    };
  }

  emitLocal(eventType, payload) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach((cb) => cb(payload));
    }
  }

  // Send a message to server
  send(type, payload = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  close() {
    this.isExplicitlyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Preserve singleton instance across Vite HMR hot reloads
const clientSingleton =
  typeof window !== "undefined" && window.__dzire_ws_client__
    ? window.__dzire_ws_client__
    : new WebSocketClient();

if (typeof window !== "undefined") {
  window.__dzire_ws_client__ = clientSingleton;
}

export const wsClient = clientSingleton;
export default wsClient;
