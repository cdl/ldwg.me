class Client {
  constructor(props) {
    this.apiKey = ``;
    this.prefix = "https://ws.audioscrobbler.com/2.0/";

    console.info("Instantiating last.fm client with API key:", this.apiKey);
  }

  request(method, params = {}, format = "json") {
    const options = {
      api_key: this.apiKey,
      method,
      format,
      ...params, // TODO: This needs to be sent in the body instead for write-based API requests.
    };

    const url = this.prefix + new URLSearchParams(options).toString();

    console.info("Sending request to last.fm...", {
      url,
      method,
      params,
      format,
    });

    return fetch(url, { method: "POST" });
  }
}

export { Client };
