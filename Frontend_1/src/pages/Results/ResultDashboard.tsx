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
    <div className={`${darkMode ? 'dark' : ''} min-h-screen`}>
      <div className="dark:bg-gray-900 dark:text-white">
        <div className="mx-auto max-w-270">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800 max-w-270 mx-auto">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-black dark:text-white">
                  Result Dashboard
                </h3>
              </div>
            </div>

            <div className="p-6.5">
              {/* Search Bar for Bar and Line Chart */}
              <div className="flex space-x-4 mb-4">
                <select
                  value={searchSubject}
                  onChange={(e) => setSearchSubject(e.target.value)}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bar Chart */}
              <div className="bg-white p-4 rounded-lg shadow mb-6 dark:bg-gray-700">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredResults}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? '#4A5568' : '#E2E8F0'}
                    />
                    <XAxis
                      dataKey="year"
                      stroke={darkMode ? '#CBD5E0' : '#4A5568'}
                    />
                    <YAxis stroke={darkMode ? '#CBD5E0' : '#4A5568'} />
                    <Tooltip />
                    <Bar dataKey="pass" fill="#4CAF50" />
                    <Bar dataKey="fail" fill="#F44336" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart */}
              <div className="bg-white p-4 rounded-lg shadow mb-6 dark:bg-gray-700">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredResults}>
                    <XAxis
                      dataKey="year"
                      stroke={darkMode ? '#CBD5E0' : '#4A5568'}
                    />
                    <YAxis stroke={darkMode ? '#CBD5E0' : '#4A5568'} />
                    <Tooltip />
                    <Line type="monotone" dataKey="pass" stroke="#4CAF50" />
                    <Line type="monotone" dataKey="fail" stroke="#F44336" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Search Bars for Grade Distribution and Normal Distribution Graph (Side by Side) */}
              <div className="flex space-x-4 mb-4">
                <select
                  value={searchSubjectGrades}
                  onChange={(e) => setSearchSubjectGrades(e.target.value)}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                <select
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade Distribution Table */}
              <div className="bg-white p-4 rounded-lg shadow mb-6 dark:bg-gray-700">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-600">
                      {gradeOrder.map((grade) => (
                        <th
                          key={grade}
                          className="border p-2 dark:border-gray-600"
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
                          className="border p-2 text-center dark:border-gray-600"
                        >
                          {aggregatedGrades[grade] || 0}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Normal Distribution Graph */}
              <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-700">
                <h4 className="text-center font-medium mb-4 dark:text-white">
                  Normal Distribution of Marks
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={cleanedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => Math.floor(value).toString()} // Convert to string
                      ticks={[
                        -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110,
                      ]} // Specify the ticks you want to display
                    />
                    <YAxis
                      label={{
                        value: 'PDF ',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                      domain={['auto', 'auto']} // Adjusts Y scale dynamically
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#0000FF"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDashboard;
