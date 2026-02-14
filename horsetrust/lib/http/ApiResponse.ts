export interface ApiResponse<T = unknown> {
  ok: boolean;
  statusCode: number;
  message: string;
  data?: T;
  code?: string;
}
