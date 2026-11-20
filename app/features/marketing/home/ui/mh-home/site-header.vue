<template>
  <!-- §01 Header (d2). A white bar that floats inside the dark hero frame at the top of the page
       and stays pinned (with a soft shadow) once the visitor scrolls. -->
  <header data-slot="site-header" class="pointer-events-none fixed inset-x-0 top-0 z-40">
    <div
      :class="
        cn(
          'mh-bar pointer-events-auto mx-auto flex h-16 max-w-[78rem] items-center gap-3 rounded-xl border bg-sheet pr-2 pl-4 sm:pl-5',
          scrolled
            ? 'mt-2 w-[calc(100%-1rem)] border-hairline shadow-bar'
            : 'mt-[calc(var(--sheet-inset)+0.75rem)] w-[calc(100%-2*var(--sheet-inset)-1.5rem)] border-transparent sm:w-[calc(100%-2*var(--sheet-inset)-3rem)] sm:mt-[calc(var(--sheet-inset)+1.25rem)]',
        )
      "
    >
      <NLink
        :to="HOME_ROUTES.home"
        class="inline-flex min-h-11 shrink-0 items-center rounded-sm"
        :aria-label="MICROCOPY.a11y.homeLink"
      >
        <NLogo />
      </NLink>

      <!-- ≥1440px: the four links in the brief's order, centred. -->
      <nav :aria-label="MICROCOPY.a11y.primaryNav" class="mx-auto hidden 2xl:block">
        <ul class="flex items-center gap-1">
          <li v-for="item in ITEMS" :key="item.label">
            <NLink
              :to="item.to"
              :aria-current="item.sectionId === activeId ? 'location' : undefined"
              :class="
                cn(
                  'relative inline-flex h-11 items-center rounded-sm px-3.5 text-[0.9375rem] whitespace-nowrap transition-colors duration-200 ease-out-soft hover:bg-ink/[0.05]',
                  // Brief §01: the organisation link carries weight 600 in deep green.
                  item.audience === 'organisation'
                    ? 'font-semibold text-forest-deep'
                    : 'font-medium text-body hover:text-ink',
                  item.sectionId === activeId && 'bg-mint-50 text-ink',
                )
              "
            >
              {{ item.label }}
            </NLink>
          </li>
        </ul>
      </nav>

      <div class="ml-auto flex items-center gap-1.5 2xl:ml-0">
        <NButton
          :to="NAV_COPY.ctaGhost.to"
          color="light"
          variant="ghost"
          size="sm"
          class="hidden md:inline-flex"
        >
          {{ NAV_COPY.ctaGhost.label }}
        </NButton>
        <NButton
          :to="NAV_COPY.ctaFilled.to"
          color="primary"
          size="sm"
          class="hidden xs:inline-flex"
        >
          {{ NAV_COPY.ctaFilled.label }}
        </NButton>

        <!-- Below 1440px: menu button. The menu (mobile-menu.vue) loads on demand. -->
        <button
          type="button"
          class="inline-flex size-11 items-center justify-center rounded-sm text-ink transition-colors duration-200 ease-out-soft hover:bg-ink/[0.05] 2xl:hidden"
          :aria-label="MICROCOPY.a11y.openMenu"
          aria-haspopup="dialog"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          @click="openMenu"
        >
          <NIcon name="menu" :size="22" />
        </button>
        <LazyMhHomeMobileMenu v-if="menuMounted" v-model:open="menuOpen" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * §01 Header (d2).
 * - Logo left, the brief's four links centred (≥1440px), Sign In (ghost) + Book a Session
 *   (filled green) right. Below 1440px the links and Sign In move into the menu dialog.
 * - Scroll spy: the link for the section in view gets aria-current="location" and a mint tint.
 */
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { cn } from "~/utils/utils";
import { motionState } from "~/utils/motion-state";
import { hashTargetId } from "~/utils/scroll";
import { NAV_COPY } from "../../domain/home-copy";
import { HOME_ROUTES } from "../../domain/home-routes";
import { MICROCOPY } from "../../domain/home-microcopy";

const ITEMS = NAV_COPY.links.map((l) => ({
  label: l.label,
  to: l.to,
  audience: l.audience,
  sectionId: hashTargetId(l.to),
}));

const scrolled = ref(false);
const menuOpen = ref(false);
const menuMounted = ref(false);
const activeId = ref<string | null>(null);

const onScroll = () => {
  scrolled.value = window.scrollY > 80;
};

let spy: IntersectionObserver | undefined;
const warmMenuChunk = () => void import("./mobile-menu.vue");

function openMenu() {
  menuMounted.value = true;
  menuOpen.value = true;
}

watch(menuOpen, (open) => {
  if (open) motionState.lenis?.stop();
  else motionState.lenis?.start();
});

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) activeId.value = e.target.id;
      if (window.scrollY < window.innerHeight * 0.5) activeId.value = null;
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  for (const item of ITEMS) {
    const el = item.sectionId ? document.getElementById(item.sectionId) : null;
    if (el) spy.observe(el);
  }

  if (!window.matchMedia("(min-width: 90rem)").matches) {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    if (idle) idle(warmMenuChunk);
    else setTimeout(warmMenuChunk, 2000);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  spy?.disconnect();
});
</script>

<style scoped>
.mh-bar {
  transition:
    margin 300ms var(--ease-out-soft),
    width 300ms var(--ease-out-soft),
    box-shadow 300ms var(--ease-out-soft),
    border-color 300ms var(--ease-out-soft);
}
</style>
