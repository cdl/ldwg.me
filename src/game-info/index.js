import { kv } from "@vercel/kv";
import SteamAPI from "steamapi";

import { getPSNAuthorization } from "./psn";
import { getBasicPresence } from "psn-api";

export async function getSteamSummary() {
  const cached = await kv.hgetall("steam:summary");
  if (cached && cached.personaState !== undefined) {
    console.log("[STEAM] Returning cached summary from Redis!");
    return cached;
  }

  const { STEAM_API_KEY, STEAM_API_USER } = process.env;
  if (!STEAM_API_KEY?.length || STEAM_API_KEY === "STEAM_API_KEY_HERE") {
    console.warn(
      `[STEAM] STEAM_API_KEY is invalid (${process.env.STEAM_API_KEY})`,
    );
    return {};
  }

  if (!STEAM_API_USER) {
    console.warn(
      `[STEAM] STEAM_API_USER is not set, should be valid Steam user ID.`,
    );
    return {};
  }

  console.log("[STEAM] Fetching Steam user summary...");
  const steam = new SteamAPI(process.env.STEAM_API_KEY);

  let steamSummary = {};
  try {
    steamSummary = await steam.getUserSummary(STEAM_API_USER);
  } catch (err) {
    console.error("Could not fetch Steam summary:", err);
    return {};
  }

  const info = {
    personaState: steamSummary?.personaState || null,
    gameID: steamSummary?.gameID || null,
    gameName: steamSummary?.gameName || null,
  };

  console.log(
    "[STEAM] Caching Steam summary to Vercel KV as `steam:summary`...",
  );

  await kv.hset("steam:summary", info);

  return info;
}

export async function getPSNInfo() {
  // Check to see if the PSN presence is cached in Vercel KV.
  const cached = await kv.hgetall("psn:presence");
  if (cached && cached.availability) {
    console.log("[PSN]", "Returning cached presence from Redis");
    return cached;
  }

  // Otherwise, grab the PSN authorization code & fetch the presence from PSN.
  const psnAccessCode = getPSNAuthorization();
  const { basicPresence: psn } = await getBasicPresence(psnAccessCode, "me");

  // Lastly, cache the presence for later to prevent excess calls to the PSN API.
  console.log(
    "[PSN]",
    "Caching PSN presence to Vercel KV as `psn:presence`...",
  );

  await kv.hset("psn:presence", psn);

  return psn;
}
