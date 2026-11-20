<template>
  <form
    novalidate
    aria-labelledby="session-form-heading"
    class="flex flex-col gap-12"
    @submit="onSubmit"
  >
    <!-- 01 About you -->
    <fieldset class="flex flex-col gap-7">
      <legend class="mb-7 flex items-center gap-3 font-heading text-xl font-semibold text-ink">
        <span
          aria-hidden="true"
          class="tabular inline-flex size-8 items-center justify-center rounded-full bg-mint text-sm font-semibold text-forest-deep"
          >01</span
        >
        {{ t.sectionAboutYou }}
      </legend>

      <MpPagesLineField
        id="session-name"
        :label="c.nameLabel"
        required
        :error="errors.name"
        v-slot="{ describedby, invalid, controlClass }"
      >
        <input
          id="session-name"
          v-model="name"
          name="name"
          autocomplete="name"
          required
          :aria-invalid="invalid ? 'true' : undefined"
          :aria-describedby="describedby"
          :class="controlClass"
        />
      </MpPagesLineField>

      <div class="grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-6">
        <MpPagesLineField
          id="session-email"
          :label="c.emailLabel"
          required
          :error="errors.email"
          v-slot="{ describedby, invalid, controlClass }"
        >
          <input
            id="session-email"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            inputmode="email"
            :placeholder="c.emailPlaceholder"
            required
            :aria-invalid="invalid ? 'true' : undefined"
            :aria-describedby="describedby"
            :class="controlClass"
          />
        </MpPagesLineField>

        <MpPagesLineField
          id="session-phone"
          :label="t.phoneLabel"
          optional
          :hint="t.phoneHint"
          :error="errors.phone"
          v-slot="{ describedby, invalid, controlClass }"
        >
          <input
            id="session-phone"
            v-model="phone"
            name="phone"
            type="tel"
            autocomplete="tel"
            inputmode="tel"
            :aria-invalid="invalid ? 'true' : undefined"
            :aria-describedby="describedby"
            :class="controlClass"
          />
        </MpPagesLineField>
      </div>

      <MpPagesChoiceChips
        id="session-stage"
        v-model="stage"
        name="stage"
        :legend="t.stageLabel"
        :options="t.stages"
        required
        :error="errors.stage"
      />
    </fieldset>

    <!-- 02 Your session -->
    <fieldset class="flex flex-col gap-7">
      <legend class="mb-7 flex items-center gap-3 font-heading text-xl font-semibold text-ink">
        <span
          aria-hidden="true"
          class="tabular inline-flex size-8 items-center justify-center rounded-full bg-mint text-sm font-semibold text-forest-deep"
          >02</span
        >
        {{ t.sectionSession }}
      </legend>

      <MpPagesChoiceChips
        id="session-focus"
        v-model="focus"
        name="focus"
        :legend="t.focusLabel"
        :options="t.focuses"
        required
        :error="errors.focus"
      />

      <MpPagesChoiceChips
        id="session-time"
        v-model="time"
        name="time"
        :legend="t.timeLabel"
        :options="t.times"
        optional
        :error="errors.time"
      />

      <!-- Goals: a soft box (an underline is too thin a frame for several lines of text). -->
      <div>
        <NLabel for="session-goals" required class="block text-[0.8125rem] text-body">
          {{ t.goalsLabel }}
        </NLabel>
        <p id="session-goals-hint" class="mt-1 text-sm text-muted">{{ t.goalsHint }}</p>
        <textarea
          id="session-goals"
          v-model="goals"
          name="goals"
          rows="5"
          :maxlength="goalsMax"
          required
          :aria-invalid="errors.goals ? 'true' : undefined"
          :aria-describedby="
            errors.goals ? 'session-goals-hint session-goals-error' : 'session-goals-hint'
          "
          :class="
            cn(
              'mt-3 block min-h-36 w-full resize-y rounded-lg border bg-card px-4 py-3 font-sans text-base text-ink transition-[border-color,box-shadow] duration-200 ease-out-soft placeholder:text-muted focus-visible:border-forest focus-visible:shadow-[inset_0_0_0_1px_var(--forest)] focus-visible:outline-none',
              errors.goals
                ? 'border-danger-500 shadow-[inset_0_0_0_1px_var(--danger-500)]'
                : 'border-muted',
            )
          "
        />
        <div class="mt-1.5 flex items-start justify-between gap-4">
          <NFieldError v-if="errors.goals" id="session-goals-error">{{ errors.goals }}</NFieldError>
          <span aria-hidden="true" class="tabular ml-auto text-xs text-muted">
            {{ goals?.length ?? 0 }} / {{ goalsMax }}
          </span>
        </div>
      </div>
    </fieldset>

    <div class="flex flex-col gap-6 border-t border-hairline pt-8">
      <div>
        <NCheckbox
          id="session-consent"
          v-model="consent"
          name="consent"
          required
          :invalid="Boolean(errors.consent)"
          :describedby="errors.consent ? 'session-consent-error' : undefined"
        >
          {{ t.consentLabel }}
          <NLink
            :to="PAGES_ROUTES.privacy"
            class="font-medium text-forest underline underline-offset-2"
          >
            {{ t.consentLink }}</NLink
          >.
          <span aria-hidden="true" class="ml-0.5">*</span>
          <span class="sr-only"> (required)</span>
        </NCheckbox>
        <NFieldError v-if="errors.consent" id="session-consent-error" class="mt-1">
          {{ errors.consent }}
        </NFieldError>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <NButton
          type="submit"
          color="primary"
          size="lg"
          class="w-full sm:w-auto"
          :disabled="state === 'submitting'"
        >
          {{ state === "submitting" ? c.sending : t.submit }}
          <NIcon v-if="state !== 'submitting'" name="arrow-right" :size="18" />
        </NButton>
        <MpPagesFormStatus :state="state" :message="announcement" class="sm:flex-1" />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
/**
 * Session request form ("Book a session"), d2 design: numbered sections, underline fields,
 * one-tap choice chips for the short option lists. Logic lives in the composition root.
 */
import { cn } from "~/utils/utils";
import { PAGES_MICROCOPY } from "../../domain/pages-microcopy";
import { PAGES_ROUTES } from "../../domain/pages-routes";

const c = PAGES_MICROCOPY.common;
const t = PAGES_MICROCOPY.sessionRequest;
const {
  name,
  email,
  phone,
  stage,
  focus,
  time,
  goals,
  goalsMax,
  consent,
  errors,
  state,
  announcement,
  onSubmit,
} = useMpSessionRequest();
</script>
