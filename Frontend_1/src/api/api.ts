import { useState } from 'react';
import { Paper } from '../types/transferpaper';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useApi = () => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    markingFile: File | null,
    creatorId: number,
    courseId: number,
    remarks: string,
    paperType: string,
    moderatorId: number,
    examinationId: number,
  ): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (markingFile) {
      formData.append('markingFile', markingFile);
    }
    formData.append('creatorId', creatorId.toString());
    formData.append('moderatorId', moderatorId.toString());
    formData.append('remarks', remarks);
    formData.append('paperType', paperType);
    formData.append('examinationId', examinationId.toString());
    formData.append('courseId', courseId.toString());

    try {
      const res = await axiosPrivate.post('/papers/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.data;
     
    } catch (error: any) {
      if (error.response) {
        console.error('Error uploading file:', error.response.data?.message);
        setError(error.response.data?.message || 'Failed to upload the file');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response from server');
      } else {
        console.error('Error setting up the request:', error.message);
        setError('Request setup error');
      }
      throw new Error(error.message);
    }
  };

  const getAllFiles = async (): Promise<Paper[]> => {
    try {
      setLoading(true);
      const res = await axiosPrivate.get('/papers');
      if (Array.isArray(res.data.data)) {
        return res.data.data;
      } else {
        throw new Error('Unexpected data format.');
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to fetch files');
      throw new Error(
        error?.response?.data?.message || 'Failed to fetch files',
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (
    id: number,
    moderatorId: number,
  ): Promise<void> => {
    try {
      const response = await axiosPrivate.get(
        `/papers/download/${id}?moderatorId=${moderatorId}`,
        { responseType: 'blob' },
      );
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'file.pdf';
      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = decodeURIComponent(matches[1]);
        }
      }

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      if (!blob || blob.size === 0)
        throw new Error('No data returned from the server.');

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to download file');
      throw new Error(
        error?.response?.data?.message || 'Failed to download file',
      );
    }
  };

  const deleteFile = async (id: number): Promise<{ message: string }> => {
    try {
      const res = await axiosPrivate.delete(`/papers/${id}`);
      return res.data.data;
    } catch (error) {
      const axiosError = error as any;
      setError(
        axiosError?.response?.data?.message || 'Failed to delete the file',
      );
      throw new Error(
        axiosError?.response?.data?.message || 'Failed to delete the file',
      );
    }
  };

  const getStructureData = async (fileId: number) => {
    try {
      const response = await axiosPrivate.get(`/structure/${fileId}`);
      if (response.status === 200) {
        return response.data; // Contains the structure data in `data`
      } else {
        throw new Error('Failed to fetch structure data.');
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error fetching structure data.',
      );
    }
  };

  const updateFile = async (
    fileId: number,
    file: File,
    fileName: string,
    markingFile: File | null,
    markingFileName: string,
    remarks: string,
  ): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    if (markingFile) {
      formData.append('markingFile', markingFile);
    }
    formData.append('markingFileName', markingFileName);
    formData.append('remarks', remarks);
    try {
      setLoading(true);
      const res = await axiosPrivate.put(`/papers/update/${fileId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      return res.data.data;
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update the file';
      console.error(
        'Update File Error:',
        errorMessage,
        error.response || error,
      );
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getPaperById = async (id: number) => {
    try {
      const response = await axiosPrivate.get(`/papers/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch paper details',
      );
    }
  };

  const fetchUsers = async () => {
    const response = await axiosPrivate.get('/user');
    return response.data;
  };

  const deleteUser = async (userId: number) => {
    await axiosPrivate.delete(`/user/deleteUser/${userId}`);
  };

  const updateUserStatus = async (userId: number, isActive: boolean) => {
    await axiosPrivate.put(`/user/users/${userId}/status?isActive=${isActive}`);
  };

  const updateUserWithRoles = async (userId: number, updatedUser: any) => {
    return axiosPrivate.put(`/user/updateUserWithRoles/${userId}`, updatedUser);
  };

  const fetchAllRoles = async () => {
    return axiosPrivate.get('/roles/all');
  };

  const fetchAllPermissions = async () => {
    return axiosPrivate.get('/permissions');
  };

  const getUserById = async (userId: number) => {
    return axiosPrivate.get(`/user/getUserById/${userId}`);
  };

  const createUserWithRoles = async (newUser: any) => {
    return axiosPrivate.post('/user/addUserWithRoles', newUser);
  };

  const deleteRole = async (roleId: number) => {
    await axiosPrivate.delete(`/roles/delete/${roleId}`);
  };

  const createRole = async (newRole: any) => {
    return axiosPrivate.post('/roles/create', newRole);
  };

  const createDegreeProgram = async (degreeProgram: {name: string, description: string}) => {
    return axiosPrivate.post('/degreePrograms', degreeProgram);
  };

  const deleteDegreeProgram = async (id: number) => {
    return axiosPrivate.delete('/degreePrograms/' + id);
  };

  const updateRole = async (roleId: number, updatedRole: any) => {
    return axiosPrivate.put(`/roles/update/${roleId}`, updatedRole);
  };

  const getRoleById = async (roleId: number) => {
    return axiosPrivate.get(`/roles/view/${roleId}`);
  };

  const getUserProfile = async (userId: number) => {
    return axiosPrivate.get(`/user/userProfile/${userId}`);
  };

  const getProfileImage = async (userId: number) => {
    return axiosPrivate.get(`/user/getProfileImage/${userId}`, {
      responseType: 'arraybuffer',
    });
  };

  const updateUserProfile = async (userId: number, formData: any) => {
    return axiosPrivate.put(`/user/updateUserProfile/${userId}`, formData);
  };

  const updateProfileImage = async (userId: number, imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return axiosPrivate.put(`/user/updateProfileImage/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const deleteProfileImage = async (userId: number) => {
    return axiosPrivate.delete(`/user/deleteProfileImage/${userId}`);
  };

  const getDegreePrograms = async () => {
    return axiosPrivate.get('/degreePrograms');
  };

  const getExaminations = async () => {
    return axiosPrivate.get('/academic-years');
  };

  const deleteExamination = async (id: number) => {
    return axiosPrivate.delete(`/academic-years/${id}`);
  };

  const createExamination = async (newExamination: any) => {
    return axiosPrivate.post('/academic-years', newExamination);
  };

  const updateExamination = async (id: number, updatedExamination: any) => {
    return axiosPrivate.put(`/academic-years/${id}`, updatedExamination);
  };

  const createPaperStructure = async (paperId: any, questions: any) => {
    return axiosPrivate.post(`/structure/${paperId}`, questions, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const updatePaperStructure = async (paperId: any, questions: any) => {
    return axiosPrivate.put(`/structure/${paperId}`, questions, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const deletePaperStructure = async (paperId: number) => {
    return axiosPrivate.delete(`/structure/${paperId}`);
  };

  const deleteSubQuestion = async (subQuestionId: number) => {
    return axiosPrivate.delete(`/structure/subQuestion/${subQuestionId}`);
  };

  const deleteSubSubQuestion = async (subSubQuestionId: number) => {
    return axiosPrivate.delete(`/structure/subSubQuestion/${subSubQuestionId}`);
  };

  const getPaperStructure = async (paperId: number) => {
    return axiosPrivate.get(`structure/${paperId}`);
  };

  const fetchEncryptedPaper = async (paperId: number, moderatorId: number) => {
    return axiosPrivate.post(
      'papers/view',
      { id: paperId, moderatorId }, // Sending data in the request body
      { responseType: 'blob' },
    );
  };

  const createModeration = async (moderation: any) => {
    return axiosPrivate.post('/moderation/question-with-hierarchy', moderation);
  };

  const getPapers = async () => {
    return axiosPrivate.get('/papers');
  };

  const getCoursesByDegreeProgramId = async (selectedDegreeProgram: number) => {
    return axiosPrivate.get(
      `/courses?degreeProgramId=${selectedDegreeProgram}`,
    );
  };

  const saveTemplate = async (templateData: any) => {
    return axiosPrivate.post(
      `/structure/save-template-and-structure`,
      templateData,
    );
  };

  const getAllTemplates = async () => {
    return axiosPrivate.get('/structure/templates/with-questions');
  };

  const getTemplateById = async (templateId: number) => {
    return axiosPrivate.get(
      `/structure/templates/${templateId}/with-questions`,
    );
  };

  const getTemplates = async () => {
    return axiosPrivate.get('/structure/templates');
  };

  const deleteTemplate = async (templateId: number) => {
    return axiosPrivate.delete(`/structure/delete-template/${templateId}`);
  };

  const getExaminationsCourses = async (examinationId: number) => {
    return axiosPrivate.get(
      `academic-years/examinations/${examinationId}/courses`,
    );
  };

  const createRoleAssignment = async (roleAssignment: any) => {
    return axiosPrivate.post('/role-assignments/bulk', roleAssignment);
  };

  const fetchRoleAssignments = async (examinationId: number) => {
    return axiosPrivate.get(`/role-assignments/examination/${examinationId}`);
  };

  const authorizeRoleAssignment = async (roleAssignmentId: number) => {
    return axiosPrivate.patch(
      `/role-assignments/${roleAssignmentId}/authorize`,
    );
  };

  const authorizeRoleByExamination = async (examinationId: number) => {
    try {
      const response = await axiosPrivate.patch(
        `/role-assignments/examination/${examinationId}/authorize`,
      );
      return response.data; // Assuming the response data includes the status and message
    } catch (error) {
      console.error('Error authorizing role by examination', error);
      throw error;
    }
  };

  const authorizeRoleByCourseAndPaperType = async (
    courseId: number,
    paperType: string,
  ) => {
    try {
      const response = await axiosPrivate.patch(
        `/role-assignments/course/${courseId}/paperType/${paperType}/authorize`,
      );
      return response.data; // Assuming the response data includes the status and message
    } catch (error) {
      console.error('Error authorizing role by course and paper type', error);
      throw error;
    }
  };

  const editRoleAssignment = async (
    roleAssignmentId: number,
    userId: number,
  ) => {
    try {
      const response = await axiosPrivate.put(
        `/role-assignments/${roleAssignmentId}?userId=${userId}`, // Pass userId as query param
      );
      return response.data;
    } catch (error) {
      console.error('Error editing role assignment', error);
      throw error;
    }
  };

  const getRoleAssignmentById = async (roleAssignmentId: number) => {
    try {
      const response = await axiosPrivate.get(
        `/role-assignments/${roleAssignmentId}`,
      );
      return response.data; // Assuming the response contains the role assignment data
    } catch (error) {
      console.error('Error fetching role assignment', error);
      throw error;
    }
  };

  const unassignRoleAssignment = async (roleAssignmentId: number) => {
    return axiosPrivate.delete(`/role-assignments/${roleAssignmentId}`);
  };
  const getUsersCounts = async () => {
    try {
      const response = await axiosPrivate.get('/user/count');
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error: any) {
      throw new Error(
        error.response.data.message || 'Failed to fetch users count',
      );
    }
  };

  const getActiveUsersCount = async () => {
    try {
      const response = await axiosPrivate.get('/user/activeUser');
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch active users count',
      );
    }
  };

  const getExaminationById = async (examinationId: number) => {
    try {
      const response = await axiosPrivate.get(
        `/academic-years/${examinationId}`,
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch examination',
      );
    }
  };
  const getDegreeProgramById = async (id: number) => {
    try {
      const response = await axiosPrivate.get(`degreePrograms/${id}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      throw new Error('failed to get degree names');
    }
  };
  const getAllExaminationDetailsWithDegreeName = async () => {
    try {
      const response = await axiosPrivate.get(
        'academic-years/getExaminationWithDegreeName',
      );
      if (response.data.code === 200) {
        return response.data.data;
      }
    } catch (error: any) {
      throw new Error('failed to fetch examinations name');
    }
  };

  const getCoursesUsingExaminationId = async (
    examinationId: number | undefined,
  ) => {
    try {
      const response = await axiosPrivate.get(
        'academic-years/getCoursesUsingExaminationId',
        {
          params: { examinationId: examinationId },
        },
      );
      if (response.data.code === 200) {
        return response.data.data;
      }
    } catch (error: any) {
      throw new Error('failed to fetch examinations name');
    }
  };

  const getArchivedPapers = async (page = 0, size = 10) => {
    return axiosPrivate.get(`/papers/archived`, { params: { page, size } });
  };

  const getArchivedPaperById = async (id: number) => {
    return axiosPrivate.get(`/papers/archived/${id}`);
  };

  const archivePapersManually = async () => {
    return axiosPrivate.post(`/papers/archive`);
  };

  const deleteArchivedPaper = async (id: number) => {
    return axiosPrivate.delete(`/papers/archived/${id}`);
  };

  const downloadArchivedPaper = async (id: number) => {
    return axiosPrivate.get(`/papers/archived/${id}/download`, {
      responseType: 'blob',
    });
  };

  const getExaminationsAllCourses = async (examinationId: number) => {
    return axiosPrivate.get(
      `academic-years/examinations/${examinationId}/allCourses`,
    );
  };

  const uploadArchivedPaper = async (
    file: File,
    uploadRequest: {
      fileName: string;
      remarks: string;
      creatorId: number;
      moderatorId: number;
      examinationId: number;
      courseId: number;
      paperType: string;
    },
  ) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', uploadRequest.fileName);
      formData.append('remarks', uploadRequest.remarks);
      formData.append('creatorId', uploadRequest.creatorId.toString());
      formData.append('moderatorId', uploadRequest.moderatorId.toString());
      formData.append('examinationId', uploadRequest.examinationId.toString());
      formData.append('courseId', uploadRequest.courseId.toString());
      formData.append('paperType', uploadRequest.paperType);

      const response = await axiosPrivate.post(
        `/papers/archived/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error uploading archived paper:', error);
      throw new Error('Failed to upload archived paper. Please try again.');
    }
  };

  

  const searchArchivedPapers = async (searchParams: {
    fileName?: string;
    creatorName?: string;
    moderatorName?: string;
    courseCode?: string;
    paperType?: string;
    degreeName?: string;
    year?: string;
    level?: string;
    semester?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }) => {
    try {
      // Build the query parameters dynamically
      const queryParams = new URLSearchParams(searchParams as any).toString();

      return axiosPrivate.get(`/papers/archived/search?${queryParams}`);
    } catch (error) {
      console.error('Error searching archived papers:', error);
      throw error;
    }
  };

  const getRoleAssignmentByUserId = async (userId: number) => {
    try {
      const response = await axiosPrivate.get(
        `/role-assignments/user/${userId}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to fetch role assignment');
    }
  };

  const updatePaperStatusAndFeedback = async (
    id: number,
    status: string,
    feedback: string,
  ) => {
    try {
      const response = await axiosPrivate.patch(
        `/moderation/${id}/update`,
        null,
        {
          params: { status, feedback },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getPaperStatus = async (paperId: number) => {
    try {
      const response = await axiosPrivate.get(`/papers/${paperId}/status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const reviseRoleAssignments = async (revisions: any) => {
    try {
      const response = await axiosPrivate.put(
        '/role-assignments/change-users',
        revisions,
      );
      return response.data;
    } catch (error) {
      console.error('Error revising role assignments:', error);
      throw error;
    }
  };

  const fetchRoleAssignmentRevisions = async (revisionId: number) => {
    try {
      const response = await axiosPrivate.get(
        `/role-assignments/revision/${revisionId}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching role assignment revisions:', error);
      throw error;
    }
  };

  const getExamTypes = async () => {
    try {
      const response = await axiosPrivate.get(`/result/examType`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getModerators = async (selectedCourse: any, paperType: any) => {
    try {
      const response = await axiosPrivate.get(
        `/role-assignments/moderators?courseId=${selectedCourse}&paperType=${paperType}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch moderators',
      );
    }
  };

  const downloadMarkingFile = async (
    id: number,
    moderatorId: number,
  ): Promise<void> => {
    try {
      const response = await axiosPrivate.post(
        '/papers/download-marking',
        { id, moderatorId }, // Send data in the request body
        { responseType: 'blob' },
      );
  
      // Extract filename from the Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'marking.pdf';
      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = decodeURIComponent(matches[1]);
        }
      }
  
      // Create a Blob from the response data
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
  
      if (!blob || blob.size === 0) {
        throw new Error('No data returned from the server.');
      }
  
      // Create a temporary URL for the Blob and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to download marking file');
      throw new Error(
        error?.response?.data?.message || 'Failed to download marking file',
      );
    }
  };

  const fetchEncryptedMarking = async (paperId: number, moderatorId: number): Promise<{ data: Blob }> => {
    try {
      const response = await axiosPrivate.post(
        '/papers/view-marking',
        { id: paperId, moderatorId }, // Send data in the request body
        { responseType: 'blob' },
      );
  
      // Extract filename from the Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
        }
      }
  
      // Create a Blob from the response data
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
  
      if (!blob || blob.size === 0) {
        throw new Error('No data returned from the server.');
      }
  
      // // Create a temporary URL for the Blob and open it in a new tab
      // const url = window.URL.createObjectURL(blob);
      // window.open(url, '_blank');
      // window.URL.revokeObjectURL(url); // Clean up the URL object

      return { data: blob };
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to fetch marking file');
      throw new Error(
        error?.response?.data?.message || 'Failed to fetch marking file',
      );
    }
  };

  const getGradesConditionsValues=async (courseCode:string)=>{
    try{
        const response=await axiosPrivate.get('grading/marksPercentage',
          {
            params: {courseCode}
          }
        );
        return response.data;
    }
    catch(error:any){
      setError(error?.response?.data?.message || 'Failed to fetch grades conditions values');
      throw new Error(
        error?.response?.data?.message || 'Failed to fetch grades conditions values',
      );
    }
  }

  return {
    uploadFile,
    getAllFiles,
    downloadFile,
    deleteFile,
    updateFile,
    getStructureData,
    fetchUsers,
    deleteUser,
    updateUserStatus,
    updateUserWithRoles,
    fetchAllRoles,
    getUserById,
    createUserWithRoles,
    fetchAllPermissions,
    deleteRole,
    createRole,
    updateRole,
    getRoleById,
    getUserProfile,
    getProfileImage,
    updateUserProfile,
    updateProfileImage,
    deleteProfileImage,
    getDegreePrograms,
    getExaminations,
    deleteExamination,
    createExamination,
    updateExamination,
    createPaperStructure,
    updatePaperStructure,
    deletePaperStructure,
    deleteSubQuestion,
    deleteSubSubQuestion,
    getPaperStructure,
    fetchEncryptedPaper,
    createModeration,
    getPapers,
    getCoursesByDegreeProgramId,
    saveTemplate,
    getAllTemplates,
    getTemplateById,
    getTemplates,
    deleteTemplate,
    getExaminationsCourses,
    createRoleAssignment,
    fetchRoleAssignments,
    authorizeRoleAssignment,
    unassignRoleAssignment,
    getUsersCounts,
    getActiveUsersCount,
    authorizeRoleByExamination,
    authorizeRoleByCourseAndPaperType,
    editRoleAssignment,
    getRoleAssignmentById,
    getExaminationById,
    getDegreeProgramById,
    getAllExaminationDetailsWithDegreeName,
    getCoursesUsingExaminationId,
    getArchivedPapers,
    getArchivedPaperById,
    archivePapersManually,
    deleteArchivedPaper,
    downloadArchivedPaper,
    uploadArchivedPaper,
    loading,
    error,
    createDegreeProgram,
    deleteDegreeProgram,
    searchArchivedPapers,
    getExaminationsAllCourses,
    getRoleAssignmentByUserId,
    updatePaperStatusAndFeedback,
    getPaperStatus,
    reviseRoleAssignments,
    fetchRoleAssignmentRevisions,
    getExamTypes,
    getModerators,
    getPaperById,
    downloadMarkingFile,
    fetchEncryptedMarking,
    getGradesConditionsValues
  };
};

export default useApi;
