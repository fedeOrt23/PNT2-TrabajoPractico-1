const DEFAULT_MOCK_API_BASE =
  "https://690160fdff8d792314bd3f83.mockapi.io/api/v1/";

const MOCK_API_BASE_URL = (() => {
  const envBase =
    process.env.NEXT_PUBLIC_MOCKAPI_BASE_URL?.trim() ||
    process.env.MOCKAPI_BASE_URL?.trim();
  const base = envBase?.length ? envBase : DEFAULT_MOCK_API_BASE;
  return base.endsWith("/") ? base : `${base}/`;
})();

function buildMockApiUrl(pathname = "", searchParams) {
  const trimmedPath = typeof pathname === "string" ? pathname.trim() : "";
  const isAbsolute = /^https?:\/\//i.test(trimmedPath);
  const normalizedPath = trimmedPath.startsWith("/")
    ? trimmedPath.slice(1)
    : trimmedPath;

  const url = isAbsolute
    ? new URL(trimmedPath)
    : new URL(normalizedPath, MOCK_API_BASE_URL);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function mockApiFetch(
  pathname,
  { method = "GET", body, headers, searchParams, ...rest } = {}
) {
  const url = buildMockApiUrl(pathname, searchParams);

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const isUrlParams =
    typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams;

  let requestBody = body;
  if (body && !isFormData && !isUrlParams) {
    if (!requestHeaders["Content-Type"]) {
      requestHeaders["Content-Type"] = "application/json";
    }
    if (requestHeaders["Content-Type"]?.includes("application/json")) {
      requestBody = typeof body === "string" ? body : JSON.stringify(body);
    }
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: requestBody,
    cache: "no-store",
    next: { revalidate: 0 },
    ...rest,
  });

  if (response.ok) {
    if (response.status === 204) {
      return null;
    }
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    return response.text();
  }

  const details = await response.text();
  throw new Error(
    `MockAPI request failed: ${response.status} ${response.statusText} | ${method} ${url} | details=${details}`
  );
}

export { buildMockApiUrl, MOCK_API_BASE_URL };
