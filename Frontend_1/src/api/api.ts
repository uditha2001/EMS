import { useState } from 'react';
import { Paper } from '../types/transferpaper';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useApi = () => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    creatorId: number,
    courseIds: number[],
    remarks: string,
    moderatorId: number,
    examinationId: number,
  ): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('creatorId', creatorId.toString());
    formData.append('moderatorId', moderatorId.toString());
    formData.append('remarks', remarks);
    formData.append('examinationId', examinationId.toString());

    // Log courseIds to verify
    console.log('Selected Course IDs:', courseIds);

    // Append courseIds individually
    courseIds.forEach((courseId) =>
      formData.append('courseIds', courseId.toString()),
    );

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
    remarks: string,
  ): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
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
    return axiosPrivate.get(
      `papers/view/${paperId}?moderatorId=${moderatorId}`,
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

  const getUsersCounts = async () => {
    try{
      const response=await axiosPrivate.get('/user/count');
      if(response.status===200){
        return response.data.data;
      }
    }
    catch(error:any){
      throw new Error(error.response?.data?.message || 'Failed to fetch users count');
    }

  }

  const getActiveUsersCount = async () => {
    try{
        const response=await axiosPrivate.get('/user/activeUser');
        if(response.status===200){
          return response.data.data;
        }
    }
    catch(error:any){
      throw new Error(error.response?.data?.message || 'Failed to fetch active users count');
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
    getUsersCounts,
    getActiveUsersCount,
    loading,
    error,
  };
};

export default useApi;
