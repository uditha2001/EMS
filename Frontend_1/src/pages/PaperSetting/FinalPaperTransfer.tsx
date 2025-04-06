import React from 'react';

interface FinalPaperTransferProps {
  isUploading: boolean;
  handleTransfer: () => void;
  selectedExamination: number | null;
  examinations: any[];
  selectedCourse: number | null;
  courses: any[];
  paperType: string;
  availablePaperTypes: string[];
  moderators: any[];
  selectedModerator: number | null;
  remarks: string;
  setRemarks: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCourse: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedExamination: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedModerator: React.Dispatch<React.SetStateAction<number | null>>;
  setPaperType: React.Dispatch<React.SetStateAction<string>>;
}

const FinalPaperTransfer: React.FC<FinalPaperTransferProps> = ({
  isUploading,
  handleTransfer,
  selectedExamination,
  examinations,
  selectedCourse,
  courses,
  paperType,
  availablePaperTypes,
  moderators,
  selectedModerator,
  remarks,
  setRemarks,
  setSelectedExamination,
  setSelectedCourse,
  setSelectedModerator,
  setPaperType,
}) => {
  const handleExaminationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const examId = Number(e.target.value);
    setSelectedExamination(examId);
    setSelectedCourse(null); // Reset course selection
    setPaperType(''); // Reset paper type
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Select Examination
          </label>
          <select
            value={selectedExamination || 0}
            onChange={handleExaminationChange}
            className="input-field appearance-none cursor-pointer"
          >
            <option value={0}>Select Examination</option>
            {examinations.map((examination) => (
              <option key={examination.id} value={examination.id}>
                {examination.year} - Level {examination.level} - Semester{' '}
                {examination.semester} - {examination.degreeProgramName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Select Course
          </label>
          <select
            value={selectedCourse || ''}
            onChange={(e) => {
              setSelectedCourse(Number(e.target.value));
              setPaperType('');
            }}
            className="input-field appearance-none cursor-pointer"
            required
          >
            <option value={''}>Select Course</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Paper Type
          </label>
          <select
            value={paperType}
            onChange={(e) => setPaperType(e.target.value)}
            className="input-field appearance-none cursor-pointer"
            required
          >
            <option value="">Select Paper Type</option>
            {availablePaperTypes.length > 0 ? (
              availablePaperTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))
            ) : (
              <option disabled>No paper types available</option>
            )}
          </select>
        </div>

        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Select Moderator
          </label>
          <select
            value={selectedModerator || ''}
            onChange={(e) => setSelectedModerator(Number(e.target.value))}
            className="input-field appearance-none cursor-pointer"
          >
            <option value={''}>Select Moderator</option>
            {moderators.map((moderator) => (
              <option key={moderator.userId} value={moderator.userId}>
                {moderator.user}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Remarks (Optional)
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="input-field"
            placeholder="Enter remarks"
            rows={3}
            maxLength={100}
          ></textarea>
        </div>
      </div>

      <button
        onClick={handleTransfer}
        disabled={isUploading}
        className="btn-primary text-sm mt-4"
      >
        {isUploading ? 'Transferring...' : 'Transfer Paper & Marking'}
      </button>
    </div>
  );
};

export default FinalPaperTransfer;
