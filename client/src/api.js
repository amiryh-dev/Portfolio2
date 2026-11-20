export const apiBaseUrl = import.meta.env.VITE_API_URL || "";

export async function apiRequest(path, { headers, token, ...options } = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...options,
  });
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const error = new Error(
      (data && data.error) || "The request could not be completed.",
    );
    error.status = response.status;
    throw error;
  }
  return data;
}
