import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    resolve: {
        alias: {
            'break_infinity.js': 'break_infinity.js/dist/break_infinity.esm.js'
        }
    }
})
