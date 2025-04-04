import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import useEventApi from '../api/eventApi';
import { Loader } from 'lucide-react';
import useAuth from '../hooks/useAuth';

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

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getPublicEvents, getEventByUserId } = useEventApi();
  const { auth } = useAuth();

  // Fetch calendar events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [publicEvents, userEvents] = await Promise.all([
          getPublicEvents(),
          getEventByUserId(Number(auth.id)),
        ]);
        // Merge both event lists (adjust as needed)
        setEvents([...publicEvents.data, ...userEvents.data]);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get the number of days in the current month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get the first day of the month (0-6 where 0 is Sunday)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Check if a date has any events
  const hasEvents = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return events.some((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <td
          key={`empty-${i}`}
          className="h-20 border border-stroke p-2 dark:border-strokedark"
        ></td>,
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      days.push(
        <td
          key={`day-${day}`}
          className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4"
        >
          <span
            className={`font-medium ${
              hasEvents(day) ? 'text-primary' : 'text-black dark:text-white'
            }`}
          >
            {day}
          </span>
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className="group h-16 w-full flex-grow cursor-pointer py-1"
            >
              {/* <span className="group-hover:text-primary">More</span> */}
              <div className="event invisible absolute left-2 z-99 mb-1 flex w-[200%] flex-col rounded-sm border-l-[3px] border-primary bg-gray px-3 py-1 text-left opacity-0 group-hover:visible group-hover:opacity-100 dark:bg-meta-4 md:visible md:w-[190%] md:opacity-100">
                <span className="event-name text-sm font-semibold text-black dark:text-white">
                  {event.title}
                </span>
                <span className="time text-sm font-medium text-black dark:text-white">
                  {new Date(event.startDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="location text-sm text-black dark:text-white">
                  {event.location}
                </span>
              </div>
            </div>
          ))}
        </td>,
      );
    }

    // Split days into weeks (rows with 7 days each)
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(
        <tr key={`week-${i}`} className="grid grid-cols-7">
          {days.slice(i, i + 7)}
        </tr>,
      );
    }

    return weeks;
  };

  // Change month
  const changeMonth = (increment: number) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + increment,
        1,
      ),
    );
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Calendar" />
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between p-4">
          <button
            onClick={() => changeMonth(-1)}
            className="text-primary  hover:underline"
          >
            Previous
          </button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleDateString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="text-primary  hover:underline"
          >
            Next
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              {[
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ].map((day) => (
                <th
                  key={day}
                  className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5"
                >
                  <span className="hidden lg:block">{day}</span>
                  <span className="block lg:hidden">{day.substring(0, 3)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderCalendarDays()}</tbody>
        </table>
      </div>
    </>
  );
};

export default Calendar;
