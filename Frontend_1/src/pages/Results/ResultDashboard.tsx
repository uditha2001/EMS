import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';
import useResultsApi from '../../api/ResultsApi';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useDegreeApi from '../../api/degreeApi';
type DegreeProgram = {
  id: number;
  name: string;
  updatedAt: string;
  description: string;
};

type allData = {
  marksAverage: Record<string, number>;
  gradeCount: Record<string, number>;
  yaxisName: string;
  xaxisName: string;
}

const gradeOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'ABSENT', 'MEDICAL'];
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#A05195', '#D45087', '#F95D6A', '#FF7C43',
  '#665191', '#2F4B7C', '#003F5C', '#4B384C',
  '#FFA600', '#58508D'
];

const ResultDashboard: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [programs, setPrograms] = useState<DegreeProgram[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | undefined>();
  const [searchYear, setSearchYear] = useState<string | undefined>('');
  const [darkMode] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [allData, setAllData] = useState<allData>()

  const { getResultsReleaedCourses, getResultsReleasedYears, getAllPublishedResultsWithCourse, getAllPublishedResultsWithProgramId, getAllPublishedResultsWithCourseAndYear, getPublishedResultsByProgramAndYear } = useResultsApi();
  const { getAllDegreePrograms } = useDegreeApi();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [yearsRes, programsRes] = await Promise.all([
          getResultsReleasedYears(),
          getAllDegreePrograms(),
        ]);
        if (yearsRes.data.code === 200) setYears(yearsRes.data.data);
        if (programsRes.data) setPrograms(programsRes.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (selectedProgramId !== undefined && selectedProgramId !== 0) {
          const res = await getResultsReleaedCourses(selectedProgramId);
          if (res.data.code === 200) setSubjects(res.data.data);
        }
        else {
          setSubjects([]);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, [selectedProgramId]);

  useEffect(() => {
    if (selectedProgramId === undefined || selectedProgramId === 0) {
      setAllData(undefined);
    }
    else {
      if (searchSubject === "" && searchYear === "") {
        getAllPublishedResultsbyProgramId(selectedProgramId);
      }
      else if (searchYear === "") {
        getAllDataByCourse(searchSubject, selectedProgramId);
      }
      else if (searchSubject === "") {
        getDataByProgramAndYear(selectedProgramId, searchYear || '');
      }
      else {
        getAllDataByCourseAndYear(searchSubject, searchYear);
      }
    }
  }, [searchSubject, searchYear, selectedProgramId]);


  const getAllDataByCourse = async (courseCode: string, id: number | undefined) => {
    try {
      const response = await getAllPublishedResultsWithCourse(selectedProgramId || 0, courseCode);
      if (response.data.code === 200) {
        setAllData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  }

  const getAllDataByCourseAndYear = async (
    courseCode: string,
    year: string | undefined
  ) => {
    try {
      const response = await getAllPublishedResultsWithCourseAndYear(
        selectedProgramId || 0,
        courseCode,
        year || '',
      );
      if (response.data.code === 200) {
        setAllData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching course+year results:', error);
    }
  };

  const getDataByProgramAndYear = async (id: number, year: string) => {
    try {
      const response = await getPublishedResultsByProgramAndYear(
        id || 0,
        year
      );
      if (response.data.code === 200) {
        setAllData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching program+year results:', error);
    }
  };

  const getAllPublishedResultsbyProgramId = async (id: number) => {
    try {
      const response = await getAllPublishedResultsWithProgramId(id);
      if (response.data.code === 200) {
        setAllData(response.data.data);
      }
    }
    catch (error) {
      console.error('Error fetching results:', error);
    }
  }
  // Ensure gradeCount and data are available before rendering the Pie chart
  const pieData = gradeOrder
    .map(grade => ({
      name: grade.trim(),
      value: allData?.gradeCount?.[grade] || 0
    }))
    .filter(entry => entry.value > 0); // Only show grades with data



  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen p-4 bg-gray-50 dark:bg-gray-900`}>
      {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />}
      {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Academic Analytics Dashboard</h1>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 bg-white rounded-xl shadow-sm dark:bg-gray-800">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Degree Program</label>
            <select
              value={selectedProgramId || ''}
              onChange={(e) => setSelectedProgramId(Number(e.target.value))}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Subject</label>
            <select
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Year</label>
            <select
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Years</option>
              {years.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Graphs Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm dark:bg-gray-800">
          {/* Marks Distribution Bar Chart */}
          <div className="h-96">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              {allData?.yaxisName || 'Marks Distribution'}
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              {allData?.marksAverage ? (
                <BarChart
                  data={(() => {
                    const keys = Object.keys(allData.marksAverage || {});

                    // Check if the keys are all numeric (for year data)
                    const isYearData = keys.every(key => /^\d+$/.test(key));

                    // Check if the keys are all valid course codes (for course data)
                    const isCourseCodeData = keys.every(key => /^[A-Za-z0-9-_]+$/.test(key)); // Modified to allow alphanumeric, underscores, and hyphens

                    if (isYearData) {
                      // Year data: sort years ascending
                      const sortedYears = keys.sort((a, b) => Number(a) - Number(b));
                      return sortedYears.map(year => ({
                        name: year,
                        value: Number(parseFloat(allData.marksAverage[year].toString()).toFixed(2))
                      }));
                    } else if (isCourseCodeData) {
                      // Course data: use course codes as the name
                      return keys.map(courseCode => ({
                        name: courseCode,
                        value: Number(parseFloat(allData.marksAverage[courseCode]?.toString() || '0').toFixed(4))
                      })).filter(entry => entry.value > 0);  // Filter out 0 values
                    } else {
                      // Grade data: use predefined grade order
                      const gradeOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'ABSENT', 'MEDICAL'];
                      return gradeOrder.map(grade => ({
                        name: grade,
                        value: Number(parseFloat(allData.marksAverage[grade]?.toString() || '0').toFixed(4))
                      })).filter(entry => entry.value > 0);  // Filter out 0 values
                    }
                  })()}

                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    label={{
                      value: allData?.xaxisName || (allData && Object.keys(allData.marksAverage || {}).every(key => /^\d+$/.test(key)) ? 'Year' : 'Grades'),
                      position: 'bottom',
                      offset: 0
                    }}
                  />
                  <YAxis
                    label={{
                      value: allData?.yaxisName || 'Average Marks',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 10
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#374151' : '#fff',
                      borderColor: darkMode ? '#4B5563' : '#E5E7EB'
                    }}
                    itemStyle={{ color: darkMode ? '#F3F4F6' : '#1F2937' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  <Bar
                    dataKey="value"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    name="Average Marks"
                  />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Data Available
                </div>
              )}
            </ResponsiveContainer>
          </div>


          {/* Grade Distribution Pie Chart */}
          <div className="h-96">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Grade Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {pieData.length > 0 ? (
                  <>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}  // Show count of grades
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        // Show the exact value (count of grades)
                        return [value, `${name}: ${value}`];
                      }}
                      contentStyle={{
                        backgroundColor: darkMode ? '#374151' : '#fff',
                        borderColor: darkMode ? '#4B5563' : '#E5E7EB'
                      }}
                      itemStyle={{ color: darkMode ? '#F3F4F6' : '#1F2937' }}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{ paddingLeft: 30 }}
                      formatter={(value) => (
                        <span className={darkMode ? 'text-white' : 'text-gray-700'}>
                          {value}
                        </span>
                      )}
                    />
                  </>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No data available for the selected program or filters.
                  </p>
                )}
              </PieChart>

            </ResponsiveContainer>
          </div>
        </div>

        {/* Note for Hidden Grades */}
        {(() => {
          const hiddenGrades = gradeOrder.filter(
            grade => (allData?.gradeCount?.[grade] || 0) === 0
          );
          return hiddenGrades.length > 0 ? (
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
              No data for grades: {hiddenGrades.join(', ')}
            </p>
          ) : null;
        })()}
      </div>
    </div>
  );


};

export default ResultDashboard;