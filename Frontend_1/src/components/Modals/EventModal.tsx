import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faTimes,
  faAlignLeft,
} from '@fortawesome/free-solid-svg-icons';

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  visibility: string;
  userId: string | null;
}

const EventPopup = ({
  event,
  onClose,
}: {
  event: Event | null;
  onClose: () => void;
}) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60 dark:bg-opacity-80">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-[90%] max-w-md p-6 rounded shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="text-2xl font-bold mb-3">{event.title}</h2>

        <div className="space-y-2 text-sm">
          <p>
            <FontAwesomeIcon icon={faAlignLeft} className="mr-2 text-primary" />
            {event.description}
          </p>

          <p>
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="mr-2 text-primary"
            />
            {new Date(event.startDate).toLocaleString()}
          </p>

          <p>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="mr-2 text-primary"
            />
            {event.location}
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
