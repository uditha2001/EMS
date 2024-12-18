import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateRole: React.FC = () => {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<number[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // Fetch available permissions from the backend
    axios.get('/api/v1/permissions')
      .then((response) => {
        setAvailablePermissions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching permissions:', error);
      });
  }, []);

  const handlePermissionChange = (id: number) => {
    setPermissions((prev) =>
      prev.includes(id) ? prev.filter((permId) => permId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRole = {
      roleName,
      description,
      permissionIds: permissions,
    };

    axios.post('/api/v1/roles/create', newRole)
      .then((response) => {
        alert('Role created successfully!');
        setRoleName('');
        setDescription('');
        setPermissions([]);
      })
      .catch((error) => {
        console.error('Error creating role:', error);
        alert('Failed to create role. Please try again.');
      });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Role</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
            Role Name
          </label>
          <input
            type="text"
            id="roleName"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Permissions
          </label>
          <div className="mt-2 grid grid-cols-1 gap-2">
            {availablePermissions.map((permission) => (
              <label key={permission.id} className="flex items-center">
                <input
                  type="checkbox"
                  value={permission.id}
                  checked={permissions.includes(permission.id)}
                  onChange={() => handlePermissionChange(permission.id)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{permission.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Create Role
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRole;
