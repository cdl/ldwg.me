# ldwg

A personal "profile" site for myself to replace my existing one. Built with [98.css](https://jdan.github.io/98.css) and [React](https://reactjs.org/).

![A screenshot showing two Windows 98-era windows.](./public/readme.png)

## Setting up

- Register a Last.fm application [here](https://www.last.fm/api/account/create), then place your API key within `.dev.vars`.
- Replace `LASTFM_USERNAME` with your Last.fm username in `functions/last-fm.js` (line 3).

## Available Scripts

### npm start

Uses `wrangler pages dev` to run both the build server and Cloudflare Worker functions. Should automatically open your browser, but otherwise it's serving at `http://localhost:8788`. **:warning: Be sure to run `npm run build` first!!**

### npm run build

Builds a static copy of your site to the `build/` folder.
