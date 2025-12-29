<template>
  <section class="space-y-12">
    <div class="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="space-y-6">
        <div class="badge reveal" style="--d: 0.05s">{{ $t('hero.badge') }}</div>
        <h1
          class="reveal font-display text-4xl leading-tight sm:text-5xl lg:text-6xl"
          style="--d: 0.1s"
        >
          {{ $t('hero.title') }}
        </h1>
        <p class="reveal max-w-xl text-base text-[color:var(--muted)] sm:text-lg" style="--d: 0.16s">
          {{ $t('hero.subtitle') }}
        </p>
        <div class="reveal flex flex-col gap-4 sm:flex-row" style="--d: 0.22s">
          <button
            class="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            :disabled="btnDisabled"
            @click="triggerFileInput"
          >
            {{ $t('hero.cta') }}
          </button>
          <div class="panel flex items-center gap-3 rounded-full px-5 py-3 text-sm">
            <span class="font-mono text-[color:var(--accent)]">v4</span>
            <span class="text-[color:var(--muted)]">{{ $t('hero.version') }}</span>
          </div>
        </div>
        <p
          class="reveal text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]"
          style="--d: 0.28s"
        >
          {{ $t('hero.localOnly') }}
        </p>
        <input ref="fileInput" type="file" class="hidden" @change="handleFileUpload" />
      </div>

      <div class="panel reveal rounded-3xl p-6" style="--d: 0.2s">
        <div class="panel-strong rounded-2xl p-6">
          <p class="font-display text-lg">{{ $t('hero.signalTitle') }}</p>
          <p class="mt-2 text-sm text-[color:var(--muted)]">{{ $t('hero.signalSubtitle') }}</p>
          <div class="mt-6 grid gap-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-[color:var(--muted)]">{{ $t('hero.signalNoise') }}</span>
              <span class="font-mono text-[color:var(--accent)]">
                {{ $t('hero.signalNoiseValue') }}
              </span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-[color:var(--muted)]">{{ $t('hero.signalSorting') }}</span>
              <span class="font-mono text-[color:var(--accent)]">
                {{ $t('hero.signalSortingValue') }}
              </span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-[color:var(--muted)]">{{ $t('hero.signalExports') }}</span>
              <span class="font-mono text-[color:var(--accent)]">
                {{ $t('hero.signalExportsValue') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="reveal" style="--d: 0.3s">
      <BaseTable ref="baseTable" />
    </div>
  </section>
</template>

<script>
import * as XLSX from 'xlsx'

export default {
  data() {
    return {
      btnDisabled: false
    }
  },

  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    handleFileUpload(event) {
      const file = event.target.files[0]

      if (file) {
        this.btnDisabled = true

        const reader = new FileReader()
        reader.onload = (e) => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const sheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(sheet)

          this.$refs.baseTable.processData(jsonData)

          this.btnDisabled = false
        }

        reader.readAsBinaryString(file)
      }
    }
  }
}
</script>
