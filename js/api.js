const isLocalhost =
    globalThis.location.hostname === "localhost" ||
    globalThis.location.hostname === "127.0.0.1";

// Use the local backend during development and a relative base in production.
export const BASE_URL = isLocalhost ? "http://localhost:8080" : "";

async function request(endpoint, options = {}, useAuth = false) {
    // Build the final URL and headers before making the fetch call.
    const url = `${BASE_URL}${endpoint}`;
    const headers = buildHeaders(options, useAuth);

    const fetchOptions = {
        ...options,
        headers
    };

    let response;
    try {
        response = await fetch(url, fetchOptions);
    } catch (err) {
        throw new Error(`Network error: ${err.message}`);
    }

    // Redirect authenticated requests to login when the token is rejected.
    if (!response.ok && response.status === 401 && useAuth) {
        globalThis.location.hash = "#/admin";
    }

    // Convert non-success responses into a readable error message.
    if (!response.ok) {
        throw new Error(await buildErrorMessage(response));
    }

    // Return the response in the most useful format for the caller.
    return parseResponseBody(response);
}

function buildHeaders(options, useAuth) {
    const headers = { ...options.headers };

    // Attach the bearer token when the request requires authentication.
    if (useAuth) {
        const token = localStorage.getItem("token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    // Default JSON requests to application/json when a body is present.
    if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}

async function buildErrorMessage(response) {
    let errorMessage = `Error ${response.status}`;
    const contentType = response.headers.get("Content-Type");

    // Prefer server-provided JSON error details when available.
    if (contentType?.includes("application/json")) {
        const error = await response.json().catch(() => null);
        if (!error) return errorMessage;
        return error.message ?? JSON.stringify(error);
    }

    // Fall back to plain text or the generic status message.
    const text = await response.text().catch(() => "");
    return text || errorMessage;
}

async function parseResponseBody(response) {
    // No-content responses resolve to null so callers can handle them explicitly.
    if (response.status === 204) return null;

    const contentType = response.headers.get("Content-Type");
    // Non-JSON responses are returned as text for flexibility.
    if (!contentType?.includes("application/json")) {
        return await response.text() || null;
    }

    // Parse JSON payloads and surface malformed JSON as a clear error.
    try {
        return await response.json();
    } catch (err) {
        throw new Error(`Invalid JSON: ${err.message}`);
    }
}

// -------------------------------
// Public JSON helpers
// -------------------------------

// Simple read helper for endpoints that return JSON.
export function fetchJson(endpoint) {
    return request(endpoint);
}

// Write helper that serializes the payload as JSON before sending it.
export async function postJson(endpoint, data, method = "POST") {
    return request(endpoint, {
        method,
        body: JSON.stringify(data)
    });
}

// -------------------------------
// Admin JSON helpers
// -------------------------------

export function authFetchJson(endpoint) {
    return request(endpoint, {}, true);
}

export function authPostJson(endpoint, data, method = "POST") {
    return request(endpoint, {
        method,
        body: JSON.stringify(data)
    }, true);
}

export function authUpdateJson(endpoint, data) {
    return authPostJson(endpoint, data, "PUT");
}

export function authDeleteJson(endpoint) {
    return request(endpoint, { method: "DELETE" }, true);
}