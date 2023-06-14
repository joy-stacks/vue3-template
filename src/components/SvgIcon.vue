<template>
  <svg aria-hidden="true" :width="`${width}px`" :height="`${height}px`">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    height: {
      type: Number,
      default: 14,
    },
    width: {
      type: Number,
      default: 14,
    },
    name: String,
    color: String,
  },
  setup(props) {
    const symbolId = computed(() => `#icon-${props.name}`);
    return { symbolId };
  },
});
</script>
