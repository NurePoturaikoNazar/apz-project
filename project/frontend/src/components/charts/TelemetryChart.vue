<template>
  <div class="telemetry-chart">
    <div v-if="loading" class="chart-loading">
      <SkeletonLoader variant="card" height="300px" />
    </div>
    <div v-else-if="!hasData" class="chart-empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 100 4 2 2 0 000-4z"/></svg>
      <p>{{ t('telemetry.noData') }}</p>
    </div>
    <div v-else class="chart-wrapper">
      <apexchart
        type="area"
        height="300"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VueApexCharts from 'vue3-apexcharts'
import SkeletonLoader from '../ui/SkeletonLoader.vue'

// Define the apexchart component locally if not registered globally
const apexchart = VueApexCharts

const props = defineProps({
  data: { type: Array, required: true },
  type: { type: String, required: true }, // 'temperature', 'humidity', 'lightLevel', 'soundLevel'
  loading: { type: Boolean, default: false }
})

const { t } = useI18n()

const hasData = computed(() => props.data && props.data.length > 0)

const colorsMap = {
  temperature: '#FF6B9D', // Pink/Red
  humidity: '#00D4FF',    // Blue
  light_level: '#FFA502',  // Yellow/Orange
  sound_level: '#A855F7'   // Purple
}

const namesMap = {
  temperature: t('telemetry.temperature'),
  humidity: t('telemetry.humidity'),
  light_level: t('telemetry.light'),
  sound_level: t('telemetry.sound')
}

const unitsMap = {
  temperature: t('telemetry.units.celsius'),
  humidity: t('telemetry.units.percent'),
  light_level: t('telemetry.units.lux'),
  sound_level: t('telemetry.units.decibel')
}

const series = computed(() => {
  if (!hasData.value) return []
  
  // Sort data by time ascending for the chart
  const sortedData = [...props.data].sort((a, b) => {
    const tA = a.recorded_at || a.created_at
    const tB = b.recorded_at || b.created_at
    return new Date(tA) - new Date(tB)
  })
  
  return [{
    name: namesMap[props.type],
    data: sortedData.map(item => {
      const t = item.recorded_at || item.created_at
      return {
        x: new Date(t).getTime(),
        y: item[props.type]
      }
    })
  }]
})

const chartOptions = computed(() => {
  const color = colorsMap[props.type] || '#00D4FF'
  
  return {
    chart: {
      type: 'area',
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
            enabled: true,
            delay: 150
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        }
      }
    },
    colors: [color],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: '#8B95A8', fontSize: '11px' },
        datetimeUTC: false,
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#8B95A8', fontSize: '11px' },
        formatter: (value) => {
          return value !== undefined && value !== null ? value.toFixed(1) : value
        }
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.05)',
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 0, bottom: 0, left: 10 }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (val) {
          return val + ' ' + unitsMap[props.type]
        }
      },
      x: {
        format: 'dd MMM yyyy HH:mm:ss'
      },
      style: {
        fontSize: '12px'
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.telemetry-chart {
  width: 100%;
  position: relative;
}

.chart-empty {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $text-muted;
  background: rgba(255, 255, 255, 0.02);
  border-radius: $radius-lg;
  border: 1px dashed rgba(255, 255, 255, 0.1);

  svg {
    margin-bottom: $space-3;
    opacity: 0.5;
  }
}

.chart-wrapper {
  // Override ApexCharts default styles for dark theme
  :deep(.apexcharts-tooltip) {
    background: $bg-secondary !important;
    border: 1px solid $bg-glass-border !important;
    box-shadow: $shadow-lg !important;
    border-radius: $radius-md !important;
  }
  
  :deep(.apexcharts-tooltip-title) {
    background: rgba(255, 255, 255, 0.05) !important;
    border-bottom: 1px solid $bg-glass-border !important;
    font-family: $font-family !important;
    font-weight: 600 !important;
  }
  
  :deep(.apexcharts-text tspan) {
    font-family: $font-family !important;
  }
}
</style>
