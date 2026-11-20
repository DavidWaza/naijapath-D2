<template>
  <div class="min-h-svh bg-cream p-[var(--sheet-inset)]">
    <NSkipLink target="main">{{ MICROCOPY.a11y.skipLink }}</NSkipLink>

    <div
      class="grid min-h-[calc(100svh-2*var(--sheet-inset))] grid-cols-1 gap-3 rounded-sheet bg-sheet p-3 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]"
    >
      <MpPagesAuthShowcase class="hidden min-h-[38rem] lg:block" />

      <!-- Form column -->
      <div class="flex min-w-0 flex-col px-3 pt-3 pb-2 sm:px-8 lg:px-12 xl:px-16">
        <header>
          <NLink
            :to="PAGES_ROUTES.home"
            :aria-label="MICROCOPY.a11y.homeLink"
            class="inline-flex min-h-11 items-center rounded-sm"
          >
            <NLogo />
          </NLink>
        </header>

        <main id="main" tabindex="-1" class="flex flex-1 items-center py-12 lg:py-16">
          <div class="mx-auto w-full max-w-[25rem]">
            <span
              aria-hidden="true"
              class="inline-flex size-11 items-center justify-center rounded-full bg-mint text-forest-deep"
            >
              <NIcon :name="mode === 'sign-in' ? 'lock' : 'user'" :size="20" />
            </span>
            <h1
              ref="heading"
              tabindex="-1"
              class="mt-6 font-heading text-[2rem] leading-tight font-semibold tracking-[-0.02em] text-ink"
            >
              {{ mode === "sign-in" ? a.title : a.signUpTitle }}
            </h1>
            <p class="mt-2 text-base text-body">
              {{ mode === "sign-in" ? a.lead : a.signUpLead }}
            </p>

            <Transition
              mode="out-in"
              enter-active-class="transition-[opacity,translate] duration-300 ease-out-soft"
              enter-from-class="translate-y-2 opacity-0"
              leave-active-class="transition-opacity duration-150 ease-out-soft"
              leave-to-class="opacity-0"
            >
              <MpPagesSignInForm v-if="mode === 'sign-in'" key="in" class="mt-8" />
              <MpPagesSignUpForm v-else key="up" class="mt-8" />
            </Transition>

            <p class="mt-6 text-center text-[0.9375rem] text-body">
              {{ mode === "sign-in" ? a.noAccount : a.haveAccount }}
              <button
                type="button"
                class="inline-flex min-h-11 items-center font-semibold text-forest underline underline-offset-4 hover:text-forest-deep"
                @click="switchMode"
              >
                {{ mode === "sign-in" ? a.toSignUp : a.toSignIn }}
              </button>
            </p>
          </div>
        </main>

        <footer
          class="flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-4"
        >
          <NLink
            :to="PAGES_ROUTES.contact"
            class="inline-flex min-h-11 items-center text-sm font-semibold text-ink underline underline-offset-4"
          >
            {{ a.needHelp }}
          </NLink>
          <ul :aria-label="MICROCOPY.a11y.socialLabel" class="flex items-center gap-1">
            <li v-for="s in HOME_SOCIAL" :key="s.id">
              <NLink
                v-if="s.href"
                :to="s.href"
                :aria-label="s.label"
                class="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-ink/5"
              >
                <NIcon :name="s.id" :size="18" />
              </NLink>
              <!-- URL not supplied yet: a plain glyph, never a dead link. -->
              <span
                v-else
                aria-hidden="true"
                class="inline-flex size-11 items-center justify-center text-ink"
              >
                <NIcon :name="s.id" :size="18" />
              </span>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Sign in / create account (d2): photo panel left (≥1024px) with approved-copy statements,
 * one form right. A text switch replaces the tabs; `?mode=sign-up` opens on sign-up and the
 * switch keeps the URL in step. After switching, focus moves to the new heading. Never indexed.
 */
import { nextTick, ref } from "vue";
import { HOME_SOCIAL } from "~/features/marketing/home/domain/home-routes";
import { MICROCOPY } from "~/features/marketing/home/domain/home-microcopy";
import { PAGES_MICROCOPY } from "~/features/marketing/pages/domain/pages-microcopy";
import { PAGES_ROUTES } from "~/features/marketing/pages/domain/pages-routes";

const a = PAGES_MICROCOPY.auth;
const route = useRoute();
const router = useRouter();
const mode = ref<"sign-in" | "sign-up">(route.query.mode === "sign-up" ? "sign-up" : "sign-in");
const heading = ref<HTMLElement | null>(null);

async function switchMode() {
  mode.value = mode.value === "sign-in" ? "sign-up" : "sign-in";
  await router.replace({ query: mode.value === "sign-up" ? { mode: "sign-up" } : {} });
  await nextTick();
  heading.value?.focus();
}

useSeoMeta({ title: a.metaTitle, description: a.metaDescription, robots: "noindex, nofollow" });
</script>
