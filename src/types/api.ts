export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total?: number;
  };
}

export interface ApiFailure {
  success: false;
  data: null;
  message: string;
  errorCode?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
