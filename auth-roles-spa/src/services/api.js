const baseUrl = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:5188').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { token, method = 'GET', body, signal } = {}) {
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(baseUrl + path, {
      method, headers, signal, body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError(0, 'No pudimos conectar con la API. Comprueba que el backend esté iniciado.');
  }

  if (response.status === 204) return;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, data?.detail ?? data?.title ?? `Error HTTP ${response.status}.`);
  }

  return data;
}
