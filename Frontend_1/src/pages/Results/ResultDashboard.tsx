import React, { useState, useEffect } from 'react';
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
import useResultsApi from '../../api/ResultsApi';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useDegreeApi from '../../api/degreeApi';

type GradeDistribution = {
  course: string;
  year: number;
  [key: string]: string | number;
};

type DegreeProgram = {
  id: number;
  name: string;
  updatedAt: string;
  description: string;
};

type allData = {
  id: number;
  marks: number;
  grade: string;
  course: string;
  year: string;
}

type DashboardData = {
  resultData: GradeDistribution[];
  gradeDistribution: GradeDistribution[];
  studentMarks: { subject: string; year: number; marks: number[] }[];
};

const gradeOrder = ['A+', 'A ','A-', 'B+', 'B ','B-', 'C+', 'C ','C-', 'D+','D ', 'E','ABSENT','MEDICAL'];

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
  const [filteredResults, setFilteredResults] = useState<GradeDistribution[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<GradeDistribution[]>([]);
  const [filteredMarks, setFilteredMarks] = useState<number[]>([]);
  const [allData, setAllData] = useState<allData[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    resultData: [],
    gradeDistribution: [],
    studentMarks: [],
  });

  const { getResultsReleaedCourses, getResultsReleasedYears, getAllPublishedResultsWithCourse, getAllPublishedResultsWithProgramId, getAllPublishedResultsWithCourseAndYear, getAllPublishedResults, getPublishedResultsByProgramAndYear } = useResultsApi();
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
        if (selectedProgramId!==undefined && selectedProgramId !== 0) {
          const res = await getResultsReleaedCourses(selectedProgramId);
          if (res.data.code === 200) setSubjects(res.data.data);
        }
        else{
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
      getAllResultsData();
    }
    else{
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

  useEffect(() => {
    console.log("alldata", allData);
  }, [allData])

  const getAllResultsData = async () => {
    try {
      const response = await getAllPublishedResults();
      if (response.data.code === 200) {
        setAllData(response.data.data);
      }

    }
    catch (error) {
      console.error('Error fetching results:', error);
    }
  }

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

  const aggregateGrades = (grades: GradeDistribution[]) => {
    const aggregated: { [key: string]: number } = {};
    grades.forEach((gradeData) => {
      gradeOrder.forEach((grade) => {
        if (gradeData[grade] !== undefined) {
          aggregated[grade] = (aggregated[grade] || 0) + Number(gradeData[grade]);
        }
      });
    });
    return aggregated;
  };

  const aggregatedGrades = aggregateGrades(filteredGrades);

  const selectedMarks =
    dashboardData.studentMarks.find(
      (item) =>
        item.subject === searchSubject &&
        item.year.toString() === searchYear,
    )?.marks || [];

  const calculateMeanAndStdDev = (marks: number[]) => {
    const mean = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
    const variance =
      marks.reduce((sum, mark) => sum + Math.pow(mark - mean, 2), 0) /
      marks.length;
    const stdDev = Math.sqrt(variance);
    return { mean, stdDev };
  };

  const { mean, stdDev } = calculateMeanAndStdDev(selectedMarks);

  const generateNormalDistributionData = (
    mean: number,
    stdDev: number,
    marks: number[],
  ) => {
    const data: { x: number; y: number }[] = [];
    const minX = Math.min(...marks) - 10;
    const maxX = Math.max(...marks) + 10;
    const numPoints = 1000;

    for (let i = 0; i < numPoints; i++) {
      const x = minX + (i * (maxX - minX)) / (numPoints - 1);
      const y =
        (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
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
      {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />}
      {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}

      {/* Header and Filters */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Academic Analytics Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-xl shadow-sm dark:bg-gray-800">
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

        {/* Graphs and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Pass/Fail Rate Over Years</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredResults}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pass" fill="#10B981" />
                  <Bar dataKey="fail" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Pass/Fail Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredResults}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="pass" stroke="#10B981" />
                  <Line type="monotone" dataKey="fail" stroke="#EF4444" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Grade Table and Normal Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Grade Distribution</h3>
            <table className="w-full text-center">
              <thead>
                <tr>{gradeOrder.map((grade) => <th key={grade}>{grade}</th>)}</tr>
              </thead>
              <tbody>
                <tr>{gradeOrder.map((grade) => <td key={grade}>{aggregatedGrades[grade] || 0}</td>)}</tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Marks Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cleanedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [value.toFixed(4), 'Density']} />
                  <Line type="monotone" dataKey="y" stroke="#3B82F6" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stats */}
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
            <div className="text-3xl font-bold dark:text-white">{filteredResults[0]?.pass || 0}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDashboard;
