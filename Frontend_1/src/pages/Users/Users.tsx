import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage'; // Import SuccessMessage
import ErrorMessage from '../../components/ErrorMessage'; // Import ErrorMessage
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { Link } from 'react-router-dom';

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/user');
        setUsers(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (id: number) => {
    alert(`Edit user with ID: ${id}`);
    // Implement edit logic here
  };

  const handleDelete = async () => {
    if (selectedUserId !== null) {
      try {
        await axios.delete(
          `http://localhost:8080/api/v1/user/deleteUser/${selectedUserId}`,
        );
        setUsers(users.filter((user) => user.id !== selectedUserId));
        setIsModalOpen(false); // Close the modal after deletion
        setSuccessMessage('User deleted successfully!'); // Set success message
        setErrorMessage(null); // Clear any previous error message
      } catch (err: any) {
        setErrorMessage('Failed to delete user'); // Set error message
        setSuccessMessage(null); // Clear any previous success message
        setIsModalOpen(false);
      }
    }
  };

  const handleCreate = () => {
    alert('Redirect to create user form');
    // Implement user creation logic here
  };

  const openModal = (id: number) => {
    setSelectedUserId(id);
    setIsModalOpen(true); // Open the confirmation modal
  };

  const closeModal = () => {
    setSelectedUserId(null);
    setIsModalOpen(false); // Close the modal
  };

  if (loading)
    return <div className="text-center mt-8 text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Users" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="font-medium text-black dark:text-white">Users</h3>
          <Link
            to="/usermanagement/users/create"
            className="inline-block bg-primary  text-gray py-2 px-6 rounded font-medium hover:bg-opacity-90"
          >
            Create User
          </Link>
        </div>

        {/* Display Success or Error Message */}
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

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
            <thead>
              <tr className="bg-gray-100 dark:bg-form-input">
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  ID
                </th>
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  Username
                </th>
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  Email
                </th>
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  Roles
                </th>
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {user.id}
                  </td>
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {user.username}
                  </td>
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {user.roles.join(', ')}
                  </td>
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    <Link
                      to="/usermanagement/users/edit"
                      className="text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => openModal(user.id)}
                      className="ml-4 text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this user?"
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default Users;
