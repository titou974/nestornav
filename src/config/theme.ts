export const themeConfig = {
  defaultTheme: "nestor-dark",
  themes: ["nestor-dark"],
} as const;

export type ThemeName = (typeof themeConfig.themes)[number];
