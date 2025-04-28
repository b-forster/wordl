import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., development, production)
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react(), tsconfigPaths()],
    define: {
      // Make environment variables available in the app
      'process.env': env,
    },
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: './tests/setup.ts',
      include: ['**/*.{test,spec}.{ts,tsx}'],
    },
  }
})