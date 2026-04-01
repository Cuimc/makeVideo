export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PagingParams {
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.code === 'number' &&
    typeof record.message === 'string' &&
    'data' in record
  );
}
