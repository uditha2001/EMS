import React, { useState } from 'react';
import SearchableSelectBox from '../SearchableSelectBox';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleAssignmentId: number, userId: number) => void;
  roleAssignmentId: number;
  currentUserId: number;
  users: { id: number; firstName: string; lastName: string }[] | undefined; // Updated to include firstName and lastName
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  roleAssignmentId,
  currentUserId,
  users = [], // Default to an empty array if users is undefined
}) => {
  const [selectedUserId, setSelectedUserId] = useState(currentUserId);

  if (!isOpen) return null;

  // Safeguard for cases where users may be undefined or null
  if (!Array.isArray(users)) {
    return <div>Error: Users data is not available.</div>;
  }

  // Convert the users array to include full names (firstName + lastName)
  const userOptions = users.map((user) => ({
    id: user.id.toString(),
    name: `${user.firstName} ${user.lastName}`, // Display full name
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Assigned User</h2>

        <SearchableSelectBox
          options={userOptions}
          value={selectedUserId.toString()} // Pass selectedUserId as string
          onChange={(value) => setSelectedUserId(Number(value))} // Convert value back to number
          placeholder="Search and select a user"
          label="Select User"
        />

        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => onSave(roleAssignmentId, selectedUserId)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoleModal;
