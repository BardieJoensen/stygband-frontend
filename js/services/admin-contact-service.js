import { authUpdateJson } from "../api.js";

export function updateContactInfo(contactData) {
    return authUpdateJson("/api/admin/contact-info", contactData);
}
