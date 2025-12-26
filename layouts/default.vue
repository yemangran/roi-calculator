<template>
  <div class="app-shell overflow-x-hidden">
    <div class="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-8">
      <header class="flex w-full items-center justify-between pt-8">
        <a href="/" class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl panel">
            <span class="font-mono text-sm text-[color:var(--accent)]">ROI</span>
          </div>
          <div>
            <p class="font-display text-lg uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Keywords
            </p>
            <p class="font-display text-xl">ROI Calculator</p>
          </div>
        </a>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="theme-toggle"
            :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"
            @click="toggleTheme"
          >
            <span class="toggle-dot"></span>
            <span>{{ theme === 'dark' ? 'Night Shift' : 'Daylight' }}</span>
          </button>
          <a
            href="https://github.com/Kunsect/roi-calculator"
            rel="noopener noreferrer"
            target="_blank"
            class="btn-secondary text-sm"
          >
            View Source
          </a>
        </div>
      </header>

      <main class="flex-1 py-10">
        <slot />
      </main>

      <footer class="pb-10 pt-4">
        <div class="flex flex-col items-start gap-3 border-t border-[color:var(--line)] pt-6 text-sm">
          <p class="font-mono text-[color:var(--muted)]">
            Local processing only. No file leaves your device.
          </p>
          <div class="flex items-center gap-3 text-[color:var(--muted)]">
            <span class="font-display uppercase tracking-[0.3em]">Build 2025</span>
            <span class="h-1 w-1 rounded-full bg-[color:var(--accent)]"></span>
            <span>Kunsect LLC</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
const theme = useCookie('theme', {
  default: () => 'dark'
})

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

onMounted(() => {
  if (!theme.value && window.matchMedia('(prefers-color-scheme: light)').matches) {
    theme.value = 'light'
  }
})

useHead(() => ({
  title: 'Keywords ROI Calculator',
  meta: [
    {
      name: 'description',
      content: 'Import Semrush Excel to Generate ROI Table. | Keywords ROI Calculator'
    }
  ],
  htmlAttrs: {
    'data-theme': theme.value || 'dark'
  }
}))
</script>
