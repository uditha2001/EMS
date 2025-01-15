export interface PaperResponse {
  code: number;                    // Response status code
  message: string;                 // Response message
  data: Paper[];                   // Array of Paper objects
}

export interface Paper {
  id: number;                      // Unique identifier for the paper
  fileName: string;                // Name of the file
  courseIds: number[];              // Associated course code
  remarks: string | null;          // Remarks about the paper (nullable)
  sharedAt: string;                // Date and time the paper was shared
  creator: User;                   // Creator details
  moderator: User;                 // Moderator details
  shared: boolean;                 // Whether the paper is shared
}

export interface User {
  id: number;                      // User ID
  firstName: string;               // First name of the user
  lastName: string;                // Last name of the user
}
