/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#EEF2FF', 100:'#E0E7FF', 500:'#6366F1', 600:'#4F46E5', 700:'#4338CA' },
        ink: { 900:'#0F172A', 600:'#475569', 400:'#94A3B8' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 16px rgba(15,23,42,.08)',
        'card-hover': '0 12px 32px rgba(79,70,229,.15)',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        popIn: { '0%': { opacity: 0, transform: 'scale(.92)' }, '60%': { transform: 'scale(1.03)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        slideIn: { from: { opacity: 0, transform: 'translateX(40px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '20%': { transform: 'translateX(-6px)' }, '40%': { transform: 'translateX(6px)' }, '60%': { transform: 'translateX(-4px)' }, '80%': { transform: 'translateX(4px)' } },
        pulseDot: { '0%': { boxShadow: '0 0 0 0 rgba(16,185,129,.5)' }, '70%': { boxShadow: '0 0 0 8px rgba(16,185,129,0)' }, '100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0)' } },
      },
      animation: {
        fadeUp: 'fadeUp .5s ease both',
        popIn: 'popIn .35s ease both',
        slideIn: 'slideIn .35s ease both',
        shake: 'shake .4s ease',
        pulseDot: 'pulseDot 2s infinite',
      },
    },
  },
  plugins: [],
}
