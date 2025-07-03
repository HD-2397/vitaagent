/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */


export interface FetchResult<T> {
  data: T | null;
  error: string | null;
}

export async function fetchWithErrorHandling<T = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<FetchResult<T>> {
  try {
    const res = await fetch(input, init);
    const data = await res.json();

    if (!res.ok) {
      return {
        data: null,
        error: data.error || `Request failed with status ${res.status}`,
      };
    }

    return { data, error: null };
  } catch (err : any) {
    return {
      data: null,
      error: err.message || "Unexpected network error",
    };
  }
}
