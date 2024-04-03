import { getPSNInfo, getSteamSummary } from "../../src/game-info";

/**
 * Fetch the game information from various sources and store any
 * results in Vercel KV. This is so API requests from clients
 * visiting ldwg.me are only ever querying Vercel KV, and not
 * the Sony, Steam, or Xbox APIs.
 *
 * We limit this to require an Authorization header with a bearer token stored
 * in the CRON_SECRET environment variable.
 *
 * @param {import('next').NextApiRequest} request
 * @param {import('next').NextApiResponse} response
 */
export default async function fetchGameInfo(request, response) {
  const authHeader = request.headers?.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).json({ error: "unauthorized" });
  }

  // Fetch the current PSN presence & Steam summary. This will automatically cache to Vercel KV.
  try {
    const [psn, steam] = await Promise.all([getPSNInfo(), getSteamSummary()]);

    response.json({ status: "ok", psn, steam });
  } catch (err) {
    response.status(500).json(err);
  }
}
