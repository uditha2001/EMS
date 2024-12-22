import React from 'react';

type Role = {
  name: string;
  permissions: string[];
};

export default function Roles() {
  const roles: Role[] = [
    {
      name: "Admin",
      permissions: [
        "create_user",
        "read_user",
        "update_user",
        "delete_user",
        "create_timetable",
      ],
    },
    {
      name: "Student",
      permissions: ["read_timetable", "read_event", "read_course_registration"],
    },
    {
      name: "Lecturer",
      permissions: ["read_user", "read_timetable", "read_lecture_hall"],
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Roles</h2>
      <button className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Create Role
      </button>
      <table className="w-full border-collapse bg-white shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Permissions</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}`}
            >
              <td className="border px-4 py-2">{role.name}</td>
              <td className="border px-4 py-2">
                {role.permissions.map((permission, i) => (
                  <span
                    key={i}
                    className="mr-2 mb-1 inline-block px-2 py-1 border border-gray-300 rounded bg-gray-100 text-sm"
                  >
                    {permission}
                  </span>
                ))}
              </td>
              <td className="border px-4 py-2">
                <button className="px-3 py-1 bg-teal-600 text-white rounded mr-2 hover:bg-teal-700">
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
