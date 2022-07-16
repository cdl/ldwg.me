import React from "react";
import Window from "../../components/Window";
import { useDesktop } from "../../context/desktop";

import "./index.css";

const PROFILE_LINKS = {
  linkedin: { label: "LinkedIn", value: `https://linkedin.com/in/colbyludwig` },
  twitter: { label: "Twitter", value: `https://twitter.com/cdl` },
  github: { label: "Github", value: `https://github.com/cdl` },
  email: { label: "Email", value: `mailto:me@colbyludwig.com` },
};

export default function Profile(props) {
  const profileButtons = Object.values(PROFILE_LINKS).map(
    ({ label, value }, key) => (
      <button
        key={key}
        className="profile__btn"
        data-link={value}
        onClick={handleClick}
      >
        {label}
      </button>
    )
  );

  function handleClick(ev) {
    ev.preventDefault();
    const url = ev.target?.getAttribute("data-link");

    console.log(url, ev.target);

    if (!url) return;

    window.open(url, "_blank");
  }

  return (
    <Window title="Colby Ludwig" x={25} y={25} width="350px" {...props}>
      <div style={{ textAlign: "center" }}>
        <img
          src="/avatar.jpg"
          width="64px"
          height="64px"
          alt="A low-resolution picture of Colby, with his face in his palms in defeat. Big mood."
        />
      </div>
      <p style={{ textAlign: "center" }}>
        Full-stack developer. Making (and breaking) things for the web.
        <br />
        Based in Edmonton, AB.
      </p>
      <div className="button-group profile__btn-group">{profileButtons}</div>
    </Window>
  );
}
