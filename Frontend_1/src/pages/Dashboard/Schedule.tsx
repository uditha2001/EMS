import { Link } from 'react-router-dom';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

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

interface ScheduleProps {
  events: Event[];
}

const colorClasses = [
  'border-l-blue-500',
  'border-l-green-500',
  'border-l-red-500',
  'border-l-yellow-500',
  'border-l-purple-500',
  'border-l-pink-500',
  'border-l-indigo-500',
  'border-l-teal-500',
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

const getColorByKey = (key: string) => {
  const index = key
    .split('')
    .reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0);
  return colorClasses[index % colorClasses.length];
};

const isToday = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const Schedule: React.FC<ScheduleProps> = ({ events }) => {
  const todayEvents = events.filter(event => isToday(event.startDate));
  const upcomingEvents = events
    .filter(event => !isToday(event.startDate))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Upcoming Schedule
          </h2>
          <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayEvents.map((event, index) => (
            <div
              key={`today-${index}`}
              className={`border-l-4 border-l-orange-500 pl-4 py-2 bg-orange-50 dark:bg-orange-900/20`}
            >
              <h3 className="font-medium text-gray-800 dark:text-white">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {event.description}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(event.startDate)}
              </p>
            </div>
          ))}

          {upcomingEvents.map((event, index) => {
            const randomColor = getColorByKey(event.title);
            return (
              <div
                key={`upcoming-${index}`}
                className={`border-l-4 ${randomColor} pl-4 py-2`}
              >
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatDate(event.startDate)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <Link
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            to="/calendar"
          >
            View full calendar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
