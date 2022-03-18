import React from "react";
import { WindowType } from "./98/components/Window";
import { useDesktop, DesktopContext } from "./98/context/desktop";
import { WindowManager } from "./98";

const initialState = {
  isDragging: false,
  focused: 1,
  windows: {
    1: {
      id: 1,
      type: WindowType.PROFILE,
    },
  },
};

export default function App() {
  return (
    <DesktopContext.Provider value={initialState}>
      <WindowManager>
        <Window title="Colby Ludwig" posX={40} posY={40}>
          <div style={{ textAlign: "center" }}>
            <img src="/avatar.bmp" width="64px" />
          </div>
          <p style={{ textAlign: "center" }}>
            Full-stack developer. Making (and breaking) things for the web.
            Based in Vancouver, BC.
          </p>
        </Window>

        {/* <Window title="Canvas" width="300px" height="300px">
        <p>This will eventually be a canvas.</p>
      </Window> */}
      </WindowManager>
    </DesktopContext.Provider>
  );
}
