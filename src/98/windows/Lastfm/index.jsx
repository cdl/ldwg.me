import cx from "classnames";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Window from "../../components/Window";
import styles from "./index.module.css";

async function getTracks() {
  const res = await fetch("/api/last-fm");
  if (!res.ok) {
    throw new Error(`Failed to fetch tracks: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (typeof data === "string" && data.includes("error")) {
    throw new Error(`Last.fm API error: ${data}`);
  }
  return data;
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

function renderTopArtist(artist, total) {
  const { name, playcount, url } = artist;
  const barWidth = `${Math.round((playcount / total) * 10000) / 100}%`;

  return (
    <li className={cx(styles.topArtistCell)} key={url}>
      <div className={cx(styles.topArtistInfo)}>
        <p className={cx(styles.topArtistHeader)}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={cx(styles.topArtistName)}
          >
            {name}
          </a>
          {`(${playcount} plays)`}
        </p>
      </div>
      <div className={cx("progress-indicator", styles.progressIndicator)}>
        <span
          className={cx("progress-indicator-bar", styles.progressIndicatorBar)}
          style={{ width: barWidth }}
        ></span>
      </div>
    </li>
  );
}

export default function Lastfm(props) {
  let trackCells;
  let topArtistCells;

  const [tracks, setTracks] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the recent tracks from the API on init.
  useEffect(() => {
    getTracks()
      .then(({ recentTracks, topArtists }) => {
        setTracks(recentTracks);
        setTopArtists(topArtists);
        setIsLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load Last.fm data:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (error) {
    trackCells = topArtistCells = (
      <div style={{ textAlign: "center", padding: "16px" }}>
        <p style={{ marginBottom: "8px" }}>Failed to load Last.fm data.</p>
        <p style={{ fontSize: "10px", color: "#666" }}>{error}</p>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
            getTracks()
              .then(({ recentTracks, topArtists }) => {
                setTracks(recentTracks);
                setTopArtists(topArtists);
                setIsLoading(false);
              })
              .catch((err) => {
                setError(err.message);
                setIsLoading(false);
              });
          }}
        >
          Retry
        </button>
      </div>
    );
  } else if (isLoading) {
    trackCells = topArtistCells = (
      <p style={{ textAlign: "center" }}>fetching info from last.fm...</p>
    );
  } else {
    if (tracks instanceof Array) {
      trackCells = tracks.map(renderTrack);
    }

    if (topArtists?.artists?.map) {
      topArtistCells = topArtists.artists.map((a) =>
        renderTopArtist(a, topArtists.maxPlays),
      );
    }
  }

  return (
    <Window
      title="Recently Played & Top Artists"
      x={20}
      y={212}
      width="350px"
      style={{ overflowY: "scroll" }}
      innerClassName={cx(styles.window)}
      {...props}
    >
      <ul className={cx(styles.trackCells, "tree-view")}>{trackCells}</ul>
      <ul className={cx(styles.topArtists, "tree-view")}>{topArtistCells}</ul>
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
