export default interface ApiResponse<T> {
  status: number;
  statusCode: number;
  message: string;
  metadata?: {
    total: number;
    page: number;
    limit: number;
  };
  data?: T;
  error?: T;
}
