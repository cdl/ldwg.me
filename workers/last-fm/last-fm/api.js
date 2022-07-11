const LASTFM_API_KEY = "LASTFM_API_KEY_HERE";
const API_BASE = `https://ws.audioscrobbler.com/2.0/`;

export default class Api {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  buildUrl(method, params) {
    let options = {
      ...params,
      method,
      api_key: this.apiKey,
      format: "json",
    };

    const searchParams = new URLSearchParams(options);
    const url = `${API_BASE}?${searchParams.toString()}`;

    console.log(url);

    return url;
  }
}

export { LASTFM_API_KEY };
