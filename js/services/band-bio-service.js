import { authUpdateJson, fetchJson } from "../api.js";

export function getBandBio() {
    return fetchJson('/api/band-bio');
}

export function updateBandBio(content) {
    return authUpdateJson('/api/admin/band-bio', { content });
}
