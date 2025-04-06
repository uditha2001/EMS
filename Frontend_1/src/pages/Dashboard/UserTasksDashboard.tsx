import { useEffect, useState } from 'react';
import useApi from '../../api/api';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';

interface RoleAssignment {
  id: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  roleId: number;
  roleName: string;
  userId: number;
  user: string;
  examinationId: number;
  isAuthorized: boolean;
  paperType: string;
  grantAt: string;
  completed: boolean;
  completeDate: string | null;
}

const UserTasksDashboard = () => {
  const [assignments, setAssignments] = useState<RoleAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { getRoleAssignmentByUserId } = useApi();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const userId = auth.id;
        const response = await getRoleAssignmentByUserId(Number(userId));
        if (response && response.data) {
          setAssignments(response.data);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const getTaskStatus = (dueDate: string, isCompleted: boolean) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isCompleted) {
      return {
        status: 'Completed',
        color: 'bg-green-50',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: CheckCircleIcon,
        iconColor: 'text-green-500',
      };
    } else if (diffDays < 0) {
      return {
        status: 'Past Due',
        color: 'bg-gray-200',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-300',
        icon: ExclamationCircleIcon,
        iconColor: 'text-gray-500',
      };
    } else if (diffDays <= 3) {
      return {
        status: 'Due Soon',
        color: 'bg-red-50',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        icon: ExclamationCircleIcon,
        iconColor: 'text-red-500',
      };
    } else {
      return {
        status: 'Upcoming',
        color: 'bg-green-50',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: CheckCircleIcon,
        iconColor: 'text-green-500',
      };
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    return new Date(a.grantAt).getTime() - new Date(b.grantAt).getTime();
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {assignments.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded shadow p-6">
          <p className="text-gray-500 dark:text-gray-400">
            No tasks assigned to you at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between mb-4 px-1">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Tasks
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {assignments.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Due Soon
              </p>
              <p className="text-xl font-semibold text-red-600">
                {
                  assignments.filter((a) => {
                    const due = new Date(a.grantAt);
                    const today = new Date();
                    const diffDays = Math.ceil(
                      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
                    );
                    return diffDays >= 0 && diffDays <= 3;
                  }).length
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Overdue
              </p>
              <p className="text-xl font-semibold text-gray-600">
                {
                  assignments.filter((a) => {
                    const due = new Date(a.grantAt);
                    const today = new Date();
                    return due < today;
                  }).length
                }
              </p>
            </div>
          </div>

          {sortedAssignments.map((assignment) => {
            const {
              status,
              color,
              textColor,
              borderColor,
              icon: StatusIcon,
              iconColor,
            } = getTaskStatus(
              assignment.grantAt,
              assignment.roleName === 'PAPER_CREATOR' && assignment.completed,
            );

            return (
              <div
                key={assignment.id}
                className={`bg-white dark:bg-gray-800 rounded-sm shadow-sm border-l-4 ${borderColor} overflow-hidden hover:shadow-md transition-shadow`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <StatusIcon className={`h-5 w-5 ${iconColor} mr-2`} />
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${color} ${textColor}`}
                      >
                        {status}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {assignment.paperType}
                    </span>
                  </div>

                  <h3 className="font-medium text-gray-800 dark:text-white mb-1">
                    {assignment.roleName.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {assignment.courseCode}: {assignment.courseName}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {formatDate(assignment.grantAt)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                      <span className={textColor}>
                        {getDaysRemaining(assignment.grantAt)}
                      </span>
                    </div>
                  </div>

                  {/* Display additional status messages */}
                  {(assignment.roleName === 'PAPER_CREATOR' ||
                    assignment.roleName === 'FIRST_MAKER') &&
                  assignment.completed &&
                  assignment.completeDate ? (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      Completed on {formatDate(assignment.completeDate)}
                    </p>
                  ) : null}

                  {assignment.roleName === 'PAPER_CREATOR' &&
                    !assignment.completed && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                        You have to submit a paper.Please submit it before the
                        due date.
                      </p>
                    )}

                  {assignment.roleName === 'FIRST_MAKER' &&
                    !assignment.completed && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                        You have to marking the paper. Please complete it before
                        the due date.
                      </p>
                    )}

                  {assignment.roleName === 'PAPER_MODERATOR' &&
                    assignment.completed && (
                      <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                        Paper creator has submitted the paper. You can start
                        moderation now.
                      </p>
                    )}

                  {assignment.roleName === 'SECOND_MAKER' &&
                    assignment.completed && (
                      <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                        First maker has completed the marking. You can start
                        second marking now.
                      </p>
                    )}
                </div>
              </div>
            );
          })}

          <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-md text-sm transition-colors dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-200">
            View All Tasks
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTasksDashboard;
