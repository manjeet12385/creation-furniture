import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: `${root}index.html`,
        aboutUs: `${root}about-us.html`,
        whyChooseUs: `${root}why-choose-us.html`,
        gallery: `${root}gallery.html`,
        contact: `${root}contact.html`,
      },
    },
  },
});
