import { getRecentTracks } from "../../src/last-fm";

const LASTFM_USERNAME = "rckts";
const LASTFM_TRACK_LIMIT = 20;
const LASTFM_CACHE_TTL = 60 * 5; // 5 min

// For parsing JSON out from fetch() requests.
async function parseResponse(res) {
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

// Fetch the top tracks for the user, parse them out if a valid response is returned,
// and return them as formatted JSON objects.
export async function onRequestPost(context) {
  const { env } = context;

  // Try to fetch the tracks, failing early if anything weird happens
  // (the client will re-attempt to load it later).
  try {
    const res = await getRecentTracks({
      apiKey: env.LASTFM_API_KEY,
      user: LASTFM_USERNAME,
      limit: LASTFM_TRACK_LIMIT,
      cf: { cacheTtl: LASTFM_CACHE_TTL }, // Pass forward a cacheTtl to speed up repeated requests.
    });

    // Parse out JSON, then massage the track objects into just the data we need.
    const resJson = await parseResponse(res);
    const tracks = resJson.recenttracks.track.map(parseTrackObject);

    // Finally, return the tracks as JSON!
    return new Response(JSON.stringify(tracks));
  } catch (err) {
    // Something weird happened -- return a generic error message and log the full details.
    console.error(err);
    return new Response("error fetching from lastfm", {
      status: 500,
    });
  }
}
