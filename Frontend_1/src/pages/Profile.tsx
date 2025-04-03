import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

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
  const [activeTab, setActiveTab] = useState<string>('roles');
  const userId = auth.id;
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const imageResponse = await axiosPrivate.get(
          `user/getProfileImage/${userId}`,
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

        const userResponse = await axiosPrivate.get<UserProfile>(
          `user/userProfile/${userId}`,
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
  }, [userId, axiosPrivate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 rounded-lg bg-red-50 border border-red-200 max-w-md">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-red-800">Something went wrong</h3>
          <p className="mt-2 text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-270 pb-10">
      <Breadcrumb pageName="Profile" />
      
      <div className="max-w-5xl mx-auto">
        {/* Profile Header - Card with background cover image */}
        <div className="rounded overflow-hidden bg-white shadow-md dark:bg-boxdark mb-8">
          <div className="h-40 bg-gray-200 dark:bg-gray-800"></div>
          
          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end mt-[-50px]">
              <div className="shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="rounded-full w-24 h-24 md:w-32 md:h-32 object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="rounded-full w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-gray-200 border-4 border-white shadow-md">
                    <span className="text-2xl font-medium text-gray-500">
                      {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {userData?.firstName} {userData?.lastName}
                </h2>
                <div className="mt-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {userData?.email || 'No email available'}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    {userData?.contactNo || 'No contact number provided'}
                  </span>
                </div>
              </div>
              
              <div className="ml-auto mt-4 md:mt-0">
                <Link
                  to="/settings"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="rounded overflow-hidden bg-white shadow-md dark:bg-boxdark">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('roles')}
              className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
                activeTab === 'roles'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Roles & Responsibilities
            </button>
            <button
              onClick={() => setActiveTab('workloads')}
              className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
                activeTab === 'workloads'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Workloads
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'roles' && (
              <div className="space-y-8">
                {/* Current Assigned Roles */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    Current Assigned Roles
                  </h3>
                  {userData?.roles?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userData.roles.map((role) => (
                        <div key={role.id} className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                          <div className="w-8 h-8 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-primary mr-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{role.name || role.toString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                      No roles have been assigned yet.
                    </p>
                  )}
                </div>

                {/* Played Roles */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Previous Roles
                  </h3>
                  {userData?.playedRoles?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userData.playedRoles.map((role) => (
                        <div key={role.id} className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                            </svg>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{role.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                      No previous roles to display.
                    </p>
                  )}
                </div>

                {/* Responsibilities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    Responsibilities
                  </h3>
                  {userData?.responsibilities?.length ? (
                    <div className="space-y-3">
                      {userData.responsibilities.map((resp) => (
                        <div key={resp.id} className="flex p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                          <div className="shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{resp.description}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                      No responsibilities have been assigned yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'workloads' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  My Workloads
                </h3>
                {userData?.workloads?.length ? (
                  <div className="space-y-4">
                    {userData.workloads.map((work) => (
                      <div key={work.id} className="p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex flex-wrap items-center justify-between">
                          <div className="flex items-center mb-2 sm:mb-0">
                            <div className="w-10 h-10 rounded-md bg-primary bg-opacity-20 flex items-center justify-center text-primary mr-3">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                            </div>
                            <h4 className="font-medium text-gray-800 dark:text-white">{work.title}</h4>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Deadline: <span className="font-medium">{work.deadline}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No workloads assigned</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You currently have no workloads assigned to you.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;