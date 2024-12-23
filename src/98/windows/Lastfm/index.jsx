import cx from "classnames";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Window from "../../components/Window";
import styles from "./index.module.css";

async function getTracks() {
  const res = await fetch("/api/last-fm", { method: "POST" });
  const json = await res.json();

  return json;
}

function renderTimestamp(track) {
  if (track.playedAt === "currently playing") {
    return "now";
  }

  const timestamp = new Date(Number(track.playedAt) * 1000);

  // If the timestamp is within the last hour, show the time in minutes.
  // If the timestamp is within the last day, show the time in hours.
  // Otherwise, show the time in days.
  const now = new Date();
  const diff = now - timestamp;
  const diffMinutes = Math.floor(diff / 60000);
  const diffHours = Math.floor(diff / 3600000);
  const diffDays = Math.floor(diff / 86400000);

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  return `${diffDays}d`;
}

function renderTrack(track) {
  const nowPlaying = track.playedAt === "currently playing";

  let name = track.name;
  let timestamp = renderTimestamp(track);

  return (
    <li key={track.playedAt} className={cx(styles.trackCell)}>
      <Image
        className={cx(styles.trackCellArtwork)}
        src={track.artworkUrl}
        alt="Album artwork"
        width={64}
        height={64}
      />
      <div className={cx(styles.trackCellInfo)}>
        <span
          className={cx(styles.trackCellInfoLine)}
          style={{ fontWeight: nowPlaying ? "bold" : "normal" }}
        >
          <span className={styles.trackcellInfoName}>{name}</span>
          <span className={styles.trackcellInfoTimestamp}>{timestamp}</span>
        </span>
        <span
          className={cx(
            styles.trackCellInfoLine,
            !nowPlaying && styles.trackCellInfoMuted,
          )}
        >
          {track.album} by {track.artist}
        </span>
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
    if (tracks instanceof Array) {
      trackCells = tracks.map(renderTrack);
    }
  }

  return (
    <Window
      title="Recently Played"
      x={25}
      y={212}
      width="350px"
      style={{ overflowY: "scroll" }}
      {...props}
    >
      <ul className={cx(styles.trackCells, "tree-view")}>{trackCells}</ul>
      <div className={cx(styles.trackCellsAttr)}>
        data provided by{" "}
        <a
          className={cx(styles.trackCellsAttrLink)}
          href="https://www.last.fm/user/rckts"
          target="_blank"
          rel="noreferrer"
        >
          <div className={cx(styles.lastFmIcon)}></div> last.fm
        </a>
      </div>
    </Window>
  );
}
