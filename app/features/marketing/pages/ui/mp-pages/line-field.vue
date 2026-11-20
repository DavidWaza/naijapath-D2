<template>
  <div data-slot="line-field" :class="props.class">
    <NLabel :for="props.id" :required="props.required" class="block text-[0.8125rem] text-body">
      {{ props.label }}
      <span v-if="props.optional" class="font-normal">{{ PAGES_MICROCOPY.common.optional }}</span>
    </NLabel>
    <!-- Underline field: the bottom rule is the frame. Focus thickens it to a 2px forest line
         (the visible focus indicator); errors turn it red AND add an icon + text below. -->
    <div
      :class="
        cn(
          'flex min-h-12 items-center gap-2 border-b transition-[border-color,box-shadow] duration-200 ease-out-soft',
          props.error
            ? 'border-danger-500 shadow-[0_1px_0_0_var(--danger-500)]'
            : 'border-muted focus-within:border-forest focus-within:shadow-[0_1px_0_0_var(--forest)]',
        )
      "
    >
      <div class="min-w-0 flex-1">
        <slot :describedby="describedby" :invalid="Boolean(props.error)" :control-class="CONTROL" />
      </div>
      <NIcon
        v-if="props.valid && !props.error"
        name="check-circle"
        :size="18"
        weight="bold"
        class="text-success-500"
      />
      <slot name="trailing" />
    </div>
    <p v-if="props.hint" :id="hintId" class="mt-1.5 text-sm text-muted">{{ props.hint }}</p>
    <NFieldError v-if="props.error" :id="errorId" class="mt-1.5">{{ props.error }}</NFieldError>
  </div>
</template>

<script setup lang="ts">
/**
 * Underline field for the auth pages (d2). Same slot API as box-field.vue, so forms can swap
 * between the two. The rule (muted, 5.4:1 on white) meets the 3:1 non-text contrast rule.
 */
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/utils/utils";
import { PAGES_MICROCOPY } from "../../domain/pages-microcopy";

const props = defineProps<{
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  valid?: boolean;
  class?: HTMLAttributes["class"];
}>();

/** Borderless control; the underline is drawn by the wrapper (focus shows there). */
const CONTROL =
  "block h-12 w-full min-w-0 border-0 bg-transparent p-0 font-sans text-base text-ink placeholder:text-muted focus-visible:outline-none";

const hintId = computed(() => `${props.id}-hint`);
const errorId = computed(() => `${props.id}-error`);
const describedby = computed(
  () =>
    [props.hint ? hintId.value : "", props.error ? errorId.value : ""].filter(Boolean).join(" ") ||
    undefined,
);
</script>
