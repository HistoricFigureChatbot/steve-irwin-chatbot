/**
 * Vite Configuration
 * Configuration file for Vite build tool
 * Enables React plugin for JSX transformation and Fast Refresh
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
