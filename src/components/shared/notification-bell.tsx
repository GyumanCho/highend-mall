"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useNotificationStore } from "@/lib/stores/notification-store";

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const count = mounted ? unreadCount() : 0;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative text-secondary hover:text-primary transition-colors"
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-50 w-80 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <p className="text-sm font-medium">Notifications</p>
              {count > 0 && (
                <button
                  onClick={() => markAllRead()}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.slice(0, 10).map((notif) => (
                <Link
                  key={notif.id}
                  href={notif.href ?? "#"}
                  onClick={() => { markRead(notif.id); setOpen(false); }}
                  className={`block px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${
                    !notif.read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!notif.read && (
                      <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                    )}
                    <div className={!notif.read ? "" : "ml-4"}>
                      <p className="text-sm font-medium leading-snug">{notif.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{notif.message}</p>
                    </div>
                  </div>
                </Link>
              ))}
              {notifications.length === 0 && (
                <p className="p-6 text-center text-sm text-neutral-400">No notifications</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
