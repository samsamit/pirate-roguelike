import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
  plugins: [solid()],
})
