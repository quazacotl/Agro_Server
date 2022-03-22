module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        'inner-xl': 'inset 0 0 5px 4px white',
        'inner-notification': 'inset 0 0 5px 1px rgba(0, 0, 0, .8)',
        'around': '0 0 10px 10px rgb(234 88 12)',
        'input-focus': '0 0 10px 4px rgb(234 88 12)',
        'form-sh': '3px 3px 5px 0 rgb(166, 166, 166)'
      },
      backgroundImage: {
        'vehicle-table': 'radial-gradient(circle farthest-corner at center, #686e7a 0%, #32627E 100%)',
        'request-table': 'radial-gradient(circle farthest-corner at center, #686e7a 0%, #C7D2FE 100%)',
        'button-gradient': 'linear-gradient(144deg,#AF40FF, #5B42F3 50%,#00DDEB)',
        'button-gradient-invert': 'linear-gradient(315deg,#AF40FF, #5B42F3 50%,#00DDEB)',
        'tab-gradient': 'linear-gradient(144deg, rgba(255,150,3,1) 0%,  50%, #B514D9 100%)',
        'tab-active': 'linear-gradient(315deg, rgba(255,150,3,1) 0%,  50%, #B514D9 100%)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp')
  ],
}
