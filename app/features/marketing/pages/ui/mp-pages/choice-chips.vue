<template>
  <fieldset data-slot="choice-chips" :class="props.class">
    <legend class="text-[0.8125rem] font-medium text-body">
      {{ props.legend }}
      <span v-if="props.required" aria-hidden="true" class="text-danger-500">*</span>
      <span v-if="props.required" class="sr-only"> (required)</span>
      <span v-if="props.optional" class="font-normal">{{ PAGES_MICROCOPY.common.optional }}</span>
    </legend>
    <!-- Native radios: arrow keys move between options; the chip shows checked + focus. -->
    <div
      role="radiogroup"
      :aria-invalid="props.error ? 'true' : undefined"
      :aria-describedby="props.error ? errorId : undefined"
      class="mt-3 flex flex-wrap gap-2"
    >
      <label
        v-for="(option, i) in props.options"
        :key="option.value"
        :class="
          cn(
            'relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-[0.9375rem] font-medium transition-[background-color,border-color,color] duration-200 ease-out-soft select-none',
            'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-forest',
            model === option.value
              ? 'border-forest-deep bg-forest-deep text-white'
              : props.error
                ? 'border-danger-500 bg-sheet text-ink hover:bg-card'
                : 'border-muted bg-sheet text-ink hover:border-forest hover:bg-mint-50',
          )
        "
      >
        <input
          :id="i === 0 ? props.id : `${props.id}-${i}`"
          v-model="model"
          type="radio"
          :name="props.name"
          :value="option.value"
          :required="props.required"
          class="sr-only"
        />
        <NIcon v-if="model === option.value" name="check" :size="16" weight="bold" />
        {{ option.label }}
      </label>
    </div>
    <NFieldError v-if="props.error" :id="errorId" class="mt-2">{{ props.error }}</NFieldError>
  </fieldset>
</template>

<script setup lang="ts">
/**
 * One-tap choice chips (radio group) for short option lists. The first radio carries `id`, so
 * the form's "focus the first invalid field" lands on the group. Selected = filled dark green
 * + check icon (never colour alone).
 */
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/utils/utils";
import { PAGES_MICROCOPY } from "../../domain/pages-microcopy";

const model = defineModel<string>({ default: "" });
const props = defineProps<{
  id: string;
  name: string;
  legend: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  required?: boolean;
  optional?: boolean;
  error?: string;
  class?: HTMLAttributes["class"];
}>();

const errorId = computed(() => `${props.id}-error`);
</script>
