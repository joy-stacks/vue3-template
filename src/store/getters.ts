import { useSettingStoreWithout } from "./modules/setting";
import { computed } from "vue";
const { theme } = useSettingStoreWithout();

export const mode = computed(() => theme.mode);
export const primaryColor = computed(() => theme.primaryColor);
export const navMode = computed(() => theme.primaryColor);
