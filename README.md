# Front Office

A basketball GM card game, built with React + Vite.

## How this project is deployed

- The code lives on **GitHub**.
- **Vercel** watches the GitHub repository. Every time a change is saved to
  GitHub, Vercel automatically rebuilds and publishes the live website.

So the workflow is simply: **change a file on GitHub → the live game updates in about a minute.**

## Project files

| File / folder      | What it is                                                        |
| ------------------ | ----------------------------------------------------------------- |
| `src/App.jsx`      | The entire game (all the logic and screens).                      |
| `src/main.jsx`     | Small startup file that shows the game on the page.               |
| `index.html`       | The web page the game loads into.                                 |
| `package.json`     | Lists the tools the project needs (React, Vite).                  |
| `vite.config.js`   | Build configuration.                                              |

## Making changes later

The easy way (no software to install):

1. Go to your repository on github.com.
2. Open the file you want to change (usually `src/App.jsx`).
3. Click the pencil ✏️ icon to edit, make your change, and click **Commit changes**.
4. Wait ~1 minute — Vercel republishes the live game automatically.

## Running it on your own computer (optional, needs Node.js installed)

```bash
npm install
npm run dev
```
