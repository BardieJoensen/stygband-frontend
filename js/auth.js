import { postJson } from "./api.js";

// Decode a JWT and return its payload as an object.
// JWTs are in the form "header.payload.signature" where the payload
// is base64url-encoded JSON. This function handles the URL-safe
// base64 alphabet ("-" and "_") and returns null on any error.
function decodeJwt(token) {
    try {
        const payload = token.split(".")[1];
        // atob expects standard base64, so convert from base64url
        // ('-' -> '+', '_' -> '/') before decoding.
        return JSON.parse(atob(payload.replaceAll('-', "+").replaceAll('_', "/")));
    } catch (e) {
        // If the token is malformed (or decoding fails), return null.
        return null;
    }
}

// Retrieve the stored token from localStorage and ensure it's not expired.
// If the token is missing or expired the function returns null.
export function getToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    // If the token has expired, remove it to avoid reusing a stale token.
    if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        return null;
    }
    return token;
}

// Convenience accessor to get the current username from the token.
// The `sub` claim is commonly used to store the principal/username.
export function getCurrentUsername() {
    const token = getToken();
    if (!token) return null;
    const decoded = decodeJwt(token);
    return decoded?.sub;
}

// Check whether the token's `exp` claim (expiration time in seconds)
// is in the past. If the claim is missing, treat the token as expired.
function isTokenExpired(token) {
    const decoded = decodeJwt(token);
    if (!decoded?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp <= now;
}

// Perform login: send credentials to the API, store returned token,
// and broadcast an `authChanged` event so other parts of the app can react.
export async function login(username, password) {
    const data = await postJson(`/api/auth/login`, { username, password });
    // Expecting an object like { token: '...' } from the server.
    if (!data?.token || typeof data.token !== "string") {
        throw new Error("Login response did not include a valid token");
    }
    localStorage.setItem("token", data.token);
    window.dispatchEvent(new Event('authChanged'));
}

// Logout: remove token, notify listeners, and navigate to the admin route.
export function logout() {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event('authChanged'));
    // Redirecting to `#/admin` keeps the routing logic in the client.
    window.location.hash = "#/admin";
}

// Simple boolean helper that indicates whether a valid token exists.
export function isLoggedIn() {
    const token = getToken();
    return !!token;
}
