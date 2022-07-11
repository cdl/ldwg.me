import Api, { LASTFM_API_KEY } from "../api";

export default async function getRecentTracks({
  user,
  limit,
  page,
  from,
  extended,
  to,
  cf = {}, // used for Cloudflare specific request options
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

  const api = new Api(LASTFM_API_KEY);
  const path = api.buildUrl("user.getrecenttracks", options);

  return fetch(path, { cf });
}
