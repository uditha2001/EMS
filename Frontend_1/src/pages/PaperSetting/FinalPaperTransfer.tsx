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
  return (
    <div className="text-center">
      <div>
        <label className="mb-2.5 block text-black dark:text-white">
          Select Examination
        </label>
        <select
          value={selectedExamination || 0}
          onChange={(e) => setSelectedExamination(Number(e.target.value))}
          className="input-field appearance-none"
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

      <div className="space-y-4">
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
            className="input-field appearance-none"
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
            className="input-field appearance-none"
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
      </div>

      <div>
        <label className="mb-2.5 block text-black dark:text-white">
          Select Moderator
        </label>
        <select
          value={selectedModerator || ''}
          onChange={(e) => setSelectedModerator(Number(e.target.value))}
          className="input-field appearance-none"
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

      <button
        onClick={handleTransfer}
        disabled={isUploading}
        className="btn-primary"
      >
        {isUploading ? 'Transferring...' : 'Transfer Paper & Marking'}
      </button>
    </div>
  );
};

export default FinalPaperTransfer;
