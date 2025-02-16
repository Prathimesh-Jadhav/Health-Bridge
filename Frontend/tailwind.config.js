/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:{
          DEFAULT:'#28A745'
        },
        secondary:{
          DEFAULT:'#007BFF'
        },
        tertiary:{
          DEFAULT:'#DC3545'
        },
        neutral:{
          DEFAULT:'#F8F9FA'
        },
        primaryhover:{
          DEFAULT:'#218838'
        },
        secondaryhover:{
          DEFAULT:'#0056B3'
        },
      },
      textColor:{
        main:{
          DEFAULT:'#212529'
        },
        common:{
          DEFAULT:'#6C757D'
        }
      },
      fontSize:{
        default:'16px',
        heading1:'24px',
        heading2:'20px',
        sm:'14px'
      }
    },
  },
  plugins: [],
}

