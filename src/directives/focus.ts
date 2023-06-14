import { Directive } from "vue";

const focus: Directive = {
  mounted(el) {
    el.focus();
  },
};
export default focus;
