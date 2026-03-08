import fetchLastFmData from "../src/last-fm/fetchLastFmData";
import App from "../src/App";

export default async function Page() {
  let lastFmData = null;
  try {
    lastFmData = await fetchLastFmData();
  } catch (err) {
    console.error("Failed to fetch Last.fm data:", err);
  }

  return <App lastFmData={lastFmData} />;
}
