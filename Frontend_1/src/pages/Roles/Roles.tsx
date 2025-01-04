import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { Link } from 'react-router-dom';
import SelectBox from '../../components/SelectBox';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useHasPermission from '../../hooks/useHasPermission';

type Permission = {
  permissionId: number;
  permissionName: string;
  permissionDescription: string;
  category: string;
};

type Role = {
  roleId: number;
  roleName: string;
  permissionIds: number[];
  description: string;
};

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();
  const hasDeletePermission = useHasPermission('delete role');
  const hasCreatePermission = useHasPermission('create roles');
  const hasEditPermission = useHasPermission('edit role');

  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        const [rolesResponse, permissionsResponse] = await Promise.all([
          axiosPrivate.get('/roles/all'),
          axiosPrivate.get('/permissions'),
        ]);
        setRoles(rolesResponse.data);
        setPermissions(permissionsResponse.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch roles or permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchRolesAndPermissions();
  }, []);

  const getPermissionNames = (permissionIds: number[]): string => {
    // Check if the role has all permissions
    const hasAllPermissions =
      permissions.length > 0 &&
      permissions.every((permission) =>
        permissionIds.includes(permission.permissionId),
      );

    if (hasAllPermissions) {
      return 'All';
    }

    // Return comma-separated permission names for specific permissions
    return permissionIds
      .map(
        (id) =>
          permissions.find((permission) => permission.permissionId === id)
            ?.permissionName || 'Unknown Permission',
      )
      .join(', ');
  };

  const handleDelete = async () => {
    if (selectedRoleId !== null) {
      try {
        await axiosPrivate.delete(`/roles/delete/${selectedRoleId}`);
        setRoles(roles.filter((role) => role.roleId !== selectedRoleId));
        setIsModalOpen(false);
        setSuccessMessage('Role deleted successfully!');
        setErrorMessage(null);
      } catch (err: any) {
        setErrorMessage('Failed to delete role');
        setSuccessMessage(null);
        setIsModalOpen(false);
      }
    }
  };

  const openModal = (id: number) => {
    setSelectedRoleId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRoleId(null);
    setIsModalOpen(false);
  };

  const filteredRoles = roles
    .filter(
      (role) =>
        role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(
      (role) =>
        categoryFilter === '' ||
        role.permissionIds.some((permissionId) =>
          permissions.some(
            (permission) =>
              permission.permissionId === permissionId &&
              permission.category === categoryFilter,
          ),
        ),
    );

  if (loading)
    return <div className="text-center mt-8 text-gray-500">Loading...</div>;

  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Roles" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="font-medium text-black dark:text-white">Roles</h3>
          {hasCreatePermission && (
            <Link
              to="/usermanagement/roles/create"
              className="inline-block bg-primary text-gray py-2 px-6 rounded font-medium hover:bg-opacity-90"
            >
              Create Role
            </Link>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <SelectBox
            options={[
              { value: '', label: 'All Categories' },
              ...permissions
                .map((permission) => permission.category)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((category) => ({ value: category, label: category })),
            ]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            placeholder="Select category"
            className="w-full sm:w-auto appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pr-10 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
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
                  Role Name
                </th>
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  Permissions
                </th>
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr
                  key={role.roleId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {role.roleName}
                  </td>
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {role.description}
                  </td>
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {getPermissionNames(role.permissionIds)}
                  </td>

                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {hasEditPermission && (
                      <Link
                        to={`/usermanagement/roles/edit/${role.roleId}`}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    )}
                    {hasDeletePermission && (
                      <button
                        onClick={() => openModal(role.roleId)}
                        className="ml-4 text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
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
          message="Are you sure you want to delete this role?"
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default Roles;
