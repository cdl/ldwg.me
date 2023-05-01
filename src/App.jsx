import React from "react";
import Head from "next/head";

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
    2: {
      id: 2,
      type: WindowType.LASTFM,
    },
  },
};

export default function App() {
  return (
    <>
      <Head>
        <title>Colby Ludwig</title>
        <meta
          name="description"
          content="Full-stack developer. Making (and breaking) things for the web. Based in Edmonton, AB."
        />
        <link rel="me" href="https://ldwg.me/@colby" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          async
          src="https://a.ldwg.me/script.js"
          data-website-id="b8d9e3ba-3fde-4c35-a181-7ae49508ab3f"
        ></script>
      </Head>
      <DesktopContext.Provider value={initialState}>
        <WindowManager></WindowManager>
      </DesktopContext.Provider>
    </>
  );
}
