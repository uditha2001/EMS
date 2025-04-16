import React from 'react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface DataCardProps {
  color: string;
  count: number | string;
  title: string;
  icon: React.ComponentType<any>;
  trend?: string;
}

const DataCard: React.FC<DataCardProps> = ({
  color,
  count,
  title,
  icon: Icon,
  trend,
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900',
          icon: 'text-blue-500 dark:text-blue-400',
          text: 'text-blue-800 dark:text-blue-200',
          border: 'border-blue-200 dark:border-blue-800',
          ring: 'ring-blue-50 dark:ring-blue-800',
          gradient: 'from-blue-50 to-white dark:from-blue-900 dark:to-gray-800',
        };
      case 'green':
        return {
          bg: 'bg-green-100 dark:bg-green-900',
          icon: 'text-green-500 dark:text-green-400',
          text: 'text-green-800 dark:text-green-200',
          border: 'border-green-200 dark:border-green-800',
          ring: 'ring-green-50 dark:ring-green-800',
          gradient:
            'from-green-50 to-white dark:from-green-900 dark:to-gray-800',
        };
      case 'amber':
      case 'yellow':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900',
          icon: 'text-amber-500 dark:text-amber-400',
          text: 'text-amber-800 dark:text-amber-200',
          border: 'border-amber-200 dark:border-amber-800',
          ring: 'ring-amber-50 dark:ring-amber-800',
          gradient:
            'from-amber-50 to-white dark:from-amber-900 dark:to-gray-800',
        };
      case 'purple':
      case 'pink':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900',
          icon: 'text-purple-500 dark:text-purple-400',
          text: 'text-purple-800 dark:text-purple-200',
          border: 'border-purple-200 dark:border-purple-800',
          ring: 'ring-purple-50 dark:ring-purple-800',
          gradient:
            'from-purple-50 to-white dark:from-purple-900 dark:to-gray-800',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          icon: 'text-gray-500 dark:text-gray-400',
          text: 'text-gray-800 dark:text-gray-200',
          border: 'border-gray-200 dark:border-gray-600',
          ring: 'ring-gray-50 dark:ring-gray-600',
          gradient: 'from-gray-50 to-white dark:from-gray-700 dark:to-gray-800',
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div
      className={`bg-white dark:bg-gray-800 border ${colorClasses.border} rounded shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full`}
    >
      <div className={`bg-gradient-to-br ${colorClasses.gradient} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-lg ${colorClasses.bg} ring-4 ${colorClasses.ring}`}
          >
            <Icon className={`h-6 w-6 ${colorClasses.icon}`} />
          </div>
          {trend && (
            <div className="flex items-center text-xs font-medium">
              <ArrowTrendingUpIcon className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                {trend}
              </span>
            </div>
          )}
        </div>
        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
          {typeof count === 'number' ? count.toLocaleString() : count}
        </h3>
        <p className={`text-sm ${colorClasses.text}`}>{title}</p>
      </div>
    </div>
  );
};

export default DataCard;
