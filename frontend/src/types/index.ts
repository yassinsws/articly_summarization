export interface User {
  id: number;
  username: string;
  email: string;
  jwt?: string;
}

export interface Task {
  id: number;
  documentId: string;
  long_text: string;
  summary?: string;
  approved?: boolean | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  locale: string;
  localizations: any[];
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface TasksResponse {
  data: Task[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}