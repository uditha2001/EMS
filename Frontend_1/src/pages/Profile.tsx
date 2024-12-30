import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

interface Role {
  id: number;
  name: string;
}

interface Responsibility {
  id: number;
  description: string;
}

interface Workload {
  id: number;
  title: string;
  deadline: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  roles: Role[];
  responsibilities: Responsibility[];
  playedRoles: Role[];
  workloads: Workload[];
}

const Profile: React.FC = () => {
  const { auth } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const userId = auth.id;

  console.log(userId);

  const baseUrl = `http://localhost:8080/api/v1/user`;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const imageResponse = await axios.get(
          `${baseUrl}/getProfileImage/${userId}`,
          { responseType: 'arraybuffer' },
        );
        const base64Image = btoa(
          new Uint8Array(imageResponse.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );
        setProfileImage(
          `data:${imageResponse.headers['content-type']};base64,${base64Image}`,
        );

        const userResponse = await axios.get<UserProfile>(
          `${baseUrl}/userProfile/${userId}`,
        );
        setUserData(userResponse.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Profile" />
      <div>
        {/* Profile Header */}
        <div className="max-w-5xl mx-auto p-8 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark text-center mb-8">
          <div className="relative mb-4 flex justify-center items-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="rounded-full w-32 h-32 object-cover border border-gray-300 shadow-sm"
              />
            ) : (
              <div className="rounded-full w-32 h-32 flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {userData?.firstName} {userData?.lastName}
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-400">
            {userData?.email || 'No email available'}
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400">
            {userData?.contactNo || 'No contact number provided'}
          </p>
        </div>

        {/* Roles and Responsibilities */}
        <div className="max-w-5xl mx-auto p-8  rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Roles and Responsibilities
          </h3>
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 dark:text-white">
              Current Assigned Roles
            </h4>
            {userData?.roles?.length ? (
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                {userData.roles.map((role) => (
                  <li key={role.id}>{role.toString()}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No roles assigned</p>
            )}
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-800 dark:text-white">
              Played Roles
            </h4>
            {userData?.playedRoles?.length ? (
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                {userData.playedRoles.map((role) => (
                  <li key={role.id}>{role.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No previous roles</p>
            )}
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-800 dark:text-white">
              Responsibilities
            </h4>
            {userData?.responsibilities?.length ? (
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                {userData.responsibilities.map((resp) => (
                  <li key={resp.id}>{resp.description}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No responsibilities assigned
              </p>
            )}
          </div>
        </div>

        {/* My Workloads Section */}
        <div className="max-w-5xl mx-auto p-8  rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            My Workloads
          </h3>
          {userData?.workloads?.length ? (
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
              {userData.workloads.map((work) => (
                <li key={work.id}>
                  <strong>{work.title}</strong> - Deadline: {work.deadline}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No workloads assigned</p>
          )}
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 text-center">
          <Link
            to="/settings"
            className="inline-block bg-primary  text-gray py-2 px-6 rounded font-medium hover:bg-opacity-90"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
