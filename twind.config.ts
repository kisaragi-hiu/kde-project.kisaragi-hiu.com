import { defineConfig } from "@twind/core";
import presetTailwindBase from "@twind/preset-tailwind/base";
import {
  tomatoDark,
  greenDark,
  amberDark,
  cyanDark,
} from "@twind/preset-radix-ui/colors";
import {
  link,
  breezeblue,
  breezeblueDark,
  gray,
  grayDark,
  background,
  backgroundDark,
} from "./radix-breeze-colors";

export default defineConfig({
  darkMode: true,
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
