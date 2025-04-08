import React, { useState, useEffect } from 'react';
import useApi from '../../api/api';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faClock,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import Loader from '../../common/Loader';

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
  completeDate: string | null;
  completed: boolean;
}

interface PaperData {
  examinationId: number;
  courseCode: string;
  courseName: string;
  paperType: string;
  paperSetting?: RoleAssignment;
  paperModeration?: RoleAssignment;
  firstMarking?: RoleAssignment;
  secondMarking?: RoleAssignment;
}

interface ChartData {
  name: string;
  completed: number;
  pending: number;
}

interface Examination {
  id: number;
  year: string;
  level: number;
  semester: number;
  degreeProgramName: string;
}

const PaperTracking: React.FC = () => {
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const [allRoleAssignments, setAllRoleAssignments] = useState<
    RoleAssignment[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCourse, setFilterCourse] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterExamination, setFilterExamination] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const { getRoleAssignments, getExaminationById } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch role assignments
        const assignmentsResponse = await getRoleAssignments();
        if (assignmentsResponse.code === 200) {
          setRoleAssignments(assignmentsResponse.data);
          setAllRoleAssignments(assignmentsResponse.data);

          // Extract unique examination IDs
          const examIds = [
            ...new Set(
              (assignmentsResponse.data as RoleAssignment[]).map(
                (item: RoleAssignment) => item.examinationId,
              ),
            ),
          ];

          // Fetch examination details for each unique ID
          const examPromises = examIds.map((id) => getExaminationById(id));
          const examResults = await Promise.all(examPromises);

          setExaminations(examResults);
          console.log('Examinations:', examResults);
        } else {
          setError(`Error: ${assignmentsResponse.message}`);
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupByPaper = (assignments: RoleAssignment[]): PaperData[] => {
    const paperMap = new Map<string, PaperData>();

    assignments.forEach((assignment) => {
      const paperKey = `${assignment.courseCode}_${assignment.paperType}_${assignment.examinationId}`;

      if (!paperMap.has(paperKey)) {
        paperMap.set(paperKey, {
          examinationId: assignment.examinationId,
          courseCode: assignment.courseCode,
          courseName: assignment.courseName,
          paperType: assignment.paperType,
        });
      }

      const paperData = paperMap.get(paperKey);

      if (paperData) {
        switch (assignment.roleName) {
          case 'PAPER_CREATOR':
            paperData.paperSetting = assignment;
            break;
          case 'PAPER_MODERATOR':
            paperData.paperModeration = assignment;
            break;
          case 'FIRST_MARKER':
            paperData.firstMarking = assignment;
            break;
          case 'SECOND_MARKER':
            paperData.secondMarking = assignment;
            break;
        }
      }
    });

    return Array.from(paperMap.values());
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const StatusCell = ({ assignment }: { assignment?: RoleAssignment }) => {
    if (!assignment) {
      return (
        <div className="text-gray-400 dark:text-gray-500">Not Assigned</div>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={assignment.completed ? faCheckCircle : faClock}
            className={
              assignment.completed
                ? 'text-green-500 dark:text-green-400 mr-2'
                : 'text-primary dark:text-blue-600 mr-2'
            }
          />
          <span
            className={
              assignment.completed
                ? 'text-green-600 dark:text-green-400 font-semibold'
                : 'text-primary dark:text-blue-600 font-semibold'
            }
          >
            {/* {assignment.completed ? 'Completed' : 'Pending'} */}
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {assignment.user}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div>
            <strong>Due:</strong> {formatDate(assignment.grantAt)}
          </div>
          {assignment.completed && (
            <div>
              <strong>Completed:</strong> {formatDate(assignment.completeDate)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const uniqueCourses = [
    ...new Set(allRoleAssignments.map((item) => item.courseCode)),
  ];

  useEffect(() => {
    const filtered = allRoleAssignments.filter((item) => {
      const matchesCourse =
        filterCourse === '' || item.courseCode === filterCourse;
      const matchesStatus =
        filterStatus === '' ||
        (filterStatus === 'completed' && item.completed) ||
        (filterStatus === 'pending' && !item.completed);
      const matchesExamination =
        filterExamination === '' ||
        item.examinationId.toString() === filterExamination;
      const matchesSearch =
        searchQuery === '' ||
        item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.user.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        matchesCourse && matchesStatus && matchesExamination && matchesSearch
      );
    });

    setRoleAssignments(filtered);
  }, [
    filterCourse,
    filterStatus,
    filterExamination,
    searchQuery,
    allRoleAssignments,
  ]);

  const groupedData = groupByPaper(roleAssignments);

  const prepareChartData = (): ChartData[] => {
    const stageLabels = [
      'Paper Setting',
      'Paper Moderation',
      'First Marking',
      'Second Marking',
    ];
    const chartData: ChartData[] = [];

    stageLabels.forEach((stage) => {
      let completed = 0;
      let pending = 0;

      groupedData.forEach((paper) => {
        let assignment: RoleAssignment | undefined;

        switch (stage) {
          case 'Paper Setting':
            assignment = paper.paperSetting;
            break;
          case 'Paper Moderation':
            assignment = paper.paperModeration;
            break;
          case 'First Marking':
            assignment = paper.firstMarking;
            break;
          case 'Second Marking':
            assignment = paper.secondMarking;
            break;
        }

        if (assignment) {
          if (assignment.completed) {
            completed++;
          } else {
            pending++;
          }
        }
      });

      chartData.push({
        name: stage,
        completed,
        pending,
      });
    });

    return chartData;
  };

  const chartData = prepareChartData();

  if (loading)
    return (
      <div className="text-center p-8 dark:text-gray-300">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="text-center p-8 text-red-500 dark:text-red-400">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto p-4  min-h-screen">
      <Breadcrumb pageName="Paper Tracking Dashboard" />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Examination
          </label>
          <select
            className="input-field cursor-pointer "
            value={filterExamination}
            onChange={(e) => setFilterExamination(e.target.value)}
          >
            <option value="">All Examinations</option>
            {examinations.map((exam) => (
              <option key={exam.id} value={exam.id.toString()}>
                {exam.degreeProgramName} - Level {exam.level} - Semester{' '}
                {exam.semester} - {exam.year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Course
          </label>
          <select
            className="input-field w-48 cursor-pointer"
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {uniqueCourses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            className="input-field w-48 cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              className="input-field w-64"
              placeholder="Search courses, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-sm shadow mb-6">
        <h2 className="font-medium text-black dark:text-white ">
          <FontAwesomeIcon
            icon={faChartBar}
            className="mr-2 text-primary dark:text-blue-600"
          />
          Paper Status Overview
        </h2>
        <div className="h-40">
          <div className="flex h-full">
            {chartData.map((data, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-end h-full flex-1"
              >
                <div className="text-xs text-center mb-1 dark:text-gray-300">
                  {data.name}
                </div>
                <div className="w-full flex flex-col items-center">
                  <div
                    className="bg-green-500 dark:bg-green-600 w-16"
                    style={{ height: `${data.completed * 10}px` }}
                    title={`Completed: ${data.completed}`}
                  ></div>
                  <div
                    className="bg-primary dark:bg-blue-600 w-16 mt-1"
                    style={{ height: `${data.pending * 10}px` }}
                    title={`Pending: ${data.pending}`}
                  ></div>
                </div>
                <div className="flex text-xs mt-2 dark:text-gray-300">
                  <div className="mr-2">
                    <span className="inline-block w-3 h-3 bg-green-500 dark:bg-green-600 mr-1"></span>
                    {data.completed}
                  </div>
                  <div>
                    <span className="inline-block w-3 h-3 bg-primary dark:bg-blue-600 mr-1"></span>
                    {data.pending}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-sm ">
        <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="bg-gray-100 dark:bg-form-input">
              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                Paper
              </th>
              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                Paper Setting
              </th>
              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                Paper Moderation
              </th>
              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                First Marking
              </th>
              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                Second Marking
              </th>
            </tr>
          </thead>
          <tbody>
            {groupedData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No data found matching the selected filters.
                </td>
              </tr>
            ) : (
              groupedData.map((paper) => {
                return (
                  <tr
                    key={`${paper.examinationId}_${paper.courseCode}_${paper.paperType}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {paper.courseCode}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {paper.courseName}
                      </div>
                      <div className="text-xs font-medium mt-1 inline-block px-2 py-1 bg-gray-100 dark:bg-gray-600 dark:text-gray-200 rounded">
                        {paper.paperType}
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      <StatusCell assignment={paper.paperSetting} />
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      <StatusCell assignment={paper.paperModeration} />
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      <StatusCell assignment={paper.firstMarking} />
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      <StatusCell assignment={paper.secondMarking} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaperTracking;
