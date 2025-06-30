import { buildUrl } from "..";

export default async function getRecentTracks({
  apiKey,
  user,
  limit,
  page,
  from,
  extended,
  to,
  cache = "force-cache",
  next = { revalidate: 60 * 60 },
}) {
  let options = { user };

  // Set optional fields if they exist.
  if (limit) {
    options.limit = limit;
  }

  if (page) {
    options.page = page;
  }

  if (from) {
    options.from = from;
  }

  if (extended) {
    options.extended = extended;
  }

  if (to) {
    options.to = to;
  }

  if (!apiKey) {
    throw new Error(`apiKey is required, \`${apiKey}\` was given`);
  } else {
    // Last.fm uses snake-case properties.
    options.api_key = apiKey;
  }

  const path = buildUrl("user.getrecenttracks", options);

  return fetch(path, { cache, next });
}
