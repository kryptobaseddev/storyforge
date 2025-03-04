import fs from 'fs';

// Create tailwind.config.js
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

fs.writeFileSync('tailwind.config.js', tailwindConfig);
console.log('Created tailwind.config.js');

// Create postcss.config.js
const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

fs.writeFileSync('postcss.config.js', postcssConfig);
console.log('Created postcss.config.js'); 