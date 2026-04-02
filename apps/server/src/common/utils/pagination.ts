import type { PagedResult } from '@make-video/shared';

export interface PagingInput {
  page?: number | string;
  pageSize?: number | string;
}

export interface PagingOptions {
  defaultPage?: number;
  defaultPageSize?: number;
  maxPageSize?: number;
}

export interface NormalizedPaging {
  page: number;
  pageSize: number;
}

export function normalizePaging(
  input: PagingInput,
  options: PagingOptions = {},
): NormalizedPaging {
  const defaultPage = options.defaultPage ?? 1;
  const defaultPageSize = options.defaultPageSize ?? 20;
  const maxPageSize = options.maxPageSize ?? 100;

  const page = normalizePositiveInt(input.page, defaultPage);
  const pageSize = Math.min(
    normalizePositiveInt(input.pageSize, defaultPageSize),
    maxPageSize,
  );

  return {
    page,
    pageSize,
  };
}

export function paginateItems<T>(
  items: T[],
  paging: PagingInput,
): PagedResult<T> {
  const normalized = normalizePaging(paging);
  const start = (normalized.page - 1) * normalized.pageSize;
  const pagedItems = items.slice(start, start + normalized.pageSize);

  return {
    items: pagedItems,
    total: items.length,
    page: normalized.page,
    pageSize: normalized.pageSize,
  };
}

function normalizePositiveInt(
  value: number | string | undefined,
  fallback: number,
) {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseInt(value, 10)
        : Number.NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}
