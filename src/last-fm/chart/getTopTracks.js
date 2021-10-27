import { Client } from "../client";

export default function getTopTracks() {
  const client = new Client();
  return client.request("chart.getTopTracks");
}
