# ldwg

A personal "profile" site for myself to replace my existing one. Built with [98.css](https://jdan.github.io/98.css) and [React](https://reactjs.org/).

![A screenshot showing two Windows 98-era windows.](./public/readme.png)

## Setting up

- Register a Last.fm application [here](https://www.last.fm/api/account/create), then place your API key within `workers/last-fm/last-fm/api.js` (line 1).
- Replace `LASTFM_USERNAME` with your Last.fm username in `workers/last-fm/src/index.js` (line 3).

## Available Scripts

### npm start

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm run build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

**For the best production performance:** Add a build bundler plugin like [@snowpack/plugin-webpack](https://github.com/snowpackjs/snowpack/tree/main/plugins/plugin-webpack) or [snowpack-plugin-rollup-bundle](https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle) to your `snowpack.config.mjs` config file.

### Q: What about Eject?

No eject needed! Snowpack guarantees zero lock-in, and CSA strives for the same.
