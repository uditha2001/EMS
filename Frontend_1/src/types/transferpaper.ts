export interface EncryptedPaper {
    id: number;
    fileName: string;
    encryptedData: string;
    sharedAt?: string; 
    fileType?: string; 
    courseCode?: string;
    remarks?: string;   
  }
  