import axios from 'axios';
import { EncryptedPaper } from '../../types/transferpaper';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = {
  uploadFile: (
    file: File,
    creatorId: number,
    courseCode: string,
    remarks : string,
    moderatorId: number
  ): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('creatorId', creatorId.toString());
    formData.append('moderatorId', moderatorId.toString()); 
    formData.append('courseCode', courseCode);
    formData.append('remarks', remarks);
    return axios
      .post(`${API_BASE_URL}/papers/upload`, formData)
      .then((res) => res.data.data)
      .catch((error) => {
        console.error('Upload failed:', error);
        throw new Error(
          error?.response?.data?.message || 'Failed to upload the file',
        );
      });
  },

  getAllFiles: (): Promise<EncryptedPaper[]> =>
    axios
      .get(`${API_BASE_URL}/papers`)
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          return res.data.data; // Directly return the array of EncryptedPaper objects
        } else {
          throw new Error('Unexpected data format.');
        }
      })
      .catch((error) => {
        console.error('Fetching files failed:', error);
        throw new Error(
          error?.response?.data?.message || 'Failed to fetch files',
        );
      }),

  downloadFile: async (id: number, moderatorId: number): Promise<void> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/papers/download/${id}?moderatorId=${moderatorId}`,
        {
          responseType: 'blob', // Ensures the response is treated as binary data
        },
      );

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'file.pdf'; // Default filename

      if (contentDisposition) {
        // Extract the filename from content-disposition header
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = decodeURIComponent(matches[1]); // Decode for special characters
        }
      }

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });

      // Validate blob data
      if (!blob || blob.size === 0) {
        throw new Error('No data returned from the server.');
      }

      // Trigger file download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error in downloadFile:', error);

      // Extract detailed error message
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        'Unknown error occurred.';
      throw new Error(`Failed to download file: ${errorMessage}`);
    }
  },

  deleteFile: (id: number): Promise<{ message: string }> =>
    axios
      .delete(`${API_BASE_URL}/papers/${id}`)
      .then((res) => res.data.data)
      .catch((error) => {
        console.error('Delete failed:', error);
        throw new Error(
          error?.response?.data?.message || 'Failed to delete the file',
        );
      }),

  getPublicKey: (userId: number): Promise<string> =>
    axios
      .get(`${API_BASE_URL}/papers/public-key?userId=${userId}`)
      .then((res) => {
        if (res.data && res.data.data) {
          return res.data.data; // Ensure you're returning the public key from the response's `data` property
        }
        throw new Error('No public key found in response');
      })
      .catch((error) => {
        console.error('Fetching public key failed:', error);
        throw new Error(
          error?.response?.data?.message || 'Failed to fetch public key',
        );
      }),
};

export default api;
