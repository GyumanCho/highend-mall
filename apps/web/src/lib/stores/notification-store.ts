"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  readonly id: string;
  readonly type: "order" | "review" | "campaign" | "alert" | "system";
  readonly title: string;
  readonly message: string;
  readonly read: boolean;
  readonly createdAt: string;
  readonly href?: string;
}

interface NotificationState {
  readonly notifications: readonly Notification[];
  readonly addNotification: (notif: Omit<Notification, "id" | "read" | "createdAt">) => void;
  readonly markRead: (id: string) => void;
  readonly markAllRead: () => void;
  readonly unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "n1",
          type: "alert",
          title: "Churn Risk: Eunji Hwang (Platinum)",
          message: "Critical risk detected — 92 days since last purchase, $340K lifetime value at risk",
          read: false,
          createdAt: "2026-03-28T10:00:00Z",
          href: "/dashboard/customers",
        },
        {
          id: "n2",
          type: "review",
          title: "New Review Pending",
          message: "Jiwon P. left a 5-star review on Celine Triomphe — awaiting AI analysis",
          read: false,
          createdAt: "2026-03-28T09:30:00Z",
          href: "/dashboard/reviews",
        },
        {
          id: "n3",
          type: "campaign",
          title: "Retention Campaign Sent",
          message: "Win-back campaign sent to Hyunwoo Choi (Gold) — tracking engagement",
          read: true,
          createdAt: "2026-03-25T14:00:00Z",
          href: "/dashboard/campaigns",
        },
      ],

      addNotification: (notif) =>
        set((state) => ({
          notifications: [
            {
              ...notif,
              id: `n_${Date.now()}`,
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        })),

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: "maison-notifications" }
  )
);
