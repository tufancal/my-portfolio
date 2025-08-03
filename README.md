# Astro Storyblok Template

```sh
git clone git@github.com:tufancal/astro-storyblok-boilerplate.git
```

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── components/
│       └── atoms/
│       └── blocks/
│       └── molecules/
│       └── organisms/
│   └── layouts/
│       └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

## 🖥️ .env.sample

```sh
cp .env.sample .env
```

```text
Add the STORYBLOK_TOKEN as well as the SPACE_ID which is needed to generate the types.

STORYBLOK_TOKEN=
STORYBLOK_SPACE_ID=
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |