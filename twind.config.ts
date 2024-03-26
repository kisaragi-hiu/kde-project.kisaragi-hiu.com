import { defineConfig } from "@twind/core";
import presetTailwindBase from "@twind/preset-tailwind/base";
import { tomato, green, amber, cyan } from "@twind/preset-radix-ui/colors";
import {
  breezeblue,
  breezeblueDark,
  gray,
  grayDark,
  background,
  backgroundDark,
} from "./radix-breeze-colors";

export default defineConfig({
  presets: [
    presetTailwindBase({
      colors: {
        brand: breezeblue,
        accent: breezeblue,
        neutral: gray,
        background: background,
        // Error: Red/Tomato/Crimson
        error: tomato,
        // Success: Teal/Green/Grass/Mint
        success: green,
        // Warning: Yellow/Amber
        warning: amber,
        // Info: Blue/Sky/Cyan
        info: cyan,
      },
    }),
  ],
});
