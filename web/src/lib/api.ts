const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const apiFetch = async <T>(
  input: string,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${input}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new ApiError(response.status, payload || response.statusText);
  }

  return response.json() as Promise<T>;
};
