import { storyblok } from "@storyblok/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import path from "path";
import { loadEnv } from "vite";
import mkcert from "vite-plugin-mkcert";

const env = loadEnv("", process.cwd(), "STORYBLOK");

export default defineConfig({
  integrations: [
    storyblok({
      output: "static",
      accessToken: env.STORYBLOK_TOKEN,
      components: {
        link: "components/Link",
        page: "components/Page",
        clipPath: "components/ClipPath",
      },
      apiOptions: {
        region: "eu",
      },
      bridge: true,
    }),
  ],
  vite: {
    plugins: [tailwindcss(), mkcert()],
    resolve: {
      alias: {
        "@": path.resolve("./"),
      },
    },
  },
});
