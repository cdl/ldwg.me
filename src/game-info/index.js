import { kv } from "@vercel/kv";
import SteamAPI from "steamapi";

import { getBasicPresence } from "psn-api";

export async function getSteamSummary() {
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
  const steamSummary = await steam.getUserSummary(STEAM_API_USER);

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

export async function getPSNInfo(psnAccessCode) {
  const { basicPresence: psn } = await getBasicPresence(psnAccessCode, "me");

  console.log(
    "[PSN]",
    "Caching PSN presence to Vercel KV as `psn:presence`...",
  );
  await kv.hset("psn:presence", psn);

  return psn;
}
