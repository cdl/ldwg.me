import React from "react";
import Window from "../../components/Window";
import { useDesktop } from "../../context/desktop";

import "./index.css";

function getLinkForButton(id) {
  switch (id) {
    case "linkedin":
      return `https://linkedin.com/in/colbyludwig`;
    case "twitter":
      return `https://twitter.com/cdl`;
    case "dribbble":
      return `https://dribbble.com/ludwig`;
    case "email":
      return `mailto:me@colbyludwig.com`;
  }
}

export default function Profile(props) {
  function handleClick(ev) {
    ev.preventDefault();
    const id = ev.target?.id;
    const url = getLinkForButton(id);

    if (!id || !url) return;

    // Track with Google Analytics if it's available.
    if (window.gtag && typeof window.gtag === "function") {
      window.gtag("event", "click_link", {
        id,
        url,
        label: ev.target.innerText,
      });
    }

    window.open(url, "_blank");
  }

  return (
    <Window title="Colby Ludwig" x={25} y={25} width="350px" {...props}>
      <div style={{ textAlign: "center" }}>
        <img src="/avatar.bmp" width="64px" />
      </div>
      <p style={{ textAlign: "center" }}>
        Full-stack developer. Making (and breaking) things for the web. Based in
        Vancouver, BC.
      </p>
      <div className="button-group">
        <button onClick={handleClick} id="linkedin">
          LinkedIn
        </button>
        <button onClick={handleClick} id="twitter">
          Twitter
        </button>
        <button onClick={handleClick} id="dribbble">
          Dribbble
        </button>
        <button onClick={handleClick} id="email">
          Email
        </button>
      </div>
    </Window>
  );
}
