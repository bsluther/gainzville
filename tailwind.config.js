/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        paytoneOne: [
          '"Paytone One"',
          'sans-serif'
        ],
        customMono: [
          '"Source Code Pro"',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace'
        ]
      },
      colors: {
        neutral: {
          350: "rgb(188 188 188)",
          450: "rgb(139 139 139)",
          550: "rgb(98 98 98)",
          650: "rgb(74 74 74)",
          750: "rgb(51 51 51)"
        }
      }
    },
  },
  plugins: [],
}
