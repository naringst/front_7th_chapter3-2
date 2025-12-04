import { useCallback } from 'react';
import { notificationAtom } from '../atoms';
import { useAtom } from 'jotai';

export interface NotificationType {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export const useNotification = () => {
  const [notifications, setNotifications] = useAtom(notificationAtom);

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    [setNotifications],
  );

  const closeNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((noti) => noti.id !== id));
    },
    [setNotifications],
  );

  return { addNotification, notifications, closeNotification };
};
