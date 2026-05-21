import { fetchJson, authPostFormData } from "../api.js";

export function getPhotos(showId = null) {
    let url = '/api/photos';

    // Add optional filtering
    if (showId) {
        url += `?showId=${encodeURIComponent(showId)}`;
    }

    return fetchJson(url);
}

export function getRecentPhotos(limit = 6) {
    const url = `/api/photos/recent?limit=${encodeURIComponent(limit)}`;
    return fetchJson(url);
}

export async function uploadPhotos(files) {
    const formData = new FormData();
    for (const file of files) {
        formData.append("files", file);
    }

    return authPostFormData("/api/admin/photos", formData);
}
