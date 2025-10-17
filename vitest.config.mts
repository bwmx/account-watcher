import { defineConfig } from 'vitest/config'

export default defineConfig({
  //esbuild: {},
  test: {
    deps: {
      inline: ['@fastify/autoload'],
    },
  },
})
