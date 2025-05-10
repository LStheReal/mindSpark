// API utilities for making requests to the backend

export async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Makes a request to the API
 * @param method HTTP method
 * @param url API endpoint
 * @param data Optional data to send
 * @returns Response object
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

/**
 * Utility to get data from the API as JSON
 * @param url API endpoint
 * @returns Parsed JSON response
 */
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
  });
  
  await throwIfResNotOk(res);
  return await res.json();
}

/**
 * Create a new resource
 * @param url API endpoint
 * @param data Data to create
 * @returns Created resource
 */
export async function createResource<T>(url: string, data: unknown): Promise<T> {
  const res = await apiRequest("POST", url, data);
  return await res.json();
}

/**
 * Update an existing resource
 * @param url API endpoint
 * @param data Data to update
 * @returns Updated resource
 */
export async function updateResource<T>(url: string, data: unknown): Promise<T> {
  const res = await apiRequest("PATCH", url, data);
  return await res.json();
}

/**
 * Delete a resource
 * @param url API endpoint
 * @returns Delete response
 */
export async function deleteResource(url: string): Promise<void> {
  await apiRequest("DELETE", url);
}
