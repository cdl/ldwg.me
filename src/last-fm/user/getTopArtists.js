import { buildUrl } from "..";

export default async function getTopArtists({
  apiKey,
  user,
  limit,
  page,
  period,
  cf = {},
}) {
  let options = { user };

  if (!apiKey) {
    throw new Error(`apiKey is required, \`${apiKey}\` was given`);
  } else {
    // Last.fm uses snake-case properties.
    options.api_key = apiKey;
  }

  if (limit) options.limit = limit;
  if (page) options.page = page;
  if (period) options.period = period;

  const path = buildUrl("user.getTopArtists", options);

  return fetch(path, { cf });
}
