<!--This is a component only used for decorative background, without any practical function-->

<script setup lang="ts">
interface Props {
  xCount?: number,
  barMin?: number,
  barMax?: number,
  intervalMin?: number,
  intervalMax?: number
}

const props = withDefaults(defineProps<Props>(), {
  xCount: 10,
  barMin: 0.2,
  barMax: 1,
  intervalMin: 1,
  intervalMax: 3,
})

interface ChartElement {
  value1: number,
  value2: number,
  interval: number
}


function buildBarData() {
  let barData: ChartElement[] = []
  for (let i = 0; i < props.xCount; i++) {
    barData.push({
      value1: props.barMin + Math.random() * (props.barMax - props.barMin),
      value2: props.barMin + Math.random() * (props.barMax - props.barMin),
      interval: props.intervalMin + Math.random() * (props.intervalMax - props.intervalMin),
    })
  }
  return barData
}

let barData: ChartElement[] = buildBarData()

</script>

<template>
  <div class="chartLikeBackground">
    <div class="barChart">
      <div v-for="(barDatum, i) in barData" :key="i" class="bar"
        :style="{ '--fake-value-1': barDatum.value1, '--fake-value-2': barDatum.value2, '--ani-interval': barDatum.interval }" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.barChart {
  display: flex;
  align-items: end;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  position: absolute;
  padding: 2rem;

  .bar {
    width: 100%;
    margin: 0 1rem;
    background: var(--light-grey);
    opacity: 0.5;
    animation: barChange calc(1s * var(--ani-interval)) ease-in-out alternate-reverse infinite;
  }

  @keyframes barChange {
    0%, 20%{
      height: calc(100% * var(--fake-value-1));
    }
    80%, 100% {
      height: calc(100% * var(--fake-value-2));
    }
  }
}
</style>