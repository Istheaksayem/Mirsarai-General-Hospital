"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { env } from "@/config/env";

function getSocketBaseUrl(): string {
  const url = env.apiUrl || env.backendUrl || "http://localhost:5000";
  return url.replace(/\/api\/v1\/?$/, "");
}

let globalSocket: Socket | null = null;

export function useSocket(token: string | null) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        globalSocket = null;
      }
      return;
    }

    if (globalSocket?.connected) {
      socketRef.current = globalSocket;
      return;
    }

    const s = io(getSocketBaseUrl(), {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    });

    s.on("connect", () => {});
    s.on("connect_error", () => {});

    globalSocket = s;
    socketRef.current = s;

    return () => {
      // Don't disconnect on unmount — keep global connection
    };
  }, [token]);

  return socketRef.current;
}

export function getSocket(): Socket | null {
  return globalSocket;
}
