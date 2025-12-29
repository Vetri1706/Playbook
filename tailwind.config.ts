import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SNS Brand
        'sns-orange': '#F37021',
        'sns-green': '#00A651',
        'sns-light-orange': '#FEF3ED',
        'sns-light-green': '#E8F5ED',
        'sns-dark': '#222222',
        // Hero Colors
        'hero-spidey': '#E23636',
        'hero-spidey-blue': '#0476F2',
        'hero-thanos': '#673ab7',
        'hero-peppa': '#F4B3C2',
        'hero-kim-green': '#4B5320',
        'hero-kim-orange': '#FF6600',
        'hero-hulk': '#4CAF50',
        'hero-bheem': '#FF9933',
        'hero-cap-red': '#B71C1C',
        'hero-cap-blue': '#0D47A1',
        'hero-panther': '#212121',
        'hero-panther-purple': '#9C27B0',
        'hero-jerry': '#A1887F',
        'hero-tom': '#78909C',
        'hero-frozen': '#B3E5FC',
        'hero-frozen-white': '#FAFAFA',
        'hero-startup': '#FFEB3B',
        // Process
        'process-blue': '#00ADEF',
        'path-yellow': '#FFC20E',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'sans-serif'],
      },
      aspectRatio: {
        'a4': '21 / 29.7',
      },
    },
  },
  plugins: [],
};

export default config;
