import { defineConfig } from "@twind/core";
import {
  amberDark,
  cyanDark,
  greenDark,
  tomatoDark,
} from "@twind/preset-radix-ui/colors";
import presetTailwindBase from "@twind/preset-tailwind/base";
import {
  background,
  backgroundDark,
  breezeblue,
  breezeblueDark,
  gray,
  grayDark,
  link,
} from "./radix-breeze-colors";

export default defineConfig({
  darkMode: true,
  theme: {
    fontFamily: {
      sans: ["Noto Sans", "sans-serif"],
      mono: ["Iosevka", "monospace"],
    },
  },
  presets: [
    presetTailwindBase({
      colors: {
        link: link,
        brand: breezeblueDark,
        accent: breezeblueDark,
        neutral: grayDark,
        background: backgroundDark,
        // Error: Red/Tomato/Crimson
        error: tomatoDark,
        // Success: Teal/Green/Grass/Mint
        success: greenDark,
        // Warning: Yellow/Amber
        warning: amberDark,
        // Info: Blue/Sky/Cyan
        info: cyanDark,
      },
    }),
  ],
});
