import React from "react";
import Image from "next/image";
import cx from "classnames";
import Window from "../../components/Window";
import { useDesktop } from "../../context/desktop";

import styles from "./index.module.css";

const PROFILE_LINKS = {
  linkedin: { label: "LinkedIn", value: `https://linkedin.com/in/colbyludwig` },
  mastodon: { label: "Mastodon", value: `https://ldwg.ca/@colby` },
  bluesky: {
    label: "Bluesky",
    value: `https://bsky.app/profile/colby.ldwg.ca`,
  },
  github: { label: "Github", value: `https://github.com/cdl` },
};

export default function Profile(props) {
  const profileButtons = Object.values(PROFILE_LINKS).map(
    ({ label, value }, key) => (
      <button
        key={key}
        className={styles.profileBtn}
        data-link={value}
        onClick={handleClick}
      >
        {label}
      </button>
    ),
  );

  function handleClick(ev) {
    ev.preventDefault();
    const label = ev.target?.innerText;
    const url = ev.target?.getAttribute("data-link");

    if (!url) return;

    // Attempt to track click via Plausible.
    if (typeof window.plausible === "function") {
      window.plausible("Profile Button Click", { label });
    }

    window.open(url, "_blank");
  }

  return (
    <Window title="Colby Ludwig" x={20} y={25} width="350px" {...props}>
      <div style={{ textAlign: "center" }}>
        <Image
          priority={true}
          src="/avatar.jpg"
          width={64}
          height={64}
          alt="A low-resolution picture of Colby, with his face in his palms in defeat. Big mood."
        />
      </div>
      <p style={{ textAlign: "center" }}>
        Full-stack developer. Making (and breaking) things for the web.
        <br />
        Based in Edmonton, AB.
      </p>
      <div className={cx("button-group", styles.profileBtnGroup)}>
        {profileButtons}
      </div>
    </Window>
  );
}
