import React from "react";

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

      {/* <Window title="Canvas" width="300px" height="300px">
        <p>This will eventually be a canvas.</p>
      </Window> */}
    </WindowManager>
  );
}
