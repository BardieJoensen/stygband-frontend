import { fetchJson } from "../api.js";

export function getBandMembers() {
  return fetchJson('/api/band-members');
}