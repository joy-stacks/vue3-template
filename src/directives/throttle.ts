import type { Directive, DirectiveBinding } from "vue";
import { throttle as _throttle } from "@zjb/utils";

interface ElType extends HTMLElement {
  __handleClick__: (...args: any[]) => void;
  disabled: boolean;
}

const throttle: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    if (typeof binding.value !== "function") {
      throw "callback must be a function";
    }

    el.__handleClick__ = _throttle(binding.value, 600, {
      maxWait: 1000,
    });

    el.addEventListener("click", el.__handleClick__);
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener("click", el.__handleClick__);
  },
};

export default throttle;
