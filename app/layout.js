import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "98.css/dist/98.css";
import "../src/styles.css";

export const metadata = {
  title: "Colby Ludwig",
  description:
    "Colby Ludwig is a full-stack software developer, making and breaking things for the web in Edmonton, AB, Canada.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="me" href="https://ldwg.ca/@colby" />
      </head>
      <body>
        {children}
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
      </body>
    </html>
  );
}
