import { authUpdateJson, authPostFormData } from "../api.js";

export function updateBandMember(id, data) {
    return authUpdateJson(`/api/admin/band-members/${id}`, data);
}

export function updateBandMemberPhoto(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    return authPostFormData(`/api/admin/band-members/${id}/photo`, formData);
}
