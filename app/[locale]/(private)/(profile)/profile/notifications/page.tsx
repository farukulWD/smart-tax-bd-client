"use client";

import { useState } from "react";
import { Bell, CheckCheck, Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from "@/redux/api/notifications/notificationApi";
import { toast } from "sonner";

const NotificationsPage = () => {
  const t = useTranslations("notifications");
  const [isReadFilter, setIsReadFilter] = useState<boolean | undefined>(undefined);

  const { data, isLoading } = useGetMyNotificationsQuery({
    page: 1,
    limit: 50,
    isRead: isReadFilter,
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = data?.data ?? [];

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success(t("markAllRead"));
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {[
            { label: t("all"), value: undefined },
            { label: t("unread"), value: false },
            { label: t("read"), value: true },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => setIsReadFilter(opt.value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
                isReadFilter === opt.value
                  ? "bg-red-600 text-white border-red-600"
                  : "border-slate-200 text-slate-700 hover:border-red-500 hover:text-red-700",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleMarkAll}
          className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          <CheckCheck className="h-4 w-4" />
          {t("markAllRead")}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 text-muted-foreground">
          <Bell className="h-14 w-14" />
          <p className="text-base">{t("noNotifications")}</p>
        </div>
      ) : (
        <div className="rounded-lg border divide-y bg-white">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={cn(
                "flex items-start gap-4 px-5 py-4",
                !n.isRead && "bg-green-50",
              )}
            >
              <span
                className={cn(
                  "mt-2 h-2 w-2 shrink-0 rounded-full",
                  !n.isRead ? "bg-green-500" : "bg-transparent",
                )}
              />

              <div className="min-w-0 flex-1">
                <p className={cn("text-sm leading-snug", !n.isRead && "font-semibold")}>
                  {n.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!n.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(n._id)}
                    title={t("read")}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(n._id)}
                  title={t("deleteConfirm")}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
