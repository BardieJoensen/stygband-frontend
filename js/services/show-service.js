import { fetchJson } from "../api.js";

export function getUpcomingShows() {
  return fetchJson('/api/shows/upcoming');
}

export function getPastShows() {
  return fetchJson('/api/shows/past');
}

export function getShowById(showId) {
  return fetchJson(`/api/shows/${showId}`);
}