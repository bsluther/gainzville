/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        searchSvg: `url("data:image/svg+xml,%3Csvg class='w-6 h-6' style='width: 1.5rem; height: 1.5rem;' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3E%3C/path%3E%3C/svg%3E")`
      },
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
