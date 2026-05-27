import { fetchJson } from "../api.js";

export function getBandMembers() {
  return fetchJson('/api/band-members');
}

export function getBandMemberById(id) {
  return fetchJson(`/api/band-members/${id}`);
}