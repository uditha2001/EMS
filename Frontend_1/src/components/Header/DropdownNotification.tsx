import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { Bell, CheckCircle } from 'lucide-react'; // Added CheckCircle for the "Marked as Read" icon
import useNotificationApi from '../../api/NotificationApi';

interface Notification {
  id: number;
  content: string;
  createdAt: string;
  notificationsLabels: string;
  read: boolean;
}

const DropdownNotification = () => {
  const { getNotifications, markAsRead } = useNotificationApi();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const hasUnread = notifications.some((notification) => !notification.read);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response.data.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        to="#"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
      >
        <Bell className="h-5 w-5" />
        {hasUnread && (
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-boxdark"></span>
        )}
      </Link>

      {dropdownOpen && (
        <div className="absolute -right-27 mt-2.5 w-80 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="px-4.5 py-3">
            <h5 className="text-sm font-medium text-bodydark2">Notifications</h5>
          </div>
          <ul className="max-h-90 overflow-y-auto">
            {notifications.length === 0 ? (
              <li key="no-notification">
                <p className="text-sm text-gray-500 px-4.5 py-3">No notifications yet.</p>
              </li>
            ) : (
              notifications.map((item) => (
                <li key={`${item.id}-${item.createdAt}`}>
                  <div
                    className="relative flex items-start justify-between gap-2 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 cursor-pointer"
                    onClick={() => {
                      // Optional: handle navigation
                    }}
                  >
                    <div>
                      <p
                        className={`text-sm ${
                          item.notificationsLabels === 'ASSIGNED' ? 'text-green-600' : 'text-blue-500'
                        }`}
                      >
                        {item.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!item.read ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={() => handleMarkAsRead(item.id)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">
                          Mark as Read
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">Marked as Read</span>
                      </div>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownNotification;
