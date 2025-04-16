import { useEffect, useState } from 'react';
import useExamTimeTableApi from '../../api/examTimeTableApi';
import GenerateSynchronizedTimetablePDF from './GenerateSynchronizedTimetablePDF';

interface Examination {
  id: number;
  year: string;
  level: number;
  semester: string;
  degreeProgramName: string;
}

interface ExamTimeTable {
  examTimeTableId: number;
  examinationId: number;
  courseCode: string;
  courseName: string;
  examType: string;
  date: string;
  startTime: string;
  endTime: string;
  timetableGroup: string;
  degree: string;
  level: number;
  semester: string;
}

interface Conflict {
  degree: string;
  level: string;
  semester: string;
  courseCode: string;
  examType: string;
  date: string;
  startTime: string;
  endTime: string;
  conflictMessages: string[];
}

interface Revision {
  examTimeTableId: number;
  previousDate: string;
  previousStartTime: string;
  previousEndTime: string;
  revisedAt: string;
}

const PreviewSynchronizedTimetable: React.FC<{
  selectedExaminations: Examination[];
  conflicts: Conflict[];
}> = ({ selectedExaminations, conflicts }) => {
  const { getSynchronizedTimetable, getAllTimetableRevisions } = useExamTimeTableApi();
  const [examTimetable, setExamTimetable] = useState<ExamTimeTable[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedExaminations.length === 0) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const examinationIds = selectedExaminations.map(
          (examination) => examination.id,
        );

        const [timetableResponse, revisionsResponse] = await Promise.all([
          getSynchronizedTimetable(examinationIds),
          getAllTimetableRevisions(examinationIds),
        ]);

        setExamTimetable(timetableResponse.data.data);
        setRevisions(revisionsResponse?.data || []);
       
      } catch (error) {
        console.error('Error fetching timetable data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedExaminations]);

  const hasRevision = (examTimeTableId: number) => {
    return revisions.some((rev) => rev.examTimeTableId === examTimeTableId);
  };

  const groupByDegreeLevelSemester = (timetable: ExamTimeTable[]) => {
    const grouped: {
      [degree: string]: {
        [level: string]: {
          [semester: string]: {
            [date: string]: {
              [time: string]: ExamTimeTable[];
            };
          };
        };
      };
    } = {};

    timetable.forEach((item) => {
      const degree = item.degree;
      const level = item.level.toString();
      const semester = item.semester;
      const date = item.date;
      const time = item.startTime + ' - ' + item.endTime;

      if (!grouped[degree]) grouped[degree] = {};
      if (!grouped[degree][level]) grouped[degree][level] = {};
      if (!grouped[degree][level][semester]) grouped[degree][level][semester] = {};
      if (!grouped[degree][level][semester][date]) grouped[degree][level][semester][date] = {};
      if (!grouped[degree][level][semester][date][time]) grouped[degree][level][semester][date][time] = [];

      grouped[degree][level][semester][date][time].push(item);
    });

    return grouped;
  };

  const groupedTimetable = groupByDegreeLevelSemester(examTimetable);

  // Get examination period
  const examinationDates = examTimetable.map((item) => new Date(item.date));
  const minDate = new Date(Math.min(...examinationDates.map((date) => date.getTime())));
  const maxDate = new Date(Math.max(...examinationDates.map((date) => date.getTime())));
  const examinationPeriod = `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;

  // Sort dates
  const sortedDates = Array.from(new Set(examTimetable.map((item) => item.date)))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const hasConflict = (
    degree: string,
    level: string,
    semester: string,
    date: string,
    time: string
  ) => {
    return conflicts.some(
      (conflict) =>
        conflict.degree === degree &&
        conflict.level === level &&
        conflict.semester === semester &&
        conflict.date === date &&
        conflict.startTime + ' - ' + conflict.endTime === time
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading timetable...</div>;
  }

  if (examTimetable.length === 0) {
    return <div className="text-center py-8">No timetable data available</div>;
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <h4 className="font-medium text-black dark:text-white mb-4">
        Timetable Preview
      </h4>
      
      <GenerateSynchronizedTimetablePDF
        examTimetable={examTimetable}
        conflicts={conflicts}
        revisions={revisions}
        examination={selectedExaminations}
        examinationPeriod={examinationPeriod}
      />

      <div className="mb-4">
        <strong>Examination Period:</strong> {examinationPeriod}
      </div>

      <div className="mb-4 flex gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 dark:bg-red-800 mr-2"></div>
          <span>Conflict</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-100 dark:bg-purple-800 mr-2"></div>
          <span>Revised</span>
        </div>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
        <thead>
          <tr className="bg-gray-100 dark:bg-form-input">
            <th rowSpan={3} className="border border-gray-300 px-4 py-2 text-left">
              Date
            </th>
            <th rowSpan={3} className="border border-gray-300 px-4 py-2 text-left">
              Time
            </th>
            {Object.keys(groupedTimetable).map((degree, degreeIndex) => (
              <th
                key={degreeIndex}
                colSpan={Object.keys(groupedTimetable[degree]).length}
                className="border border-gray-300 px-4 py-2 text-left"
              >
                {degree}
              </th>
            ))}
          </tr>
          <tr className="bg-gray-100 dark:bg-form-input">
            {Object.keys(groupedTimetable).map((degree, degreeIndex) =>
              Object.keys(groupedTimetable[degree]).map((level, levelIndex) => (
                <th
                  key={`${degreeIndex}-${levelIndex}`}
                  colSpan={Object.keys(groupedTimetable[degree][level]).length}
                  className="border border-gray-300 px-4 py-2 text-left"
                >
                  Level {level}
                </th>
              ))
            )}
          </tr>
          <tr className="bg-gray-100 dark:bg-form-input">
            {Object.keys(groupedTimetable).map((degree, degreeIndex) =>
              Object.keys(groupedTimetable[degree]).map((level, levelIndex) =>
                Object.keys(groupedTimetable[degree][level]).map(
                  (semester, semesterIndex) => (
                    <th
                      key={`${degreeIndex}-${levelIndex}-${semesterIndex}`}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      Semester {semester}
                    </th>
                  )
                )
              )
            )}
          </tr>
        </thead>

        <tbody>
          {sortedDates.map((date) => {
            const timeSlots = examTimetable
              .filter((item) => item.date === date)
              .map((item) => ({
                time: item.startTime + ' - ' + item.endTime,
                item,
              }))
              .sort((a, b) => {
                const [startA] = a.time.split(' - ');
                const [startB] = b.time.split(' - ');
                return (
                  new Date(`1970-01-01T${startA}`).getTime() -
                  new Date(`1970-01-01T${startB}`).getTime()
                );
              });

            return timeSlots.map((timeSlot, timeIndex) => (
              <tr key={`${date}-${timeSlot.time}`}>
                {timeIndex === 0 && (
                  <td rowSpan={timeSlots.length} className="border px-4 py-2">
                    {date}
                  </td>
                )}
                <td className="border px-4 py-2">{timeSlot.time}</td>
                {Object.keys(groupedTimetable).map((degree) =>
                  Object.keys(groupedTimetable[degree]).map((level) =>
                    Object.keys(groupedTimetable[degree][level]).map(
                      (semester) => {
                        const matchingExams = examTimetable.filter(
                          (exam) =>
                            exam.date === date &&
                            exam.startTime + ' - ' + exam.endTime === timeSlot.time &&
                            exam.degree === degree &&
                            exam.level.toString() === level &&
                            exam.semester === semester
                        );
                        const isConflict = hasConflict(
                          degree,
                          level,
                          semester,
                          date,
                          timeSlot.time
                        );
                        const hasRevised = matchingExams.some(exam => hasRevision(exam.examTimeTableId));

                        return (
                          <td
                            key={`${degree}-${level}-${semester}`}
                            className={`border px-4 py-2 ${
                              isConflict 
                                ? 'bg-red-100 dark:bg-red-800' 
                                : hasRevised 
                                  ? 'bg-purple-100 dark:bg-purple-800' 
                                  : ''
                            }`}
                          >
                            {matchingExams.map((exam, examIndex) => {
                              const isRevised = hasRevision(exam.examTimeTableId);
                              return (
                                <div 
                                  key={examIndex} 
                                  className={isRevised ? 'text-purple-600 dark:text-purple-300' : ''}
                                >
                                  {exam.courseCode} (
                                  {exam.examType === 'THEORY'
                                    ? 'T'
                                    : exam.examType === 'PRACTICAL'
                                    ? 'P'
                                    : exam.examType}
                                  ) - {exam.courseName}
                                  {exam.timetableGroup && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {' - '}
                                      (Group {exam.timetableGroup})
                                    </span>
                                  )}
                                  {isRevised && (
                                    <span 
                                      className="ml-1 text-xs text-purple-600 dark:text-purple-300"
                                      title={`Revised on ${new Date(
                                        revisions.find(rev => rev.examTimeTableId === exam.examTimeTableId)?.revisedAt || ''
                                      ).toLocaleString()}`}
                                    >
                                      (Revised)
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </td>
                        );
                      }
                    )
                  )
                )}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PreviewSynchronizedTimetable;