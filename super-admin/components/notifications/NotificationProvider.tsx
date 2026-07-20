"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useSocket } from "@/lib/hooks/useSocket";
import { getUnreadCount, type StaffNotification } from "@/lib/services/api";
import toast from "react-hot-toast";

interface NotificationContextValue {
  unreadCount: number;
  latestNotification: StaffNotification | null;
  refreshCount: () => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  unreadCount: 0,
  latestNotification: null,
  refreshCount: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState<StaffNotification | null>(null);
  const lastToastRef = useRef<string | null>(null);

  // Read token from sessionStorage
  useEffect(() => {
    function readToken() {
      try {
        const raw = sessionStorage.getItem(
          process.env.NEXT_PUBLIC_AUTH_STORAGE_KEY || "mgh_admin_user"
        );
        if (raw) {
          const user = JSON.parse(raw);
          if (user.token) {
            setToken(user.token);
            return;
          }
        }
      } catch {}
      setToken(null);
    }
    readToken();
    window.addEventListener("storage", readToken);
    return () => window.removeEventListener("storage", readToken);
  }, []);

  const socket = useSocket(token);

  // Fetch unread count on mount and on focus
  const refreshCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data.count);
    } catch {}
  }, [token]);

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, 60000);
    window.addEventListener("focus", refreshCount);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", refreshCount);
    };
  }, [refreshCount]);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: StaffNotification) => {
      setLatestNotification(notification);
      if (!notification.isRead) {
        setUnreadCount((c) => c + 1);
      }
      // Show toast for high priority notifications
      if (notification.priority === "high" || notification.priority === "urgent") {
        const toastId = `notif-${notification._id}`;
        if (lastToastRef.current !== toastId) {
          lastToastRef.current = toastId;
          toast(notification.title, {
            icon: "🔔",
            duration: 5000,
          });
        }
      }
    };

    const handleUnreadCount = (count: number) => {
      setUnreadCount(count);
    };

    socket.on("notification", handleNotification);
    socket.on("unread-count", handleUnreadCount);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("unread-count", handleUnreadCount);
    };
  }, [socket]);

  return (
    <NotificationContext.Provider value={{ unreadCount, latestNotification, refreshCount }}>
      {children}
    </NotificationContext.Provider>
  );
}
