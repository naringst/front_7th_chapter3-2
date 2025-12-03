import { Notification } from '.';
import { NotificationType } from '../../shared/hooks/useNotification';

export const NotificationSection = ({
  notifications,
  closeNotification,
}: {
  notifications: NotificationType[];
  closeNotification: (id: string) => void;
}) => {
  return (
    <>
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <Notification
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
