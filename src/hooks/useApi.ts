import { useState, useCallback } from 'react';
import api from '../lib/api';
import { AxiosRequestConfig } from 'axios';

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (method: 'get' | 'post' | 'put' | 'delete', url: string, body?: any, config?: AxiosRequestConfig) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api({
          method,
          url,
          data: body,
          ...config,
        });
        setData(response.data.data);
        return response.data.data;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'An error occurred';
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { data, isLoading, error, request, setData };
}
