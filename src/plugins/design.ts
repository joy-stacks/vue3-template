import { App } from "vue";

import {
  ZCard,
  ZPlot,
  ZTable,
  ZModal,
  ZCardStatics,
  ZCountTo,
  ZTablePro,
  Viewer,
  ZLock,
} from "@zjb/components"; // "D:\\zjb-projects\\前端\\4.类库\\zjb.components\\dist\\ui.es"; // 

// import MakeitCaptcha from "makeit-captcha";

// 导入样式
import "@zjb/components/dist/style.css";
// import "D:\\zjb-projects\\前端\\4.类库\\zjb.components\\dist\\style.css";
// import "makeit-captcha/dist/captcha.min.css";

// zjb协会组件库
const zjbs = [ZCard, ZPlot, ZTable, ZModal, ZCardStatics, ZCountTo, ZTablePro, ZLock];

// 其他组件库
const others = [];

const components = [...others, ...zjbs];

export { Viewer }

export function setupUIPlugin(app: App<Element>) {
  components.forEach((component) => {
    // @ts-ignore
    app.use(component);
  });
}
