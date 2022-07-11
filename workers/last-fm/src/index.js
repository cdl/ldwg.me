import { getRecentTracks } from "../last-fm";

const LASTFM_USERNAME = "rckts";
const LASTFM_TRACK_LIMIT = 20;
const LASTFM_CACHE_TTL = 30;

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
export default {
  async fetch(request) {
    // Respond to pre-flight CORS requests early.
    const { headers } = request;

    // Handle OPTIONS requests early for CORS.
    if (request.method === "OPTIONS") {
      console.log("HANDLING OPTIONS REQUEST");
      if (
        headers.get("Origin") !== null &&
        headers.get("Access-Control-Request-Method") !== null &&
        headers.get("Access-Control-Request-Headers") !== null
      ) {
        // Allow all methods & headers through.
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
            "Access-Control-Max-Age": "86400",
            "Access-Control-Allow-Headers": request.headers.get(
              "Access-Control-Request-Headers"
            ),
          },
        });
      } else {
        console.log("HANDLING OPTIONS REQUEST");
        // Handle standard OPTIONS request.
        return new Response(null, {
          headers: {
            Allow: "GET, HEAD, POST, OPTIONS",
          },
        });
      }
    }

    // Ensure we 404 any unrelated requests to prevent against unnecessary cache hits & CPU time.
    const url = new URL(request.url);
    if (url.pathname !== "/") {
      return new Response(JSON.stringify({ error: "not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Try to fetch the tracks, failing early if anything weird happens
    // (the client will re-attempt to load it later).
    try {
      const res = await getRecentTracks({
        user: LASTFM_USERNAME,
        limit: LASTFM_TRACK_LIMIT,
        cf: { cacheTtl: LASTFM_CACHE_TTL }, // Pass forward a cacheTtl to speed up repeated requests.
      });

      // Parse out JSON, then massage the track objects into just the data we need.
      const resJson = await parseResponse(res);
      const tracks = resJson.recenttracks.track.map(parseTrackObject);

      // Finally, return the tracks as JSON!
      return new Response(JSON.stringify(tracks), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
          "Access-Control-Max-Age": "86400",
        },
      });
    } catch (err) {
      // Something weird happened -- return a generic error message and log the full details.
      console.error(err);
      return new Response("error fetching from lastfm", {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
          "Access-Control-Max-Age": "86400",
        },
      });
    }
  },
};
