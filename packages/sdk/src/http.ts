import axios from 'axios';
import { isApiResponse, type ApiResponse } from '@make-video/shared';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestConfig {
  url: string;
  method?: HttpMethod;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface HttpClient {
  request<T>(config: HttpRequestConfig): Promise<T>;
  get<T>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<T>;
  post<T>(url: string, data?: unknown, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>): Promise<T>;
  put<T>(url: string, data?: unknown, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>): Promise<T>;
  delete<T>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<T>;
}

export interface CreateHttpClientOptions {
  baseUrl: string;
  getToken?: () => string | null;
  onUnauthorized?: () => void;
  timeout?: number;
  transport?: (config: HttpRequestConfig) => Promise<{ data: unknown }>;
  mock?: boolean;
}

function unwrapPayload<T>(payload: unknown): T {
  if (isApiResponse<unknown>(payload)) {
    const envelope = payload as ApiResponse<T>;

    if (envelope.code !== 0) {
      throw new Error(envelope.message || 'Request failed');
    }

    return envelope.data;
  }

  return payload as T;
}

function normalizeError(error: unknown, onUnauthorized?: () => void) {
  if (typeof error === 'object' && error !== null) {
    const record = error as {
      message?: string;
      response?: {
        status?: number;
        data?: {
          message?: string;
        };
      };
    };

    if (record.response?.status === 401) {
      onUnauthorized?.();
    }

    if (record.response?.data?.message) {
      return new Error(record.response.data.message);
    }

    if (record.message) {
      return new Error(record.message);
    }
  }

  return new Error('Request failed');
}

export function createHttpClient(options: CreateHttpClientOptions): HttpClient {
  const instance = options.transport
    ? null
    : axios.create({
        baseURL: options.baseUrl.replace(/\/$/, ''),
        timeout: options.timeout ?? 15_000,
      });

  async function request<T>(config: HttpRequestConfig) {
    const token = options.getToken?.();
    const headers: Record<string, string> = {
      ...(config.headers ?? {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const requestConfig: HttpRequestConfig = {
      method: config.method ?? 'GET',
      timeout: config.timeout ?? options.timeout ?? 15_000,
      ...config,
      headers,
    };

    try {
      const response = options.transport
        ? await options.transport(requestConfig)
        : await instance!.request({
            url: requestConfig.url,
            method: requestConfig.method,
            params: requestConfig.params,
            data: requestConfig.data,
            headers: requestConfig.headers,
            timeout: requestConfig.timeout,
          });

      return unwrapPayload<T>(response.data);
    } catch (error) {
      throw normalizeError(error, options.onUnauthorized);
    }
  }

  return {
    request,
    get(url, config) {
      return request({ ...config, url, method: 'GET' });
    },
    post(url, data, config) {
      return request({ ...config, url, data, method: 'POST' });
    },
    put(url, data, config) {
      return request({ ...config, url, data, method: 'PUT' });
    },
    patch(url, data, config) {
      return request({ ...config, url, data, method: 'PATCH' });
    },
    delete(url, config) {
      return request({ ...config, url, method: 'DELETE' });
    },
  };
}
