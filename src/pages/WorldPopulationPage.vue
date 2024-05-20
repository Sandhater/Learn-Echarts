<script setup lang="ts">
import { ref, computed } from "vue"

import jsonToInterface from "../utils/jsonToInterface.ts"
import dataset from '../data/world_population.json'




</script>


<template>
  <div id="WorldPopulationPage">
    <div id="InfoArea">
      <h1>World Population Data</h1>
      <p>Based on the dataset
        <a target="_blank" href="https://www.kaggle.com/datasets/iamsouravbanerjee/world-population-dataset">World Population Dataset</a>
        on kaggle.</p>
    </div>
    <div id="ChartArea">
      <div id="PopulationMap">

      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
#WorldPopulationPage {
  padding: 0 var(--content-margin)
}

</style>