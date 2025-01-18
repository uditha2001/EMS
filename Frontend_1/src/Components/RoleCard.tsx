import React from 'react';

interface RoleCardProps {
  role: string;
  totalUsers: number;
  userImages: string[];
  onEdit: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, totalUsers, userImages, onEdit }) => {
  return (
    <div className="role-card border rounded shadow p-4">
      <h3 className="text-lg font-bold">{role}</h3>
      <p className="text-gray-600">Total {totalUsers} users</p>
      <div className="user-images flex my-2">
        {userImages.slice(0, 4).map((src, index) => (
          <img
            key={index}
            src={src}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border-2 border-white -ml-2"
          />
        ))}
        {userImages.length > 4 && (
          <div className="extra-users text-sm bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center -ml-2">
            +{userImages.length - 4}
          </div>
        )}
      </div>
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={onEdit}
      >
        Edit Role
      </button>
    </div>
  );
};

export default RoleCard;
