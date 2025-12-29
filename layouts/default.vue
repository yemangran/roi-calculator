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
              {{ $t('header.keywords') }}
            </p>
            <p class="font-display text-xl">{{ $t('header.roiCalculator') }}</p>
          </div>
        </a>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="locale-toggle"
            @click="handleLocaleToggle"
          >
            <span class="locale-dot"></span>
            <span class="locale-code">{{ locale.toUpperCase() }}</span>
            <span class="locale-divider"></span>
            <span class="locale-name">{{ currentLocaleName }}</span>
          </button>
          <button
            type="button"
            class="theme-toggle"
            :aria-label="
              $t('theme.switchTo', { mode: theme === 'dark' ? $t('theme.light') : $t('theme.dark') })
            "
              @click="toggleTheme"
            >
              <span class="toggle-dot"></span>
            <span>{{ theme === 'dark' ? $t('theme.nightShift') : $t('theme.daylight') }}</span>
            </button>
          <a
            href="https://github.com/yemangran/roi-calculator"
            rel="noopener noreferrer"
            target="_blank"
            class="source-link"
          >
            <span class="source-dot"></span>
            <svg class="source-icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span class="source-text">{{ $t('header.viewSource') }}</span>
          </a>
        </div>
      </header>

      <main class="flex-1 py-10">
        <slot />
      </main>

      <footer class="pb-10 pt-4">
        <div class="flex flex-col items-start gap-3 border-t border-[color:var(--line)] pt-6 text-sm">
          <p class="font-mono text-[color:var(--muted)]">{{ $t('footer.localNote') }}</p>
          <div class="flex items-center gap-3 text-[color:var(--muted)]">
            <span class="font-display uppercase tracking-[0.3em]">{{ $t('footer.build') }}</span>
            <span class="h-1 w-1 rounded-full bg-[color:var(--accent)]"></span>
            <span>{{ $t('footer.company') }}</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
const { t, locale, locales, setLocale } = useI18n()

const theme = useCookie('theme', {
  default: () => 'dark'
})

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

// 获取当前语言名称
const currentLocaleName = computed(() => {
  const current = locales.value.find(l => l.code === locale.value)
  return current?.name || locale.value
})

// 切换语言（在两种语言之间切换）
const handleLocaleToggle = async () => {
  const currentIndex = locales.value.findIndex(l => l.code === locale.value)
  const nextIndex = (currentIndex + 1) % locales.value.length
  const nextLocale = locales.value[nextIndex].code
  await setLocale(nextLocale)
}

onMounted(() => {
  if (!theme.value && window.matchMedia('(prefers-color-scheme: light)').matches) {
    theme.value = 'light'
  }
})

useHead(() => ({
  title: t('app.title'),
  meta: [
    {
      name: 'description',
      content: t('app.description')
    }
  ],
  htmlAttrs: {
    'data-theme': theme.value || 'dark'
  }
}))
</script>
