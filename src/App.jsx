"use client";

import { WindowType } from "./98/components/Window";
import { DesktopContext } from "./98/context/desktop";
import { WindowManager } from "./98";

const initialState = {
  isDragging: false,
  focused: 1,
  windows: {
    1: {
      id: 1,
      type: WindowType.PROFILE,
    },
    2: {
      id: 2,
      type: WindowType.LASTFM,
    },
  },
};

export default function App({ lastFmData }) {
  return (
    <DesktopContext.Provider value={initialState}>
      <WindowManager lastFmData={lastFmData} />
    </DesktopContext.Provider>
  );
}
