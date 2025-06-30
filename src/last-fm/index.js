import getRecentTracks from "./user/getRecentTracks";
import getTopArtists from "./user/getTopArtists";

const API_BASE = `https://ws.audioscrobbler.com/2.0/`;

export function buildUrl(method, params) {
  let options = {
    ...params,
    method,
    format: "json",
  };

  const searchParams = new URLSearchParams(options);
  const url = `${API_BASE}?${searchParams.toString()}`;

  return url;
}

export { getRecentTracks, getTopArtists };
