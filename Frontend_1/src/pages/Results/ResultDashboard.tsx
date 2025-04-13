import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

// Define the type for grade distribution with an index signature
type GradeDistribution = {
  subject: string;
  year: number;
  [key: string]: string | number; // Index signature allows any string key
};

// Dataset of student marks for each subject and year
const studentMarks = [
  {
    subject: 'Dummy Subject',
    year: 2020,
    marks: [20, 32, 34, 35, 42, 65, 95, 65, 55, 60],
  },
  {
    subject: 'Dummy Subject',
    year: 2021,
    marks: [60, 65, 70, 75, 80, 85, 90, 95, 50, 55],
  },
  {
    subject: 'Dummy Subject',
    year: 2022,
    marks: [100, 75, 80, 85, 90, 95, 100, 100, 95, 75],
  },
  {
    subject: 'CSC1134',
    year: 2021,
    marks: [80, 85, 90, 95, 100, 75, 70, 65, 60, 55],
  },
  {
    subject: 'CSC1134',
    year: 2022,
    marks: [85, 90, 95, 100, 80, 75, 70, 65, 60, 55],
  },
  {
    subject: 'MAT3138',
    year: 2023,
    marks: [70, 75, 80, 85, 90, 95, 100, 65, 60, 55],
  },
  {
    subject: 'MAT3138',
    year: 2024,
    marks: [75, 80, 85, 90, 95, 100, 70, 65, 60, 55],
  },
];

const resultData = [
  { subject: 'Dummy Subject', year: 2020, pass: 60, fail: 40 },
  { subject: 'Dummy Subject', year: 2021, pass: 50, fail: 50 },
  { subject: 'Dummy Subject', year: 2022, pass: 55, fail: 45 },
  { subject: 'Dummy Subject', year: 2023, pass: 65, fail: 35 },
  { subject: 'Dummy Subject', year: 2024, pass: 70, fail: 30 },
  { subject: 'CSC1134', year: 2021, pass: 80, fail: 20 },
  { subject: 'CSC1134', year: 2022, pass: 85, fail: 15 },
  { subject: 'MAT3138', year: 2023, pass: 70, fail: 30 },
  { subject: 'MAT3138', year: 2024, pass: 75, fail: 25 },
];

const gradeDistribution: GradeDistribution[] = [
  {
    subject: 'Dummy Subject',
    year: 2020,
    'A+': 5,
    A: 10,
    'A-': 15,
    'B+': 10,
    B: 10,
    'B-': 5,
    'C+': 5,
    C: 5,
    'C-': 3,
    'D+': 2,
    D: 2,
    E: 2,
    'E*': 1,
  },
  {
    subject: 'Dummy Subject',
    year: 2021,
    'A+': 5,
    A: 10,
    'A-': 15,
    'B+': 10,
    B: 10,
    'B-': 5,
    'C+': 5,
    C: 5,
    'C-': 3,
    'D+': 2,
    D: 2,
    E: 2,
    'E*': 1,
  },
  {
    subject: 'Dummy Subject',
    year: 2022,
    'A+': 6,
    A: 12,
    'A-': 14,
    'B+': 12,
    B: 10,
    'B-': 5,
    'C+': 6,
    C: 4,
    'C-': 3,
    'D+': 1,
    D: 1,
    E: 1,
    'E*': 1,
  },
  {
    subject: 'Dummy Subject',
    year: 2023,
    'A+': 7,
    A: 13,
    'A-': 13,
    'B+': 13,
    B: 10,
    'B-': 5,
    'C+': 7,
    C: 5,
    'C-': 3,
    'D+': 3,
    D: 2,
    E: 2,
    'E*': 1,
  },
  {
    subject: 'Dummy Subject',
    year: 2024,
    'A+': 8,
    A: 14,
    'A-': 12,
    'B+': 14,
    B: 10,
    'B-': 5,
    'C+': 8,
    C: 4,
    'C-': 3,
    'D+': 2,
    D: 2,
    E: 1,
    'E*': 1,
  },
  {
    subject: 'CSC1134',
    year: 2021,
    'A+': 10,
    A: 30,
    'A-': 20,
    'B+': 10,
    B: 10,
    'B-': 5,
    'C+': 5,
    C: 5,
    'C-': 3,
    'D+': 2,
    D: 2,
    E: 2,
    'E*': 1,
  },
  {
    subject: 'CSC1134',
    year: 2022,
    'A+': 12,
    A: 28,
    'A-': 18,
    'B+': 12,
    B: 10,
    'B-': 5,
    'C+': 6,
    C: 4,
    'C-': 3,
    'D+': 1,
    D: 1,
    E: 1,
    'E*': 1,
  },
  {
    subject: 'MAT3138',
    year: 2023,
    'A+': 15,
    A: 25,
    'A-': 20,
    'B+': 15,
    B: 10,
    'B-': 5,
    'C+': 7,
    C: 5,
    'C-': 3,
    'D+': 3,
    D: 2,
    E: 2,
    'E*': 1,
  },
  {
    subject: 'MAT3138',
    year: 2024,
    'A+': 18,
    A: 22,
    'A-': 15,
    'B+': 15,
    B: 10,
    'B-': 5,
    'C+': 8,
    C: 4,
    'C-': 3,
    'D+': 2,
    D: 2,
    E: 1,
    'E*': 1,
  },
];

const gradeOrder = [
  'A+',
  'A',
  'A-',
  'B+',
  'B',
  'B-',
  'C+',
  'C',
  'C-',
  'D+',
  'D',
  'E',
  'E*',
];

const ResultDashboard: React.FC = () => {
  const [searchSubject, setSearchSubject] = useState('Dummy Subject');
  const [searchSubjectGrades, setSearchSubjectGrades] =
    useState('Dummy Subject');
  const [searchYear, setSearchYear] = useState('2020');
  const [darkMode] = useState(false); // State for dark mode

  // Get unique subjects and years for dropdowns
  const subjects = [...new Set(resultData.map((item) => item.subject))];
  const years = [...new Set(resultData.map((item) => item.year.toString()))];

  const filteredResults = resultData.filter((item) =>
    item.subject.toLowerCase().includes(searchSubject.toLowerCase()),
  );

  const filteredGrades = gradeDistribution.filter(
    (item) =>
      item.subject.toLowerCase().includes(searchSubjectGrades.toLowerCase()) &&
      (searchYear ? item.year.toString() === searchYear : true),
  );

  // Function to aggregate grade counts
  const aggregateGrades = (grades: GradeDistribution[]) => {
    const aggregated: { [key: string]: number } = {};

    grades.forEach((gradeData) => {
      gradeOrder.forEach((grade) => {
        if (gradeData[grade] !== undefined) {
          aggregated[grade] =
            (aggregated[grade] || 0) + Number(gradeData[grade]);
        }
      });
    });

    return aggregated;
  };

  const aggregatedGrades = aggregateGrades(filteredGrades);

  // Calculate mean and standard deviation from student marks
  const calculateMeanAndStdDev = (marks: number[]) => {
    const mean = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
    const variance =
      marks.reduce((sum, mark) => sum + Math.pow(mark - mean, 2), 0) /
      marks.length;
    const stdDev = Math.sqrt(variance);
    return { mean, stdDev };
  };

  // Get student marks for the selected subject and year
  const selectedMarks =
    studentMarks.find(
      (item) =>
        item.subject === searchSubjectGrades &&
        item.year.toString() === searchYear,
    )?.marks || [];

  const { mean, stdDev } = calculateMeanAndStdDev(selectedMarks);

  // Generate normal distribution data and map x values to student marks
  const generateNormalDistributionData = (
    mean: number,
    stdDev: number,
    marks: number[],
  ) => {
    const data: { x: number; y: number }[] = [];

    // Define the range for x_values (min(marks) - 10 to max(marks) + 10)
    const minX = Math.min(...marks) - 10; // Start 10 units below the minimum mark
    const maxX = Math.max(...marks) + 10; // End 10 units above the maximum mark
    const numPoints = 1000; // Number of points to generate

    // Generate x_values and calculate y_values (PDF)
    for (let i = 0; i < numPoints; i++) {
      const x = minX + (i * (maxX - minX)) / (numPoints - 1); // Evenly spaced x values
      const y =
        (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)); // PDF
      data.push({ x, y });
    }

    return data;
  };

  const normalDistributionData = generateNormalDistributionData(
    mean,
    stdDev,
    selectedMarks,
  );
  const cleanedData = normalDistributionData.filter(
    (d) => d.x !== undefined && !isNaN(d.y),
  );

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen p-4 bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Academic Analytics Dashboard</h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white rounded-xl shadow-sm dark:bg-gray-800">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Subject (Results)</label>
            <select
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Subject (Grades)</label>
            <select
              value={searchSubjectGrades}
              onChange={(e) => setSearchSubjectGrades(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Year</label>
            <select
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pass/Fail Charts */}
          <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Pass/Fail Rate Over Years</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredResults}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
                  <XAxis
                    dataKey="year"
                    className="dark:text-white"
                    tick={{ fill: darkMode ? '#CBD5E0' : '#4A5568' }}
                  />
                  <YAxis className="dark:text-white" />
                  <Tooltip
                    contentStyle={{
                      background: darkMode ? '#1F2937' : '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar
                    dataKey="pass"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    name="Pass Rate (%)"
                  />
                  <Bar
                    dataKey="fail"
                    fill="#EF4444"
                    radius={[4, 4, 0, 0]}
                    name="Fail Rate (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart Container */}
          <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Pass/Fail Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredResults}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
                  <XAxis
                    dataKey="year"
                    className="dark:text-white"
                    tick={{ fill: darkMode ? '#CBD5E0' : '#4A5568' }}
                  />
                  <YAxis className="dark:text-white" />
                  <Tooltip
                    contentStyle={{
                      background: darkMode ? '#1F2937' : '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pass"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 4 }}
                    name="Pass Rate (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="fail"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', r: 4 }}
                    name="Fail Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Grade Distribution Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Grade Distribution</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    {gradeOrder.map((grade) => (
                      <th
                        key={grade}
                        className="px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-center"
                      >
                        {grade}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {gradeOrder.map((grade) => (
                      <td
                        key={grade}
                        className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {aggregatedGrades[grade] || 0}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Normal Distribution Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Marks Distribution Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cleanedData}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    tick={{ fill: darkMode ? '#CBD5E0' : '#4A5568' }}
                    tickFormatter={(value) => Math.floor(value).toString()}
                  />
                  <YAxis
                    label={{
                      value: 'Probability Density',
                      angle: -90,
                      position: 'insideLeft',
                      className: 'dark:text-white'
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: darkMode ? '#1F2937' : '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [value.toFixed(4), 'Density']}
                  />
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-6 rounded-xl dark:bg-blue-900/30">
            <div className="text-blue-600 dark:text-blue-400 mb-2">Mean Score</div>
            <div className="text-3xl font-bold dark:text-white">{mean.toFixed(1)}</div>
          </div>
          <div className="bg-purple-100 p-6 rounded-xl dark:bg-purple-900/30">
            <div className="text-purple-600 dark:text-purple-400 mb-2">Std Deviation</div>
            <div className="text-3xl font-bold dark:text-white">{stdDev.toFixed(1)}</div>
          </div>
          <div className="bg-green-100 p-6 rounded-xl dark:bg-green-900/30">
            <div className="text-green-600 dark:text-green-400 mb-2">Pass Rate</div>
            <div className="text-3xl font-bold dark:text-white">
              {filteredResults[0]?.pass || 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDashboard;
