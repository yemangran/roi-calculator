<template>
  <div class="panel table-shell">
    <div class="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative">
          <button
            type="button"
            class="btn-secondary text-sm"
            ref="kdButton"
            @click="toggleKdPanel"
          >
            <div v-if="kd.values.length" class="flex items-center gap-2">
              <span>KD: {{ kd.values[0] }}-{{ kd.values[1] }}%</span>
              <img
                v-if="kd.values.length"
                src="~/assets/icons/close.svg"
                width="14"
                @click.stop="updateKd([])"
              />
            </div>
            <div v-else class="flex items-center gap-2">
              <span class="text-[color:var(--muted)]">{{ $t('filters.kd') }}</span>
              <img src="~/assets/icons/drogdown.svg" width="12" />
            </div>
          </button>
          <div
            v-if="kd.visible"
            class="panel panel-strong panel-float top-full left-0 z-20 mt-2 w-56 rounded-2xl p-3"
            ref="kdPanel"
          >
            <div
              v-for="(item, index) in kd.selections"
              :key="index"
              class="flex justify-between px-3 py-2 text-sm text-[color:var(--muted)]"
              @click="updateKd(item)"
            >
              <span class="cursor-pointer">{{ item[0] }}-{{ item[1] }}%</span>
            </div>

            <div class="my-2 h-px w-full bg-[color:var(--line)]"></div>

            <div class="space-y-2">
              <span class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                {{ $t('filters.custom') }}
              </span>
              <input
                v-model="kd.min"
                type="number"
                class="field"
                :placeholder="$t('filters.from')"
              />
              <input
                v-model="kd.max"
                type="number"
                class="field"
                :placeholder="$t('filters.to')"
              />
              <button class="btn-primary w-full text-sm" @click="updateKd([kd.min, kd.max])">
                {{ $t('filters.apply') }}
              </button>
            </div>
          </div>
        </div>

        <div class="relative">
          <button
            type="button"
            class="btn-secondary text-sm"
            ref="volumeButton"
            @click="toggleVolumePanel"
          >
            <div v-if="volume.values.length" class="flex items-center gap-2">
              <span v-if="volume.values[1] === 99999999">
                Volume: {{ formatNumber(volume.values[0]) }}+
              </span>
              <span v-else>
                Volume: {{ formatNumber(volume.values[0]) }}-{{ formatNumber(volume.values[1]) }}
              </span>
              <img src="~/assets/icons/close.svg" width="14" @click.stop="updateVolume([])" />
            </div>

            <div v-else class="flex items-center gap-2">
              <span class="text-[color:var(--muted)]">{{ $t('filters.volume') }}</span>
              <img src="~/assets/icons/drogdown.svg" width="12" />
            </div>
          </button>
          <div
            v-if="volume.visible"
            class="panel panel-strong panel-float top-full left-0 z-20 mt-2 w-64 rounded-2xl p-3"
            ref="volumePanel"
          >
            <div
              v-for="(item, index) in volume.selections"
              :key="index"
              class="flex px-3 py-2 text-sm text-[color:var(--muted)]"
              @click="updateVolume(item)"
            >
              <span v-if="item[1] === 99999999" class="cursor-pointer">
                {{ formatNumber(item[0]) }}+
              </span>
              <span v-else class="cursor-pointer">
                {{ formatNumber(item[0]) }}-{{ formatNumber(item[1]) }}
              </span>
            </div>

            <div class="my-2 h-px w-full bg-[color:var(--line)]"></div>

            <div class="space-y-2">
              <span class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                {{ $t('filters.custom') }}
              </span>
              <input
                v-model="volume.min"
                type="number"
                class="field"
                :placeholder="$t('filters.from')"
              />
              <input
                v-model="volume.max"
                type="number"
                class="field"
                :placeholder="$t('filters.to')"
              />
              <button
                class="btn-primary w-full text-sm"
                @click="updateVolume([volume.min, volume.max])"
              >
                {{ $t('filters.apply') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <button class="btn-primary text-sm" @click="exportProcessedData">
        {{ $t('table.export') }}
      </button>
    </div>

    <div class="table-clip">
      <div class="overflow-x-auto">
        <table>
        <thead>
          <tr>
            <th class="text-left">{{ $t('table.keyword') }}</th>
            <th class="text-center">{{ $t('table.volume') }}</th>
            <th class="text-center">{{ $t('table.kd') }}</th>
            <th class="text-center">{{ $t('table.cpc') }}</th>
            <th class="text-center">{{ $t('table.roi') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in processedArr"
            :key="index"
            :class="{ 'bg-[color:var(--surface-strong)]': index % 2 === 1 }"
          >
            <td class="text-left">
              <a class="underline" :href="item.url" target="_blank">{{ item.keyword }}</a>
            </td>
            <td class="text-center font-mono">{{ item.volume }}</td>
            <td class="text-center font-mono">{{ item.kd }}</td>
            <td class="text-center font-mono">{{ item.cpc }}</td>
            <td class="text-center font-mono text-[color:var(--accent)]">
              {{ item.roi }}
            </td>
          </tr>
        </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },

  data() {
    return {
      originalArr: [],
      processedArr: [],

      kd: {
        visible: false,
        values: [],
        selections: [
          [85, 100],
          [70, 84],
          [50, 69],
          [30, 49],
          [15, 29],
          [0, 14]
        ],
        min: '',
        max: ''
      },

      volume: {
        visible: false,
        values: [],
        selections: [
          [100001, 99999999],
          [10001, 100000],
          [1001, 10000],
          [101, 1000],
          [11, 100],
          [1, 10]
        ],
        min: '',
        max: ''
      }
    }
  },

  methods: {
    handleClickOutside(event) {
      const target = event.target
      const kdPanel = this.$refs.kdPanel
      const kdButton = this.$refs.kdButton
      const volumePanel = this.$refs.volumePanel
      const volumeButton = this.$refs.volumeButton

      const clickedKd =
        (kdPanel && kdPanel.contains(target)) || (kdButton && kdButton.contains(target))
      const clickedVolume =
        (volumePanel && volumePanel.contains(target)) ||
        (volumeButton && volumeButton.contains(target))

      if (!clickedKd) this.kd.visible = false
      if (!clickedVolume) this.volume.visible = false
    },

    toggleKdPanel() {
      this.kd.visible = !this.kd.visible
      if (this.kd.visible) this.volume.visible = false
    },

    toggleVolumePanel() {
      this.volume.visible = !this.volume.visible
      if (this.volume.visible) this.kd.visible = false
    },

    processData(jsonData) {
      this.processedArr = []
      this.originalArr = []

      jsonData.forEach((item) => {
        const volume = this.parseNumber(item.Volume)
        const kd = this.parseNumber(item['Keyword Difficulty'])
        const cpc = this.parseNumber(item['CPC (USD)'])
        const keyword = item.Keyword

        const hasValidRoi = kd > 0 && volume >= 0 && cpc >= 0
        const roiValue = hasValidRoi ? (volume * cpc) / kd : 0
        const roiDisplay = hasValidRoi ? roiValue.toFixed(2) : '-'

        if (keyword) {
          this.originalArr.push({
            keyword,
            volume: Number.isFinite(volume) ? volume : 0,
            kd: Number.isFinite(kd) ? kd : 0,
            cpc: Number.isFinite(cpc) ? cpc : 0,
            roi: roiDisplay,
            roiValue,
            url: 'https://www.google.com/search?q=' + keyword
          })
        }
      })

      this.originalArr.sort((a, b) => b.roiValue - a.roiValue)

      this.filterOriginalArr()
    },

    updateKd(rangeArr) {
      rangeArr = this.adjustRangeArr(rangeArr, 0, 100)

      this.kd.values = rangeArr
      this.kd.visible = false

      this.filterOriginalArr()
    },

    updateVolume(rangeArr) {
      rangeArr = this.adjustRangeArr(rangeArr, 0, 99999999)

      this.volume.values = rangeArr
      this.volume.visible = false

      this.filterOriginalArr()
    },

    adjustRangeArr(rangeArr, minValue, maxValue) {
      if (rangeArr.length) {
        rangeArr[0] = parseInt(rangeArr[0] || minValue)
        rangeArr[1] = parseInt(rangeArr[1] || maxValue)
        if (rangeArr[0] > rangeArr[1]) rangeArr = [rangeArr[1], rangeArr[0]]
      }

      return rangeArr
    },

    filterOriginalArr() {
      const kdValuesLength = this.kd.values.length
      const volumeValuesLength = this.volume.values.length

      this.processedArr = this.originalArr.filter((item) => {
        let kdCondition = true
        let volumeCondition = true

        if (kdValuesLength) {
          kdCondition = item.kd >= this.kd.values[0] && item.kd <= this.kd.values[1]
        }

        if (volumeValuesLength) {
          volumeCondition =
            item.volume >= this.volume.values[0] && item.volume <= this.volume.values[1]
        }

        return kdCondition && volumeCondition
      })
    },

    async exportProcessedData() {
      // 动态导入 xlsx 和 file-saver（仅在客户端）
      const XLSX = await import('xlsx')
      const FileSaver = await import('file-saver')

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(this.processedArr)
      XLSX.utils.book_append_sheet(wb, ws, 'Processed Data')
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

      FileSaver.saveAs(
        new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }),
        'processed-data.xlsx'
      )
    },

    s2ab(s) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff
      return buf
    },

    formatNumber(value) {
      if (value === null || value === undefined || value === '') return '0'
      return parseInt(value).toLocaleString('en-US')
    },

    parseNumber(value) {
      if (value === null || value === undefined || value === '') return 0
      if (typeof value === 'number') return value
      const normalized = String(value).replace(/,/g, '').trim()
      const parsed = Number(normalized)
      return Number.isFinite(parsed) ? parsed : 0
    }
  }
}
</script>
