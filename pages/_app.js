import Script from "next/script";
import "../src/styles.css";
import "98.css/dist/98.css";
import PlausibleProvider from "next-plausible";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <PlausibleProvider
        domain="colbyludwig.com"
        customDomain="https://a.ldwg.me"
      >
        <Component {...pageProps} />
      </PlausibleProvider>
    </>
  );
}
