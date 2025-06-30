import Head from "next/head";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

export default function App() {
  return (
    <>
      <SpeedInsights />
      <Script
        defer={true}
        data-domain="colbyludwig.ca"
        src="https://p.ldwg.ca/js/script.js"
      />
      <Script
        id="plausible-js-queue"
        dangerouslySetInnerHTML={{
          __html: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
        }}
      />
      <Head>
        <title>Colby Ludwig</title>
        <meta
          name="description"
          content="Full-stack developer. Making (and breaking) things for the web. Based in Edmonton, AB."
        />
        <link rel="me" href="https://ldwg.ca/@colby" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <DesktopContext.Provider value={initialState}>
        <WindowManager></WindowManager>
      </DesktopContext.Provider>
    </>
  );
}
