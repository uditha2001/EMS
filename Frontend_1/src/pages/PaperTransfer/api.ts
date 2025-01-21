import { useState } from 'react';
import { Paper } from '../../types/transferpaper';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

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
    academicYearId: number,
  ): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('creatorId', creatorId.toString());
    formData.append('moderatorId', moderatorId.toString());
    formData.append('remarks', remarks);
    formData.append('academicYearId', academicYearId.toString());

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
  const updateFile = async (
    fileId: number, // ID of the file being updated
    file: File, // New file data
    remarks: string, // Updated remarks
  ): Promise<{ message: string }> => {
    // Check if file is valid
    if (!file) {
      setError('File is required.');
      return Promise.reject(new Error('File is required.'));
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('remarks', remarks);

    try {
      setLoading(true);
      const res = await axiosPrivate.put(`/papers/${fileId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      return res.data.data; // Assuming res.data.data contains the message
    } catch (error: any) {
      setLoading(false);
      // More robust error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update the file';
      setError(errorMessage);
      throw new Error(errorMessage);
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

  return {
    uploadFile,
    getAllFiles,
    downloadFile,
    deleteFile,
    updateFile,
    getStructureData,
    loading,
    error,
  };
};

export default useApi;
