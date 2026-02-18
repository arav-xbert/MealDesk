export const colors = {
  primary: {
    900: '#180F33',
    500: '#7949FF',
    100: '#F9F6FF',
    75: '#EBE4FF',
    50: '#EFE9FF',
  },
  accent: {
    500: '#FF498B',
    400: '#19BAC4',
  },
  interactive: {
    500: '#1967C4',
  },
  neutral: {
    50: '#212121',
    100: '#1A1A26',
    200: '#404040',
    300: '#666673',
    400: '#737380',
    450: '#80808C',
    475: '#808080',
    500: '#8C8C99',
    550: '#999999',
    575: '#9999A6',
    600: '#A6A6A6',
    625: '#A6A6B2',
    700: '#BFBFBF',
    725: '#C7C7C7',
    775: '#D9D9D9',
    780: '#D9D9D9',
    800: '#D9D9E5',
    825: '#E0E0E5',
    875: '#EBEBF0',
    900: '#F0F0F5',
    925: '#F2F2F5',
    950: '#F5F6F7',
    975: '#F7F7F7',
  },
  success: {
    500: '#219954',
    400: '#2EB878',
    100: '#E5FFEB',
  },
  warning: {
    500: '#D9730D',
    400: '#FF8C33',
    100: '#FFF1E7',
  },
  danger: {
    500: '#E54040',
  },
  white: '#FFFFFF',
} as const;

export const gradients = {
  // Figma canonical: gradient/primary = Interactive Blue → Primary Purple
  primary: 'linear-gradient(135deg, #1967C4 0%, #7949FF 100%)',
  // Figma canonical: gradient/accent = Cyan → Mint
  accent: 'linear-gradient(135deg, #19BAC4 0%, #25EAC4 100%)',
  // Brand gradient (purple → pink) — not a named Figma variable
  brand: 'linear-gradient(90deg, #7949FF 0%, #FF498B 100%)',
} as const;

export const typography = {
  fontFamily: {
    primary: "'Rajdhani', sans-serif",
    secondary: "'IBM Plex Sans Arabic', 'IBM Plex Sans', sans-serif",
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  displayH1: { size: 152, lineHeight: 152, letterSpacing: -2 },
  displayH2: { size: 96, lineHeight: 104, letterSpacing: -1.5 },
  headingH3: { size: 64, lineHeight: 72, letterSpacing: -0.5 },
  headingH4: { size: 36, lineHeight: 48, letterSpacing: 0 },
  headingH5: { size: 24, lineHeight: 32, letterSpacing: 0 },
  bodyRegular: { size: 16, lineHeight: 24, letterSpacing: 0 },
  caption: { size: 12, lineHeight: 16, letterSpacing: 0.5 },
} as const;
