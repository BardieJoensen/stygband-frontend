import {authDeleteJson, authPostJson, authUpdateJson,} from "../api.js";

export function createShow(showData) {
  return authPostJson(`/api/admin/shows`, showData);
}

export function deleteShowById(showId) {
  return authDeleteJson(`/api/admin/shows/${showId}`);
}

export function editShowById(showId, showData) {
  return authUpdateJson(`/api/admin/shows/${showId}`, showData);
}
