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
        link: "components/atoms/Link",
        page: "components/Page",
        textBackground: "components/organisms/TextBackground",
        blogPost: "components/organisms/BlogPost",
        blogPostList: "components/organisms/BlogPostList",
        header: "components/organisms/Header",
        navLink: "components/atoms/NavLink",
        footer: "components/organisms/Footer",
        intro: "components/organisms/Intro",
        heroSection: "components/organisms/HeroSection",
        featureList: "components/organisms/FeatureList",
        featureItem: "components/molecules/FeatureItem",
        pricingGrid: "components/organisms/PricingGrid",
        pricingCard: "components/molecules/PricingCard",
        pricingCardFeature: "components/molecules/PricingCardFeature",
        // contactForm: "components/organisms/ContactForm",
        collapsibleItem: "components/molecules/CollapsibleItem",
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
