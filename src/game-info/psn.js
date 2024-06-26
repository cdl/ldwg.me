import { kv } from "@vercel/kv";

const log = (...arg) => {
  console.log(`[PSN]`, ...arg);
};

/**
 * Helper function used to re-authenticate with PSN utilizing the
 * stored PSN_API_NPSSO value, grabbed via https://ca.account.sony.com/api/v1/ssocookie.
 * We want to do this as little as possible, so ideally this is only run if
 * the access token & refresh token are both expired.
 *
 * The returned object has the expiresIn and refreshTokenExpiresIn values
 * expressed as ISO timestamps as `accessTokenExpiresAt` and `refreshTokenExpiresAt`.
 *
 * @returns {import("psn-api").AuthTokensResponse}
 */
async function authenticatePSN() {
  log(`Exchanging npsso key for authorization!`);

  const npsso = process.env.PSN_API_NPSSO;
  if (!npsso) return null;

  const accessCode = await exchangeNpssoForCode(npsso);
  let authorization = await exchangeCodeForAccessToken(accessCode);
  if (!authorization?.accessToken) return null;

  authorization = {
    ...computedExpiry(authorization),
    ...authorization,
  };

  log(`Caching authorization to Vercel KV!`);

  // Cache the authorization to Vercel KV, then return it.
  await kv.hset("psn:auth", authorization);

  return authorization;
}

async function refreshPSNAuthentication({ refreshToken }) {
  log(
    `Exchanging refresh token for auth token!`,
    Object.keys(authorization),
    authorization?.accessTokenExpiresAt,
  );

  let authorization = await exchangeRefreshTokenForAuthTokens(refreshToken);

  // Cache the authorization to Vercel KV, then return it.
  authorization = {
    ...computedExpiry(authorization),
    ...authorization,
  };

  await kv.hset("psn:auth");
  return authorization;
}

function computedExpiry(auth) {
  // Compute the expiration time for the authorization & refresh tokens.
  const now = new Date();

  const accessTokenExpiresAt = new Date(
    now.getTime() + auth.expiresIn * 1000,
  ).toISOString();

  const refreshTokenExpiresAt = new Date(
    now.getTime() + auth.refreshTokenExpiresIn * 1000,
  ).toISOString();

  return { accessTokenExpiresAt, refreshTokenExpiresAt };
}

function isAccessTokenExpired(authorization) {
  log("Checking if access token has expired...");
  const now = new Date();
  return new Date(authorization.accessTokenExpiresAt).getTime() < now.getTime();
}

function isRefreshTokenExpired(authorization) {
  log("Checking if refresh token has expired...");
  const now = new Date();
  return (
    new Date(authorization.refreshTokenExpiresAt).getTime() < now.getTime()
  );
}

async function refreshIfNecessary(authorization) {
  log("Checking if authorization refresh is necessary...");

  // Check if the access token is expired. If not, return the authorization object as-is.
  if (authorization?.accessToken && !isAccessTokenExpired(authorization)) {
    log("Returning cached authorization!");
    return authorization;
  }

  // Check if the refresh token is still valid. If so, use it to refresh the access token.
  if (authorization?.refreshToken && !isRefreshTokenExpired) {
    log("Authorization expired, using valid refresh token to refresh...");
    return await refreshPSNAuthentication(authorization);
  } else {
    log("Both access & refresh tokens have expired! Generating new ones...");
    // Otherwise, we should re-fetch a new PSN authorization entirely,
    // and return that. This is the only code path that should call
    // the Sony authentication API!
    return await authenticatePSN();
  }
}

async function getPSNAuthorization() {
  log("Getting PSN authorization from Vercel KV (if it exists)...");

  // Grab the latest PSN authorization from Vercel KV.
  let psnAuthorization = await kv.hgetall("psn:auth");
  psnAuthorization = refreshIfNecessary(psnAuthorization);

  // Now, return the final resolved access token.
  return psnAuthorization;
}

export { getPSNAuthorization };
