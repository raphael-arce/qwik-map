# Qwik Map 🗺️️

A simple slippy map implemented with Qwik, making use of Qwik's unique
resumability approach. The map can also be server-side rendered, if its
width and height have fixed lengths in pixels. 

- [Qwik Docs](https://qwik.builder.io/)

---

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). For Qwik during development, the `dev` command will also server-side render (SSR) the output. The client-side development modules loaded by the browser.

```
npm run dev
```

> Note: during dev mode, Vite will request many JS files, which does not represent a Qwik production build.

## Production

The production build should generate the production build of your component library in (./lib) and the typescript type definitions in (./lib-types).

```
npm run build
```
