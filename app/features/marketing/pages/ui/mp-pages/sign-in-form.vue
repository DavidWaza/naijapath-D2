<template>
  <form novalidate :aria-label="a.tabSignIn" class="flex flex-col gap-5" @submit="onSubmit">
    <MpPagesLineField
      id="sign-in-email"
      :label="c.emailLabel"
      required
      :valid="emailValid"
      :error="errors.email"
      v-slot="{ describedby, invalid, controlClass }"
    >
      <input
        id="sign-in-email"
        v-model="email"
        name="email"
        type="email"
        autocomplete="username"
        inputmode="email"
        :placeholder="c.emailPlaceholder"
        required
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedby"
        :class="controlClass"
      />
    </MpPagesLineField>

    <!-- The password step eases in (the tab frame animates the height around it). -->
    <Transition
      enter-active-class="transition-[opacity,translate] duration-300 ease-out-soft"
      enter-from-class="-translate-y-2 opacity-0"
    >
      <MpPagesLineField
        v-if="step === 'password'"
        id="sign-in-password"
        :label="a.passwordLabel"
        required
        :error="errors.password"
      >
        <template #default="{ describedby, invalid, controlClass }">
          <input
            id="sign-in-password"
            v-model="password"
            name="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            required
            :aria-invalid="invalid ? 'true' : undefined"
            :aria-describedby="describedby"
            :class="controlClass"
          />
        </template>
        <template #trailing>
          <MpPagesPasswordToggle v-model="showPassword" controls="sign-in-password" />
        </template>
      </MpPagesLineField>
    </Transition>

    <NButton
      type="submit"
      color="primary"
      size="lg"
      class="mt-3 w-full"
      :disabled="state === 'submitting'"
    >
      {{ label }}
    </NButton>
    <MpPagesFormStatus :state="state" :message="announcement" class="justify-center text-center" />
  </form>
</template>

<script setup lang="ts">
/** Sign-in tab: email first, then password. Logic lives in the composition root. */
import { computed } from "vue";
import { PAGES_MICROCOPY } from "../../domain/pages-microcopy";

const c = PAGES_MICROCOPY.common;
const a = PAGES_MICROCOPY.auth;
const t = PAGES_MICROCOPY.signIn;
const { email, emailValid, password, showPassword, step, errors, state, announcement, onSubmit } =
  useMpSignIn();

const label = computed(() =>
  state.value === "submitting" ? t.sending : step.value === "email" ? t.continue : t.submit,
);
</script>
