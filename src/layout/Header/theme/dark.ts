import {
  hasClass,
  addClass,
  removeClass,
  setCssVar,
  lighten,
  // colorIsDark,
  darken,
} from "@/utils";
import { useSettingStoreWithout } from "@/store/modules/setting";
import { color } from "./theme-config";

const THEME_BG_COLOR = "--theme-bg-color";
const THEME_BG_COLOR_2 = "--theme-bg-color2";
const THEME_BG_COLOR_3 = "--theme-bg-color3";
const THEME_BG_COLOR_4 = "--theme-bg-color4";
const THEME_HOVER_BG_COLOR = "--theme-hover-bg-color";
const THEME_BORDER_COLOR = "--theme-border-color";
const THEME_BORDER_COLOR_2 = "--theme-border-color2";
const THEME_TEXT_COLOR = "--theme-text-color";

const HEADER_BG_HOVER_COLOR_VAR = "--header-bg-hover-color";
const HEADER_MENU_ACTIVE_BG_COLOR_VAR = "--header-active-menu-bg-color";

const SIDER_DARK_BG_COLOR = "--sider-dark-bg-color";
const SIDER_DARK_DARKEN_BG_COLOR = "--sider-dark-darken-bg-color";
const SIDER_LIGHTEN_BG_COLOR = "--sider-dark-lighten-bg-color";

export async function updateDarkTheme(mode: string | null = "light") {
  const htmlRoot = document.getElementById("htmlRoot");
  if (!htmlRoot) {
    return;
  }
  const hasDarkClass = hasClass(htmlRoot, "dark");
  if (mode === "dark") {
    htmlRoot.setAttribute("data-theme", "dark");
    if (!hasDarkClass) {
      addClass(htmlRoot, "dark");
    }
  } else {
    htmlRoot.setAttribute("data-theme", "light");
    if (hasDarkClass) {
      removeClass(htmlRoot, "dark");
    }
  }
}

/**
 * Change the background color of the top header
 * @param color
 */
export function updateHeaderBgColor() {
  const { theme } = useSettingStoreWithout();

  const bgcolor = color[theme.mode].bgColor;
  const bgcolor2 = color[theme.mode].bgColor2;
  const bgcolor3 = color[theme.mode].bgColor3;
  const bgcolor4 = color[theme.mode].bgColor4;
  const bgHoverColor = color[theme.mode].bgHoverColor;
  const borderColor = color[theme.mode].borderColor;
  const borderColor2 = color[theme.mode].borderColor2;
  const textColor = color[theme.mode].textColor;

  setCssVar(THEME_BG_COLOR, bgcolor);
  setCssVar(THEME_BG_COLOR_2, bgcolor2);
  setCssVar(THEME_BG_COLOR_3, bgcolor3);
  setCssVar(THEME_BG_COLOR_4, bgcolor4);
  setCssVar(THEME_HOVER_BG_COLOR, bgHoverColor);
  setCssVar(THEME_BORDER_COLOR, borderColor);
  setCssVar(THEME_BORDER_COLOR_2, borderColor2);
  setCssVar(THEME_TEXT_COLOR, textColor);

  // hover color
  const hoverColor = lighten(bgcolor!, 6);
  setCssVar(HEADER_BG_HOVER_COLOR_VAR, hoverColor);
  setCssVar(HEADER_MENU_ACTIVE_BG_COLOR_VAR, hoverColor);

  // Determine the depth of the color value and automatically switch the theme
  // const isDark = colorIsDark(color!);
  // console.log(isDark)

  /* appStore.setProjectConfig({
    headerSetting: {
      theme: isDark || darkMode ? ThemeEnum.DARK : ThemeEnum.LIGHT,
    },
  }); */
}

/**
 * Change the background color of the left menu
 * @param color  bg color
 */
export function updateSidebarBgColor(color?: string) {
  const { theme } = useSettingStoreWithout();

  // if (!isHexColor(color)) return;
  const darkMode = theme.mode === "dark";
  if (!color) {
    if (darkMode) {
      color = "#212121";
    } else {
      color = "#595959";
    }
  }
  setCssVar(SIDER_DARK_BG_COLOR, color);
  setCssVar(SIDER_DARK_DARKEN_BG_COLOR, darken(color!, 6));
  setCssVar(SIDER_LIGHTEN_BG_COLOR, lighten(color!, 5));

  // only #ffffff is light
  // Only when the background color is #fff, the theme of the menu will be changed to light
  // const isLight = ["#fff", "#ffffff"].includes(color!.toLowerCase());
  // console.log(isLight)
  /* appStore.setProjectConfig({
    menuSetting: {
      theme: isLight && !darkMode ? ThemeEnum.LIGHT : ThemeEnum.DARK,
    },
  }); */
}
