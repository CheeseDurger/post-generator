import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const path: string = fileURLToPath(new URL("./src", import.meta.url));
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@/assets/environments/config": path + `/assets/environments/${mode === "development" ? "config" : mode + ".config"}`,
        "@/assets/environments/analytics": path + `/assets/environments/${mode === "development" ? "analytics" : mode + ".analytics"}`,
        "@": path,
      },
    },
  };
});
