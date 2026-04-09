import { describe, it, expect, beforeEach } from "vitest";
import { useNotificationStore } from "@/lib/stores/notification-store";

describe("NotificationStore", () => {
  beforeEach(() => {
    useNotificationStore.setState({
      notifications: [
        { id: "n1", type: "alert", title: "Test", message: "msg", read: false, createdAt: "2026-03-29T00:00:00Z" },
        { id: "n2", type: "review", title: "Test2", message: "msg2", read: true, createdAt: "2026-03-28T00:00:00Z" },
      ],
    });
  });

  it("counts unread notifications", () => {
    expect(useNotificationStore.getState().unreadCount()).toBe(1);
  });

  it("marks single notification as read", () => {
    useNotificationStore.getState().markRead("n1");
    expect(useNotificationStore.getState().unreadCount()).toBe(0);
  });

  it("marks all as read", () => {
    useNotificationStore.getState().markAllRead();
    expect(useNotificationStore.getState().unreadCount()).toBe(0);
    expect(useNotificationStore.getState().notifications.every((n) => n.read)).toBe(true);
  });

  it("adds new notification", () => {
    useNotificationStore.getState().addNotification({
      type: "order",
      title: "New Order",
      message: "Order placed",
    });

    const notifs = useNotificationStore.getState().notifications;
    expect(notifs).toHaveLength(3);
    expect(notifs[0].title).toBe("New Order");
    expect(notifs[0].read).toBe(false);
  });
});
