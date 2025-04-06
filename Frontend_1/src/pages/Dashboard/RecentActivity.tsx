import { BellAlertIcon } from '@heroicons/react/24/outline';

export default function RecentActivity() {
  return (
    <div>
      <div className="col-span-1 bg-white dark:bg-gray-800 rounded shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Activity
          </h2>
          <BellAlertIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {[
            {
              action: 'New user registered',
              time: '5 minutes ago',
              icon: 'UsersIcon',
              color: 'bg-blue-100 text-blue-600',
            },
            {
              action: 'New examination created',
              time: '2 hours ago',
              icon: 'BookOpenIcon',
              color: 'bg-yellow-100 text-yellow-600',
            },
            {
              action: 'Paper submitted for review',
              time: '4 hours ago',
              icon: 'DocumentIcon',
              color: 'bg-green-100 text-green-600',
            },
            {
              action: 'System maintenance completed',
              time: 'Yesterday',
              icon: 'CogIcon',
              color: 'bg-purple-100 text-purple-600',
            },
          ].map((item, index) => (
            <div key={index} className="flex items-start">
              <div className={`${item.color} p-2 rounded-full mr-3`}>
                <div className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {item.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline w-full text-center">
          View all activity
        </button>
      </div>
    </div>
  );
}
