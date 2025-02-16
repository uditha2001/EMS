import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {
  faInfoCircle,
  faBook,
  faFileUpload,
  faEye,
  faClipboardCheck,
} from '@fortawesome/free-solid-svg-icons';

import Stepper from '../PaperTransfer/Stepper';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import EssayTemplate from './EssayTemplate';
import StructureTemplate from './StructureTemplate';

import MarkingPreview from './MarkingPreview';
import PaperPreview from './PaperPreview';

// Consolidated all paper info into a single object
const initialPaperInfo = {
  university: 'UNIVERSITY OF RUHUNA',
  degree: 'BACHELOR OF COMPUTER SCIENCE (GENERAL) DEGREE',
  courseCode: 'CSC2222 – Computer Systems II',
  examYear: 'September/October 2020',
  semester: 'LEVEL II (SEMESTER II)',
  duration: '2 Hours',
  instructions: '',
};

const PaperSettings: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paperType, setPaperType] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [paperInfo, setPaperInfo] = useState(initialPaperInfo);

  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
    ],
  };

  const steps = [
    { id: 1, name: 'Exam Info', icon: faInfoCircle },
    { id: 2, name: 'Paper Structure', icon: faBook },
    { id: 3, name: 'Questions', icon: faFileUpload },
    { id: 4, name: 'Preview Paper', icon: faEye },
    { id: 5, name: 'Preview Marking', icon: faClipboardCheck },
  ];

  const renderQuestionTemplate = () => {
    switch (paperType) {
      case 'Essay':
        return (
          <EssayTemplate
            questions={questions}
            setQuestions={setQuestions}
            quillModules={quillModules}
          />
        );
      case 'Structure':
        return (
          <StructureTemplate
            questions={questions}
            setQuestions={setQuestions}
            quillModules={quillModules}
          />
        );

      default:
        return (
          <p className="text-center text-gray-500">
            Please select a paper type to start adding questions.
          </p>
        );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setPaperInfo((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Paper Setting" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Paper Setting
          </h3>
        </div>

        <div className="p-8">
          <Stepper currentStep={currentStep} steps={steps} />

          {currentStep === 1 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    University
                  </label>
                  <input
                    className="input-field w-full"
                    type="text"
                    value={paperInfo.university}
                    onChange={(e) => handleInputChange(e, 'university')}
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Degree Program
                  </label>
                  <input
                    className="input-field w-full"
                    type="text"
                    value={paperInfo.degree}
                    onChange={(e) => handleInputChange(e, 'degree')}
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Course
                  </label>
                  <input
                    className="input-field w-full"
                    type="text"
                    value={paperInfo.courseCode}
                    onChange={(e) => handleInputChange(e, 'courseCode')}
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Examination Year
                  </label>
                  <input
                    className="input-field w-full"
                    type="text"
                    value={paperInfo.examYear}
                    onChange={(e) => handleInputChange(e, 'examYear')}
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Semester
                  </label>
                  <input
                    className="input-field w-full"
                    type="text"
                    value={paperInfo.semester}
                    onChange={(e) => handleInputChange(e, 'semester')}
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Duration
                  </label>
                  <input
                    className="input-field w-full"
                    type="text"
                    value={paperInfo.duration}
                    onChange={(e) => handleInputChange(e, 'duration')}
                  />
                </div>
                <div className="col-span-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Instructions
                  </label>
                  <ReactQuill
                    value={paperInfo.instructions}
                    onChange={(value) =>
                      setPaperInfo({ ...paperInfo, instructions: value })
                    }
                    modules={quillModules}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Paper Type
              </label>
              <select
                className="input-field w-1/3"
                value={paperType}
                onChange={(e) => setPaperType(e.target.value)}
              >
                <option value="">Select Paper Type</option>
                <option value="Essay">Essay</option>
                <option value="Structure">Structure</option>
              </select>
            </div>
          )}

          {currentStep === 3 && renderQuestionTemplate()}

          {currentStep === 4 && (
            <PaperPreview
              university={paperInfo.university}
              degree={paperInfo.degree}
              courseCode={paperInfo.courseCode}
              examYear={paperInfo.examYear}
              semester={paperInfo.semester}
              instructions={paperInfo.instructions}
              questions={questions}
              paperType={paperType}
              duration={paperInfo.duration}
            />
          )}

          {currentStep === 5 && (
            <MarkingPreview
              university={paperInfo.university}
              degree={paperInfo.degree}
              courseCode={paperInfo.courseCode}
              examYear={paperInfo.examYear}
              semester={paperInfo.semester}
              questions={questions}
              paperType={paperType}
              duration={paperInfo.duration}
            />
          )}

          <div className="flex justify-between mt-8 text-sm">
            <button
              className="btn-primary"
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <button
              className="btn-primary"
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep === steps.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperSettings;
