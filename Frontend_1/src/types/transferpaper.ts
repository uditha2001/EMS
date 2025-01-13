export interface EncryptedPaper {
    id: number;
    fileName: string;
    encryptedData: string;
    sharedAt?: string;  // Optional date when the paper was uploaded
    fileType?: string;    // Optional field for file type (e.g., 'pdf', 'docx')
  }
  