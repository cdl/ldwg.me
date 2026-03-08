import { getRecentTracks, getTopArtists } from "./index";

const LASTFM_USERNAME = "rckts";
const LASTFM_RECENT_TRACKS_LIMIT = 20;
const LASTFM_TOP_ARTISTS_LIMIT = 5;

const { LASTFM_API_KEY } = process.env;

async function parseJsonResponse(res) {
  const contentType = res.headers.get("Content-Type") || "";
  if (contentType === "application/json") {
    return await res.json();
  }
  return res.text();
}

function parseTrackObject(track) {
  return {
    name: track.name,
    artist: track.artist["#text"],
    album: track.album["#text"],
    artworkUrl: track.image[0]["#text"],
    playedAt: (track.date && track.date["uts"]) || "currently playing",
  };
}

function parseArtistObject(artist) {
  const { name, playcount, url } = artist;
  return { url, name, playcount: parseInt(playcount) };
}

export default async function fetchLastFmData() {
  const [recentTracksRes, topArtistsRes] = await Promise.all([
    getRecentTracks({
      apiKey: LASTFM_API_KEY,
      user: LASTFM_USERNAME,
      limit: LASTFM_RECENT_TRACKS_LIMIT,
    }),
    getTopArtists({
      apiKey: LASTFM_API_KEY,
      user: LASTFM_USERNAME,
      limit: LASTFM_TOP_ARTISTS_LIMIT,
      period: "1month",
    }),
  ]);

  const recentTracksJson = await parseJsonResponse(recentTracksRes);
  if (recentTracksJson?.recenttracks == null) {
    console.error("no tracks returned, got response:", recentTracksJson);
    throw new Error("no tracks returned");
  }

  const topArtistsJson = await parseJsonResponse(topArtistsRes);
  if (topArtistsJson?.topartists == null) {
    throw new Error("no artists returned");
  }

  const maxPlays = topArtistsJson.topartists.artist.reduce((prev, current) => {
    const c = parseInt(current.playcount);
    return c > prev ? c : prev;
  }, 0);

  const artists = topArtistsJson.topartists.artist.map(parseArtistObject);
  const recentTracks =
    recentTracksJson.recenttracks.track.map(parseTrackObject);

  return {
    recentTracks,
    topArtists: { maxPlays, artists },
  };
}
