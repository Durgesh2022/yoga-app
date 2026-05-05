import { TextStyle } from 'react-native';

export const fonts = {
  display: 'PlayfairDisplay_700Bold',
  displayItalic: 'PlayfairDisplay_700Bold_Italic',
  serif: 'PlayfairDisplay_600SemiBold',
  sansLight: 'Inter_300Light',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
};

export const typography: Record<string, TextStyle> = {
  hero: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  display: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  h1: {
    fontFamily: fonts.sansBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fonts.sansBold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  bodyLg: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMedium: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  captionMedium: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  overline: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  buttonLg: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
};

export const motion = {
  durations: {
    fast: 180,
    base: 320,
    slow: 520,
    hero: 720,
  },
  easings: {
    standard: [0.2, 0.8, 0.2, 1] as const,
    emphasized: [0.16, 1, 0.3, 1] as const,
  },
};
