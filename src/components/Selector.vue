<!--
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-05-15 16:48:30
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-05-16 11:43:04
 * @Description: 
-->
<template>
  <div
    text="green-400"
    border="b-1 b-zinc-500 rounded"
    bg="zinc-900"
    mx="2"
    py="2"
    w="40"
    class="cursor-pointer relative"
    @click="toggleOptionsVisible"
  >
    {{ displayContent }}
    <ul
      border="rounded"
      top="12"
      left="-5"
      w="50"
      max-h="55"
      overflow="y-scroll"
      text="white"
      bg="zinc-900"
      class="absolute selector-options"
      v-show="optionsVisible"
    >
      <li
        py="2"
        mx="2"
        hover:text="green-400"
        v-for="option in options"
        :class="[
          option.key === props.selectedOption.key ? 'text-green-400' : '',
          'relative',
        ]"
        :key="option.key"
        @click="handleSelect(option)"
      >
        <p
          class="flex"
          items="center"
          :justify="tree && option.children?.length ? 'between' : 'center'"
        >
          {{ option.value }}
          <chevron-right
            v-if="tree && option.children?.length"
            class="transform"
            :size="18"
            :rotate="currentChildren.key === option.key ? 90 : 0"
          />
        </p>
        <template v-if="tree && currentChildren.key === option.key">
          <p
            v-for="(child, index) in currentChildren.children || []"
            :key="child.key"
            pt="2"
            text="sm white left"
            hover:text="green-400"
            @click="handleChildSelect(option, index)"
          >
            {{ child.value }}
          </p>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { ChevronRight } from "lucide-vue-next";
import type { Ref } from "vue";
import type { Option, OptionExtra } from "@/types";
import { isEmpty } from "@/utils";

onMounted(() => {
  document.addEventListener("click", handleEvent, true);
});

onBeforeUnmount(() => document.removeEventListener("click", handleEvent));

const props = withDefaults(
  defineProps<{
    // generic
    isMultiple?: boolean;
    options: Option[];
    selectedOption: Partial<Option & OptionExtra>;
    tree?: boolean;
  }>(),
  {
    isMultiple: false,
    data: () => [],
    tree: false,
  }
);

const emits = defineEmits(["select"]);

const optionsVisible: Ref<boolean> = ref(false);
const currentChildren: Ref<Partial<Option>> = ref({});

const displayContent = computed(() => {
  const { selectedOption } = props;
  const text = selectedOption.value;
  if (selectedOption.children?.length) {
    return `${text} ${
      selectedOption.children[selectedOption.selectedChildIndex || 0].value
    }`;
  }
  return text;
});

const handleSelect = (option: Option) => {
  if (props.tree && option.children?.length) {
    currentChildren.value = isEmpty(currentChildren.value) ? option : {};
  } else {
    toggleOptionsVisible();
    emits("select", option);
  }
};

const handleChildSelect = (option: Option, index: number) => {
  toggleOptionsVisible();
  emits("select", { ...option, selectedChildIndex: index });
};

const toggleOptionsVisible = () => {
  optionsVisible.value = !optionsVisible.value;
};

const handleEvent = () => {
  if (optionsVisible.value) optionsVisible.value = false;
};
</script>
