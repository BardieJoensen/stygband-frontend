import { fetchJson, authPostFormData, authUpdateJson, authPatchJson, authDelete } from "../api.js";

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

export async function uploadPhotos(files, meta = {}) {
    const formData = new FormData();

    // Files
    for (const file of files) {
        formData.append("files", file);
    }

    // Optional metadata
    if (meta.caption) {
        formData.append("caption", meta.caption);
    }
    if (meta.photographer) {
        formData.append("photographer", meta.photographer);
    }
    if (meta.dateTaken) {
        formData.append("dateTaken", meta.dateTaken); // must be yyyy-mm-dd
    }
    if (meta.showId != null && meta.showId !== "") {
        formData.append("showId", meta.showId);
    }

    return authPostFormData("/api/admin/photos", formData);
}

export function updatePhotoById(photoId, photoData) {
    return authUpdateJson(`/api/admin/photos/${encodeURIComponent(photoId)}`, photoData);
}

export function batchUpdatePhotos(updates) {
    return authPatchJson("/api/admin/photos", updates);
}

export async function deletePhoto(photoId) {
    return authDelete(`/api/admin/photos/${encodeURIComponent(photoId)}`);
}
