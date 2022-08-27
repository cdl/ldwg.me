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

function renderTrack(track) {
  const nowPlaying = track.playedAt === "currently playing";

  let name = track.name;
  if (nowPlaying) {
    name = `${name} (now playing)`;
  }

  return (
    <li key={track.playedAt} className={cx(styles.trackCell)}>
      <Image
        className={cx(styles.trackCellArtwork)}
        src={track.artworkUrl}
        alt="Album artwork"
        width="34px"
        height="34px"
      />
      <div className={cx(styles.trackCellInfo)}>
        <p>
          <span style={{ fontWeight: nowPlaying ? "bold" : "normal" }}>
            {name}
          </span>
          <br />
          <span className={cx(!nowPlaying && styles.trackCellInfoMuted)}>
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
