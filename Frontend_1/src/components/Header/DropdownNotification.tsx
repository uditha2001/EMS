import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import useAuth from '../../hooks/useAuth';

interface Notification {
  message: string;
  date: string;
}

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { auth } = useAuth();
  const stompClient = useRef<any>(null);

  useEffect(() => {
    if (stompClient.current && stompClient.current.connected) return;


    const socket = new SockJS('http://localhost:8080/ws');
    stompClient.current = Stomp.over(socket);

    // Optional: silence debug logs
    stompClient.current.debug = () => {};

    // Connect with Authorization header
    stompClient.current.connect(
      {
        Authorization: `Bearer ${auth.accessToken}`
      },
      onConnect,
      onError
    );

    return () => {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect(() => {
          console.log('Disconnected from WebSocket');
        });
      }
    };
  }, [auth.accessToken]);

  const onConnect = () => {
    console.log('Connected to WebSocket');

    // Personal notifications
    stompClient.current.subscribe('/user/topic', (message: any) => {
      handleNewNotification(JSON.parse(message.body));
    });

    // Broadcast notifications
    stompClient.current.subscribe('/topic/messages', (message: any) => {
      handleNewNotification({
        message: message.body,
        date: new Date().toISOString(),
      });
    });
  };

  const onError = (error: any) => {
    console.error('STOMP connection error:', error);

    // Retry connection
    setTimeout(() => {
      console.log('Retrying WebSocket connection...');
      stompClient.current.connect(
        { Authorization: `Bearer ${auth.accessToken}` },
        onConnect,
        onError
      );
    }, 5000);
  };

  const handleNewNotification = (data: Notification) => {
    setNotifications((prev) => [
      { message: data.message, date: data.date || new Date().toISOString() },
      ...prev,
    ]);
    setNotifying(true);
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          to="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          {notifying && (
            <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 animate-ping"></span>
          )}

          <svg
            className="fill-current duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
              fill=""
            />
          </svg>
        </Link>

        {dropdownOpen && (
          <div className="absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80">
            <div className="px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">Notification</h5>
            </div>

            <ul className="flex h-auto flex-col overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 px-4.5 py-3">No notifications yet.</p>
              ) : (
                notifications.map((item, index) => (
                  <li key={index}>
                    <div className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                      <p className="text-sm text-black dark:text-white">
                        {item.message}
                      </p>
                      <p className="text-xs">{new Date(item.date).toLocaleString()}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
