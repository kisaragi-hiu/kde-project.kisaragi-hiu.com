import { defineConfig } from "@twind/core";
import presetTailwindBase from "@twind/preset-tailwind/base";
import {
  sky,
  skyDark,
  plum,
  plumDark,
  slate,
  slateDark,
  // Error: Red/Tomato/Crimson
  tomato,
  tomatoDark,
  // Success: Teal/Green/Grass/Mint
  green,
  greenDark,
  // Warning: Yellow/Amber
  amber,
  amberDark,
  // Info: Blue/Sky/Cyan
  cyan,
  cyanDark,
} from "@twind/preset-radix-ui/colors";
import darkColor from "@twind/preset-radix-ui/darkColor";

export default defineConfig({
  darkColor: darkColor,
  presets: [
    presetTailwindBase({
      colors: {
        brand: sky,
        brandDark: skyDark,
        accent: plum,
        accentDark: plumDark,
        neutral: slate,
        neutralDark: slateDark,
        // Error: Red/Tomato/Crimson
        error: tomato,
        errorDark: tomatoDark,
        // Success: Teal/Green/Grass/Mint
        success: green,
        successDark: greenDark,
        // Warning: Yellow/Amber
        warning: amber,
        warningDark: amberDark,
        // Info: Blue/Sky/Cyan
        info: cyan,
        infoDark: cyanDark,
      },
    }),
  ],
});
