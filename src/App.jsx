import React from "react";

import { getTopTracks } from "./last-fm";
import { Window, WindowManager } from "./98";

export default function App() {
  return (
    <WindowManager>
      <Window title="Colby Ludwig" marginTop={10} marginLeft={10}>
        <div style={{ textAlign: "center" }}>
          <img src="/avatar.bmp" width="64px" />
        </div>
        <p style={{ textAlign: "center" }}>
          Full-stack developer. Making (and breaking) things for the web. Based
          in Vancouver, BC.
        </p>
      </Window>

      <Window
        title="Canvas"
        width="300px"
        height="300px"
        marginTop={50}
        marginLeft={50}
      >
        <p>This will eventually be a canvas.</p>
      </Window>
    </WindowManager>
  );
}
