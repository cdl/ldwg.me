import cx from "classnames";
import React, { useEffect, useState } from "react";
import Window from "../../components/Window";
import "./index.css";

async function getTracks() {
  const res = await fetch("/api/last-fm", { method: "POST" });
  const json = await res.json();

  return json;
}

function renderTrack(track) {
  const nowPlaying = track.playedAt === "currently playing";

  let name = track.name;
  if (nowPlaying) {
    name = `${name} (now playing)`;
  }

  return (
    <li key={track.playedAt} className="track-cell">
      <img
        className="track-cell__artwork"
        src={track.artworkUrl}
        alt="Album artwork"
      />
      <div className="track-cell__info">
        <p>
          <span style={{ fontWeight: nowPlaying ? "bold" : "normal" }}>
            {name}
          </span>
          <br />
          <span className={cx(!nowPlaying && "track-cell__info-muted")}>
            {track.album} by {track.artist}
          </span>
        </p>
      </div>
    </li>
  );
}

export default function Lastfm(props) {
  let trackCells;
  const [tracks, setTracks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load the recent tracks from the API on init.
  useEffect(() => {
    getTracks().then((tracks) => {
      setTracks(tracks);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    trackCells = (
      <p style={{ textAlign: "center" }}>fetching info from last.fm...</p>
    );
  } else {
    trackCells = tracks.map(renderTrack);
  }

  return (
    <Window
      className="window--last-fm"
      title="Recently Played"
      x={25}
      y={212}
      width="350px"
      style={{ overflowY: "scroll" }}
      {...props}
    >
      <ul className="track-cells tree-view">{trackCells}</ul>
      <div className="track-cells__attr">
        data provided by{" "}
        <a
          className="track-cells__attr-link"
          href="https://www.last.fm/user/rckts"
          target="_blank"
        >
          <div className="last-fm-icon"></div> last.fm
        </a>
      </div>
    </Window>
  );
}
