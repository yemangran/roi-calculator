<template>
  <section class="space-y-12">
    <div class="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="space-y-6">
        <div class="badge reveal" style="--d: 0.05s">Realtime ROI signal</div>
        <h1
          class="reveal font-display text-4xl leading-tight sm:text-5xl lg:text-6xl"
          style="--d: 0.1s"
        >
          Decode keyword potential with a clean, local pipeline.
        </h1>
        <p class="reveal max-w-xl text-base text-[color:var(--muted)] sm:text-lg" style="--d: 0.16s">
          Upload a Semrush export and let the calculator surface ROI-ranked keywords instantly. No
          network calls. No cloud upload. Pure on-device analysis.
        </p>
        <div class="reveal flex flex-col gap-4 sm:flex-row" style="--d: 0.22s">
          <button
            class="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            :disabled="btnDisabled"
            @click="triggerFileInput"
          >
            Import Semrush Excel
          </button>
          <div class="panel flex items-center gap-3 rounded-full px-5 py-3 text-sm">
            <span class="font-mono text-[color:var(--accent)]">v4</span>
            <span class="text-[color:var(--muted)]">Nuxt modern stack</span>
          </div>
        </div>
        <p class="reveal text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]" style="--d: 0.28s">
          Processed locally on this device
        </p>
        <input ref="fileInput" type="file" class="hidden" @change="handleFileUpload" />
      </div>

      <div class="panel reveal rounded-3xl p-6" style="--d: 0.2s">
        <div class="panel-strong rounded-2xl p-6">
          <p class="font-display text-lg">Signal Engine</p>
          <p class="mt-2 text-sm text-[color:var(--muted)]">
            A concise scoring layer that balances volume, CPC, and difficulty.
          </p>
          <div class="mt-6 grid gap-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-[color:var(--muted)]">Noise filter</span>
              <span class="font-mono text-[color:var(--accent)]">Adaptive</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-[color:var(--muted)]">Sorting</span>
              <span class="font-mono text-[color:var(--accent)]">ROI desc</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-[color:var(--muted)]">Exports</span>
              <span class="font-mono text-[color:var(--accent)]">.xlsx</span>
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
