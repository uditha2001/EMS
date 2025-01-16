import React, { useEffect, useState } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useApi from './api';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';

const TransactionHistory: React.FC = () => {
  interface Paper {
    id: number;
    fileName: string;
    creator?: { firstName: string };
    moderator?: { firstName: string };
    createdAt?: string;
  }

  const [transactions, setTransactions] = useState<Paper[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null,
  );
  const [searchText, setSearchText] = useState('');
  const [filterByCreator, setFilterByCreator] = useState<string>(''); // SelectBox for creator
  const [filterByModerator, setFilterByModerator] = useState<string>(''); // SelectBox for moderator
  const [filterByDateFrom, setFilterByDateFrom] = useState<string>(''); // Date filter from
  const [filterByDateTo, setFilterByDateTo] = useState<string>(''); // Date filter to
  const { getAllFiles, deleteFile } = useApi();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [
    searchText,
    filterByCreator,
    filterByModerator,
    filterByDateFrom,
    filterByDateTo,
    transactions,
  ]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getAllFiles(); // Fetch all transactions
      setTransactions(response);
    } catch (error: any) {
      setErrorMessage(
        'Error fetching transactions: ' + (error.message || 'Unknown error'),
      );
    } finally {
      setLoading(false);
    }
  };

  const openModal = (id: number) => {
    setTransactionToDelete(id); // Set the transaction ID to delete
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setTransactionToDelete(null); // Reset the transaction ID
  };

  const handleDelete = async () => {
    if (transactionToDelete === null) return; // If no transaction is selected, exit
    try {
      const response = await deleteFile(transactionToDelete);
      setSuccessMessage(
        response?.message || 'Transaction deleted successfully.',
      );
      fetchTransactions(); // Refresh the transactions list
    } catch (error: any) {
      setErrorMessage(
        'Error deleting transaction: ' + (error.message || 'Unknown error'),
      );
    } finally {
      closeModal(); // Close the modal after deletion
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleFilterByCreatorChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFilterByCreator(e.target.value);
  };

  const handleFilterByModeratorChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFilterByModerator(e.target.value);
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterByDateFrom(e.target.value);
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterByDateTo(e.target.value);
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchText) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.fileName
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          transaction.creator?.firstName
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          transaction.moderator?.firstName
            .toLowerCase()
            .includes(searchText.toLowerCase()),
      );
    }

    if (filterByCreator) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.creator?.firstName
            .toLowerCase()
            .includes(filterByCreator.toLowerCase()),
      );
    }

    if (filterByModerator) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.moderator?.firstName
            .toLowerCase()
            .includes(filterByModerator.toLowerCase()),
      );
    }

    if (filterByDateFrom) {
      filtered = filtered.filter(
        (transaction) =>
          new Date(transaction.createdAt || '').getTime() >=
          new Date(filterByDateFrom).getTime(),
      );
    }

    if (filterByDateTo) {
      filtered = filtered.filter(
        (transaction) =>
          new Date(transaction.createdAt || '').getTime() <=
          new Date(filterByDateTo).getTime(),
      );
    }

    setFilteredTransactions(filtered);
  };

  // Extract unique creators and moderators from the transactions
  const creators = Array.from(
    new Set(transactions.map((t) => t.creator?.firstName).filter(Boolean)),
  );
  const moderators = Array.from(
    new Set(transactions.map((t) => t.moderator?.firstName).filter(Boolean)),
  );

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Transaction History" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="font-medium text-black dark:text-white">
            Transaction List
          </h3>
        </div>

        {/* Success and Error messages */}
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />

        {/* Search and Filters */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search transactions"
            value={searchText}
            onChange={handleSearchChange}
            className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <select
            value={filterByCreator}
            onChange={handleFilterByCreatorChange}
            className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Filter by Creator</option>
            {creators.map((creator, index) => (
              <option key={index} value={creator}>
                {creator}
              </option>
            ))}
          </select>
          <select
            value={filterByModerator}
            onChange={handleFilterByModeratorChange}
            className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Filter by Moderator</option>
            {moderators.map((moderator, index) => (
              <option key={index} value={moderator}>
                {moderator}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filterByDateFrom}
            onChange={handleDateFromChange}
            className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <input
            type="date"
            value={filterByDateTo}
            onChange={handleDateToChange}
            className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        {/* Loading or Content Display */}
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading transactions...
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
              <thead>
                <tr className="bg-gray-100 dark:bg-form-input">
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    File Name
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Sender
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Receiver
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Date Uploaded
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {transaction.fileName}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {transaction.creator?.firstName}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {transaction.moderator?.firstName}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {transaction.createdAt &&
                        new Date(transaction.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      <button
                        type="button"
                        className="text-red-600 hover:text-opacity-80"
                        onClick={() => openModal(transaction.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No transactions found.
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this transaction?"
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default TransactionHistory;
