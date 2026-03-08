import cx from "classnames";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Window from "../../components/Window";
import styles from "./index.module.css";

function renderTimestamp(track) {
  if (track.playedAt === "currently playing") {
    return "now";
  }

  const timestamp = new Date(Number(track.playedAt) * 1000);

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

export default function Lastfm({ lastFmData, ...props }) {
  const router = useRouter();

  let trackCells;
  let topArtistCells;

  if (lastFmData == null) {
    trackCells = topArtistCells = (
      <div style={{ textAlign: "center", padding: "16px" }}>
        <p style={{ marginBottom: "8px" }}>Failed to load Last.fm data.</p>
        <button onClick={() => router.refresh()}>Retry</button>
      </div>
    );
  } else {
    const { recentTracks, topArtists } = lastFmData;

    if (recentTracks instanceof Array) {
      trackCells = recentTracks.map(renderTrack);
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
