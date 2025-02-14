import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../../api/api';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface RoleAssignmentRevision {
  roleAssignmentId: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  paperType: 'THEORY' | 'PRACTICAL';
  role: string;
  previousUser: string;
  newUser: string;
  revisionReason: string;
  revisedBy: string;
  revisedAt: string;
}

interface Examination {
  id: string;
  year: string;
  level: string;
  semester: string;
  degreeProgramName: string;
}

const PreviewRoleAssignmentRevisions: React.FC = () => {
  const { examinationId } = useParams<{ examinationId: string }>();
  const [revisions, setRevisions] = useState<RoleAssignmentRevision[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [examination, setExamination] = useState<Examination | null>(null);
  const { fetchRoleAssignmentRevisions, getExaminationById } = useApi();

  useEffect(() => {
    if (!examinationId) return;
    setIsLoading(true);

    Promise.all([
      getExaminationById(Number(examinationId)),
      fetchRoleAssignmentRevisions(Number(examinationId)),
    ])
      .then(([exam, response]) => {
        setExamination(exam);
        if (response?.data && Array.isArray(response.data)) {
          setRevisions(response.data);
        } else {
          setErrorMessage('Failed to fetch role assignment revisions.');
        }
      })
      .catch(() => setErrorMessage('Error fetching data.'))
      .finally(() => setIsLoading(false));
  }, [examinationId]);

  const groupedRevisions = revisions.reduce(
    (acc, revision) => {
      if (!acc[revision.courseId]) {
        acc[revision.courseId] = {
          courseCode: revision.courseCode,
          courseName: revision.courseName,
          revisions: { THEORY: [], PRACTICAL: [] },
        };
      }
      acc[revision.courseId].revisions[revision.paperType].push(revision);
      return acc;
    },
    {} as Record<
      number,
      {
        courseCode: string;
        courseName: string;
        revisions: Record<'THEORY' | 'PRACTICAL', RoleAssignmentRevision[]>;
      }
    >,
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    let currentY = 40; // Track current Y position

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('University of Ruhuna', pageWidth / 2, 15, { align: 'center' });
    doc.text('Department of Computer Science', pageWidth / 2, 25, {
      align: 'center',
    });

    // Exam Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Examination: ${examination?.degreeProgramName} - Level ${examination?.level} - Semester ${examination?.semester} - ${examination?.year}`,
      margin,
      currentY,
    );

    doc.line(margin, currentY + 5, pageWidth - margin, currentY + 5); // Separator line
    currentY += 15;

    doc.setFontSize(14);
    doc.text('Role Assignment Revisions', margin, currentY);
    currentY += 10;

    // Table Headers
    const tableHeaders = [
      'Role',
      'Assigned User',
      'Previous User',
      'Revision Reason',
      'Revision Date',
    ];

    Object.values(groupedRevisions).forEach((course) => {
      // **Course Header**
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${course.courseCode} - ${course.courseName}`, margin, currentY);
      currentY += 8;

      ['THEORY', 'PRACTICAL'].forEach((paperType) => {
        const revisions = course.revisions[paperType as 'THEORY' | 'PRACTICAL'];
        if (revisions.length === 0) return; // Skip if no revisions for this paper type

        // **Paper Type Sub-Header**
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(`${paperType} Paper`, margin, currentY);
        currentY += 6;

        // Data for the table
        const tableData: any[] = revisions.map((revision) => [
          revision.role.toLowerCase(),
          revision.newUser,
          revision.previousUser,
          revision.revisionReason,
          revision.revisedAt.toLocaleString(),
        ]);

        // Generate Table
        autoTable(doc, {
          startY: currentY,
          head: [tableHeaders],
          body: tableData,
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] }, // Green header
          margin: { top: 10 },
        });

        // Update Y position after the table
        currentY = (doc as any).lastAutoTable.finalY + 10;
      });
    });

    // Footer Section with time
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      margin,
      currentY + 10,
    );

    // Signatures
    const colWidth = (pageWidth - 3 * margin) / 2;
    doc.setFontSize(10);
    doc.text('Revised by:', margin, currentY + 20);
    doc.line(margin + 30, currentY + 22, margin + colWidth - 20, currentY + 22);

    doc.text('Authorized by:', margin + colWidth, currentY + 20);
    doc.line(
      margin + colWidth + 30,
      currentY + 22,
      margin + 2 * colWidth - 20,
      currentY + 22,
    );

    // Save PDF
    const fileName = `role-assignment-revisions-${examination?.degreeProgramName}-${examination?.year}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Preview Role Assignment Revisions" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke dark:border-strokedark py-6 px-8">
          <header className="text-center mb-6">
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">
              University of Ruhuna
            </h4>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Department of Computer Science
            </h3>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              Role Assignment Revisions
            </h2>
          </header>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">
              Examination: {examination?.degreeProgramName} - Level{' '}
              {examination?.level} - Semester {examination?.semester} -{' '}
              {examination?.year}
            </h3>
            <button className="btn-primary" onClick={generatePDF}>
              Download PDF
            </button>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          Object.values(groupedRevisions).map(
            ({ courseCode, courseName, revisions }, index) => (
              <div key={index} className="m-8">
                <h4 className="font-semibold">
                  {courseCode} - {courseName}
                </h4>
                {['THEORY', 'PRACTICAL'].map(
                  (type) =>
                    revisions[type as 'THEORY' | 'PRACTICAL'].length > 0 && (
                      <div key={type} className="mt-4">
                        <h5 className="font-medium my-2">{type}</h5>
                        <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-form-input">
                              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                                Role
                              </th>
                              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                                Assigned User
                              </th>
                              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                                Previous User
                              </th>
                              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                                Revision Reason
                              </th>
                              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                                Revised By
                              </th>
                              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                                Revision Date
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {revisions[type as 'THEORY' | 'PRACTICAL'].map(
                              (r) => (
                                <tr
                                  key={r.roleAssignmentId}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                    {r.role.split('_').join(' ').toLowerCase()}
                                  </td>
                                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                    {r.newUser}
                                  </td>
                                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                    {r.previousUser}
                                  </td>
                                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                    {r.revisionReason}
                                  </td>
                                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                    {r.revisedBy}
                                  </td>
                                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                    {r.revisedAt}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    ),
                )}
              </div>
            ),
          )
        )}
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      </div>
    </div>
  );
};

export default PreviewRoleAssignmentRevisions;
