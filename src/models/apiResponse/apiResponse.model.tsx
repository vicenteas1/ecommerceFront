export type ApiResponse<T = unknown> = {
  message: string;
  code: number;
  data: T | null;
};
