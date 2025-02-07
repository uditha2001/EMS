import { useEffect, useState } from 'react';
import useApi from '../../api/api';
import Loader from '../../common/Loader';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Pagination from '../../components/Pagination';

const ArchivedPapers = () => {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { getArchivedPapers, deleteArchivedPaper, downloadArchivedPaper } =
    useApi();

  useEffect(() => {
    fetchArchivedPapers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchArchivedPapers = async (page: number, size: number) => {
    setLoading(true);
    try {
      const response = await getArchivedPapers(page, size);
      if (response.data?.data?.content) {
        setPapers(response.data.data.content);
      } else {
        setPapers([]);
      }
    } catch (error) {
      console.error('Error fetching papers:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteArchivedPaper(id);
      fetchArchivedPapers(currentPage, pageSize);
    } catch (error) {
      console.error('Error deleting paper', error);
    }
  };

  const handleDownload = async (id: number, fileName: string) => {
    try {
      const response = await downloadArchivedPaper(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || `paper_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading paper', error);
    }
  };

  // Pagination Controls
  const handleNextPage = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to the first page when page size changes
  };

  // Date formatting function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Archived Papers" />
      {loading ? (
        <p>
          <Loader />
        </p>
      ) : (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Archived Papers
            </h3>
          </div>

          {/* Table for displaying papers */}
          <div className="overflow-x-auto m-8">
            <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
              <thead>
                <tr className="bg-gray-100 dark:bg-form-input">
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    File Name
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Remarks
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Creator
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Moderator
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Shared At
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Created At
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {papers.length > 0 ? (
                  papers.map((paper) => (
                    <tr
                      key={paper.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">{paper.fileName}</td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">{paper.remarks}</td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">{paper.creatorName}</td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">{paper.moderatorName}</td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {formatDate(paper.sharedAt)}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {formatDate(paper.createdAt)}
                      </td>
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        <button
                          onClick={() =>
                            handleDownload(paper.id, paper.fileName)
                          }
                          className="text-primary hover:underline mr-2"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDelete(paper.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No archived papers available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={papers.length}
            onPageChange={handleNextPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default ArchivedPapers;
