import { authDelete, authPostJson, authUpdateJson, } from "../api.js";

export function createShow(showData) {
  return authPostJson(`/api/admin/shows`, showData);
}

export function deleteShowById(showId) {
  return authDelete(`/api/admin/shows/${showId}`);
}

export function updateShowById(showId, showData) {
  return authUpdateJson(`/api/admin/shows/${showId}`, showData);
}
