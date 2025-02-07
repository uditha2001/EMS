import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faQuestionCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import useApi from '../../api/api';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';

interface SubSubQuestion {
  subSubQuestionId: number;
}

interface SubQuestion {
  subQuestionId: number;
  subSubQuestions: SubSubQuestion[];
}

interface QuestionStructure {
  questionId: number;
  questionType: string;
  totalMarks: number;
  subQuestions: SubQuestion[];
}

interface Template {
  templateId: number;
  templateName: string;
}

interface TemplateWithQuestions {
  template: Template;
  questionStructures: QuestionStructure[];
}

const Templates = () => {
  const [templates, setTemplates] = useState<TemplateWithQuestions[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { getAllTemplates, deleteTemplate } = useApi();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await getAllTemplates();
        setTemplates(response.data.data);
      } catch (error) {
        setErrorMessage('Error fetching templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredTemplates = templates.filter((template) =>
    template.template.templateName
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const confirmDelete = async () => {
    if (selectedTemplateId === null) return;

    console.log('Deleting template with ID:', selectedTemplateId);

    try {
      await deleteTemplate(selectedTemplateId);
      setTemplates(
        templates.filter(
          (template) => template.template.templateId !== selectedTemplateId,
        ),
      );
      setSuccessMessage('Template deleted successfully!');
    } catch (error) {
      setErrorMessage('Error deleting template');
    } finally {
      setShowModal(false);
      setSelectedTemplateId(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedTemplateId(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <Breadcrumb pageName="Paper Templates" />

      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search templates"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        />
      </div>

      {/* Templates Flex View */}
      <div className="flex flex-wrap gap-6">
        {filteredTemplates.map((templateWithQuestions) => {
          const totalQuestions =
            templateWithQuestions.questionStructures.length;
          const totalMarks = templateWithQuestions.questionStructures.reduce(
            (sum, question) => sum + question.totalMarks,
            0,
          );

          return (
            <div
              key={templateWithQuestions.template.templateId}
              className="border p-4 rounded-sm cursor-pointer border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
              style={{ minWidth: '280px', maxWidth: '400px' }}
            >
              {/* Template Header */}
              <div className="flex items-center justify-between mb-4">
                {/* Template Name with Icon */}
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faBook}
                    className="text-blue-500 text-lg mr-3 dark:text-blue-400"
                  />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {templateWithQuestions.template.templateName}
                  </h2>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    setSelectedTemplateId(
                      templateWithQuestions.template.templateId,
                    );
                    setShowModal(true);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Delete
                </button>
              </div>

              {/* Template Info */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <strong>Main Questions:</strong> {totalQuestions} <br />
                <strong>Total Marks:</strong> {totalMarks}
              </p>

              {/* Questions */}
              {templateWithQuestions.questionStructures.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No question structures available.
                </p>
              ) : (
                <ul className="space-y-4">
                  {templateWithQuestions.questionStructures.map(
                    (question, index) => {
                      const subQuestionCount = question.subQuestions.length;
                      const subSubQuestionCount = question.subQuestions.reduce(
                        (total, sub) => total + sub.subSubQuestions.length,
                        0,
                      );

                      return (
                        <li
                          key={question.questionId}
                          className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md"
                        >
                          <h3 className="text-md font-medium mb-2 text-gray-900 dark:text-gray-100">
                            <FontAwesomeIcon
                              icon={faQuestionCircle}
                              className="text-green-500 mr-2 dark:text-green-400"
                            />
                            Question {index + 1}{' '}
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                              | {question.questionType} | {question.totalMarks}{' '}
                              marks
                            </span>
                          </h3>
                          {subQuestionCount > 0 && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Sub-questions:</strong> {subQuestionCount}
                            </p>
                          )}
                          {subSubQuestionCount > 0 && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Sub-sub-questions:</strong>{' '}
                              {subSubQuestionCount}
                            </p>
                          )}
                        </li>
                      );
                    },
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this template?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default Templates;
