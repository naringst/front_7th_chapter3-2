import { NotificationToast } from './components/NotificationToast';
import { useNotification } from './hooks/useNotification';

export const Notification = () => {
  const { notifications, closeNotification } = useNotification();
  return (
    <>
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <NotificationToast
              key={notif.id}
              notification={notif}
              closeNotification={closeNotification}
            />
          ))}
        </div>
      )}
    </>
  );
};
