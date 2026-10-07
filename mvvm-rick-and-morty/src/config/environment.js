export function loadEnvironment(env) {
  const rawApiBaseUrl = env?.VITE_API_BASE_URL?.trim();

  if (!rawApiBaseUrl) {
    throw new Error(
      "VITE_API_BASE_URL is required. Copy .env.example to .env and configure it.",
    );
  }

  let apiUrl;

  try {
    apiUrl = new URL(rawApiBaseUrl);
  } catch {
    throw new Error("VITE_API_BASE_URL must be a valid URL.");
  }

  if (!["http:", "https:"].includes(apiUrl.protocol)) {
    throw new Error("VITE_API_BASE_URL must use HTTP or HTTPS.");
  }

  return Object.freeze({
    apiBaseUrl: apiUrl.toString().replace(/\/$/, ""),
  });
}
