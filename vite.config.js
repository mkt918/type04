import { defineConfig } from 'vite'

export default defineConfig({
    resolve: {
        alias: {
            'break_infinity.js': 'break_infinity.js/dist/break_infinity.esm.js'
        }
    }
})
