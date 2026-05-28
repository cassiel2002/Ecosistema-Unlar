import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Notification } from '@/shared/types';

// UI Slice
interface UISlice {
  sidebarOpen: boolean;
  activeModule: string;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveModule: (module: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Notifications Slice
interface NotificationsSlice {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setNotifications: (notifications: Notification[]) => void;
}

interface AppStore extends UISlice, NotificationsSlice {}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        // UI
        sidebarOpen: false,
        activeModule: 'feed',
        theme: 'dark',
        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setActiveModule: (module) => set({ activeModule: module }),
        setTheme: (theme) => set({ theme }),

        // Notifications
        notifications: [],
        unreadCount: 0,
        addNotification: (n) =>
          set((s) => ({
            notifications: [n, ...s.notifications],
            unreadCount: s.unreadCount + 1,
          })),
        markAsRead: (id) =>
          set((s) => ({
            notifications: s.notifications.map((n) =>
              n.id === id ? { ...n, is_read: true } : n
            ),
            unreadCount: Math.max(0, s.unreadCount - 1),
          })),
        markAllAsRead: () =>
          set((s) => ({
            notifications: s.notifications.map((n) => ({ ...n, is_read: true })),
            unreadCount: 0,
          })),
        setNotifications: (notifications) =>
          set({
            notifications,
            unreadCount: notifications.filter((n) => !n.is_read).length,
          }),
      }),
      {
        name: 'edu-store',
        partialize: (state) => ({ theme: state.theme }),
      }
    )
  )
);
