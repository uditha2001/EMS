import React from 'react';
import RoleCard from './RoleCard';

const Rolecardaps: React.FC = () => {
  const roles = [
    {
      role: 'Administrator',
      totalUsers: 4,
      userImages: [
        '/Frontend_1/src/images/user/user-01.png',
        '/Frontend_1/src/images/user/user-02.png',
        '/Frontend_1/src/images/user/user-03.png',
        '/Frontend_1/src/images/user/user-04.png',
      ],
    },
    {
      role: 'Manager',
      totalUsers: 7,
      userImages: [
        '/Frontend_1/src/images/user/user-06.png',
        '/Frontend_1/src/images/user/user-07.png',
        '/Frontend_1/src/images/user/user-08.png',
        '/Frontend_1/src/images/user/user-09.png',
        '/Frontend_1/src/images/user/user-10.png',
      ],
    },
  ];

  const handleEditRole = (role: string) => {
    alert(`Edit ${role} role clicked!`);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-8">
      {roles.map((role, index) => (
        <RoleCard
          key={index}
          role={role.role}
          totalUsers={role.totalUsers}
          userImages={role.userImages}
          onEdit={() => handleEditRole(role.role)}
        />
      ))}
    </div>
  );
};

export default Rolecardaps;