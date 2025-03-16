import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import flowbite from "flowbite-react/tailwind"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    flowbite.plugin(),
  ],

  content: [
    flowbite.content(),
  ],
})
