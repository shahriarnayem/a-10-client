"use client";
 
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notificationApi";
 
function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
 
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
 
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");
 
    try {
      const data = await getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);
 
  async function handleRead(notificationId) {
    setBusyId(notificationId);
 
    try {
      const data = await markNotificationRead(notificationId);
      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? data.notification
            : notification,
        ),
      );
      setUnreadCount((current) => Math.max(0, current - 1));
      toast.success(data.message);
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setBusyId("");
    }
  }
 
  async function handleReadAll() {
    setBusyId("all");
 
    try {
      const data = await markAllNotificationsRead();
      const readAt = new Date().toISOString();
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
          readAt: notification.readAt || readAt,
        })),
      );
      setUnreadCount(0);
      toast.success(data.message);
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setBusyId("");
    }
  }
 
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
        Account communication
      </p>
      <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Notifications
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Read marketplace moderation guidance and account warnings sent by
            administrators.
          </p>
        </div>
 
        <button
          type="button"
          onClick={handleReadAll}
          disabled={unreadCount === 0 || busyId === "all"}
          className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
        >
          {busyId === "all"
            ? "Updating…"
            : `Mark all read (${unreadCount})`}
        </button>
      </div>
 
      {loading && (
        <p className="mt-10 text-slate-300">Loading notifications…</p>
      )}
 
      {!loading && error && (
        <div className="mt-10 rounded-3xl border border-rose-400/20 bg-rose-400/5 p-8">
          <p className="text-slate-300">{error}</p>
          <button
            type="button"
            onClick={loadNotifications}
            className="mt-5 rounded-full bg-rose-300 px-5 py-2.5 font-semibold text-slate-950"
          >
            Reload notifications
          </button>
        </div>
      )}
 
      {!loading && !error && notifications.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-white/15 p-10 text-center text-slate-300">
          You do not have any marketplace notifications.
        </div>
      )}
 
      {!loading && !error && notifications.length > 0 && (
        <div className="mt-10 space-y-4">
          {notifications.map((notification) => (
            <article
              key={notification._id}
              className={`rounded-3xl border p-6 ${
                notification.read
                  ? "border-white/10 bg-slate-900/40"
                  : "border-amber-400/25 bg-amber-400/5"
              }`}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">
                      Marketplace warning
                    </h2>
                    {!notification.read && (
                      <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase text-slate-950">
                        Unread
                      </span>
                    )}
                  </div>
                  <p className="mt-3 leading-7 text-slate-300">
                    {notification.message}
                  </p>
                  <p className="mt-3 text-sm text-slate-500">
                    Sent {formatDate(notification.createdAt)}
                  </p>
                </div>
 
                {!notification.read && (
                  <button
                    type="button"
                    onClick={() => handleRead(notification._id)}
                    disabled={busyId === notification._id}
                    className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 disabled:opacity-50"
                  >
                    {busyId === notification._id ? "Updating…" : "Mark read"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
