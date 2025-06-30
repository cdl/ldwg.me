import { getRecentTracks, getTopArtists } from "../../src/last-fm";

const LASTFM_USERNAME = "rckts";
const LASTFM_CACHE_TTL = 60 * 5; // 5 min
const LASTFM_RECENT_TRACKS_LIMIT = 20;
const LASTFM_TOP_ARTISTS_LIMIT = 5;

const { LASTFM_API_KEY } = process.env;

// For parsing JSON out from fetch() requests.
async function parseJsonResponse(res) {
  const { headers } = res;
  const contentType = headers.get("Content-Type") || "";

  if (contentType === "application/json") {
    return await res.json();
  } else {
    return res.text();
  }
}

/**
 * Parse a given Last.fm track object into something more sensible.
 * @param {Object} track The track object instance returned from Last.fm.
 */
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

  // Get an image for the artist from the MusicBrainz API with the artists' MBID.
  return { url, name, playcount: parseInt(playcount) };
}

// Fetch the top tracks for the user, parse them out if a valid response is returned,
// and return them as formatted JSON objects.
export default async function getLastFmInfo(request, response) {
  // Try to fetch the tracks, failing early if anything weird happens
  // (the client will re-attempt to load it later).
  try {
    const res = await getRecentTracks({
      apiKey: LASTFM_API_KEY,
      user: LASTFM_USERNAME,
      cf: { cacheTtl: LASTFM_CACHE_TTL }, // Pass forward a cacheTtl to speed up repeated requests.
      limit: LASTFM_RECENT_TRACKS_LIMIT,
    });

    // Parse out JSON, then massage the track objects into just the data we need.
    const recentTracksJson = await parseJsonResponse(res);
    if (recentTracksJson?.recenttracks == null) {
      console.error("no tracks returned, got response:", recentTracksJson);
      throw new Exception("no tracks returned");
    }

    // Get the top artists for the user over the past week.
    const topArtistsResponse = await getTopArtists({
      apiKey: LASTFM_API_KEY,
      user: LASTFM_USERNAME,
      limit: LASTFM_TOP_ARTISTS_LIMIT,
      period: "7day",
      cf: { cacheTtl: LASTFM_CACHE_TTL },
    });

    /** @type {Object} */
    const topArtistsJson = await parseJsonResponse(topArtistsResponse);
    if (topArtistsJson?.topartists == null) {
      throw new Exception("no artists returned");
    }

    // Grab the maximum play count out of all the artists.
    const maxPlays = topArtistsJson.topartists.artist.reduce(
      (prev, current) => {
        const c = parseInt(current.playcount);
        return c > prev ? c : prev;
      },
      0,
    );

    const artists = topArtistsJson.topartists.artist.map(parseArtistObject);
    const recentTracks =
      recentTracksJson.recenttracks.track.map(parseTrackObject);

    const payload = {
      recentTracks,
      topArtists: { maxPlays, artists },
    };

    return response.status(200).json(payload);
  } catch (err) {
    // Something weird happened -- return a generic error message and log the full details.
    console.error(err);
    return response.status(500).json("error fetching from lastfm");
  }
}
