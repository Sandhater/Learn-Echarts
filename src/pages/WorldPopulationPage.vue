<script setup lang="ts">
import {ref, computed, onMounted, provide} from 'vue'
import VChart, {THEME_KEY} from 'vue-echarts'
import { EChartsOption } from 'echarts'
import { use, registerMap } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { MapChart, LineChart, SunburstChart } from 'echarts/charts';
import {
  GeoComponent,
  ToolboxComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent
} from 'echarts/components'

import jsonToObject from '../utils/jsonToObject.ts'
import dataset from '../data/world_population.json'
import worldMap from '../data/world.json'
import RadioButton from '../components/RadioButton.vue'
import { useThemeStore } from '../utils/store.ts'


use([
    SVGRenderer,
    MapChart,
    LineChart,
    SunburstChart,
    GeoComponent,
    ToolboxComponent,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    VisualMapComponent,
])

const themeStore = useThemeStore()
provide(THEME_KEY, themeStore.theme)


class CountryOrRegion {
  public Rank: number = 1
  public CCA3: string = ''
  public Country_Territory: string = ''
  public Capital: string = ''
  public Continent: string = ''
  public Population2022: number = 0
  public Population2020: number = 0
  public Population2015: number = 0
  public Population2010: number = 0
  public Population2000: number = 0
  public Population1990: number = 0
  public Population1980: number = 0
  public Population1970: number = 0
  public Area_km2: number = 0
  public Density_per_km2: number = 0
  public Growth_Rate: number = 0
  public World_Population_Percentage: number = 0
}

const data: CountryOrRegion[] = dataset.map(el => jsonToObject<CountryOrRegion>(CountryOrRegion, el))

const COLOR_SERIES = ['#a9cf78', '#f3a56b', '#579df4','#f6d44c',
  '#f1a6c3','#fb6060', '#67dfbe', '#8b64fb']

//#region Chart 1.1: the population map
interface PopulationByYear {
  [year: string]: { name: string, value: number }[]
}
let populationByYear: PopulationByYear = {
  '2022': [], '2020': [], '2015': [], '2010': [], '2000': [], '1990': [], '1980': [], '1970': []
}
let totalPopulationByYear: {[year: string]: number} = {
  '2022': 0, '2020': 0, '2015': 0, '2010': 0, '2000': 0, '1990': 0, '1980': 0, '1970': 0
}
data.forEach(el => {
  for (const year in populationByYear) {
    const populationKey = `Population${year}` as keyof CountryOrRegion
    if (populationKey in el) {
      const population = el[populationKey] as number
      populationByYear[year].push({
        name: el.Country_Territory,
        value: population,
      })
      totalPopulationByYear[year] += population
    }
  }
})

const POPULATION_RANK: number[] = [5000000, 7500000, 10000000, 25000000, 50000000, 75000000, 100000000, 200000000, 300000000, 500000000, 700000000, 1000000000, 1300000000]
const VISUAL_MAP_COLORS: string[] = [
  '#313695', '#4575b4', '#74add1', '#abd9e9',
  '#e0f3f8', '#ecfff1', '#ffffbf', '#fee090',
  '#fdae61', '#f46d43', '#dd3b32', '#c6002e',
  '#a50026', '#75000f'
]

const SEQUENTIAL_YEARS = [1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022]
const YEARS = [2022, 2020, 2015, 2010, 2000, 1990, 1980, 1970]
const selectedYear = ref<number>(YEARS[0])
const selectedCountryRegionIndex = ref<number>(-1)

function buildVisualMapPieces() {
  let result = [] as {}[]
  if (POPULATION_RANK.length > 0 && VISUAL_MAP_COLORS.length > 0) {
    result.push({ lte: POPULATION_RANK[0] - 1, label: `＜${POPULATION_RANK[0]}`, color: VISUAL_MAP_COLORS[0] })
    for (let i = 0; i < POPULATION_RANK.length - 1; i++) {
      let lowerBound = POPULATION_RANK[i]
      let upperBound = POPULATION_RANK[i + 1]
      if (i == POPULATION_RANK.length - 2) {
        result.push({
          gte: lowerBound,
          label: `≥${POPULATION_RANK[POPULATION_RANK.length - 1]}`,
          color: VISUAL_MAP_COLORS[Math.min(i + 1, VISUAL_MAP_COLORS.length - 1)]
        })
        break
      }
      result.push({
        gte: lowerBound,
        lte: upperBound - 1,
        label: `${lowerBound} ~ ${upperBound}`,
        color: VISUAL_MAP_COLORS[Math.min(i + 1, VISUAL_MAP_COLORS.length - 1)]
      })
    }
  }
  return result
}

const mapOption = computed<EChartsOption>(() => { return {
  title: {
    text: 'World Population',
    top: 15,
    right: 15
  },
  tooltip: {
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2
  },
  backgroundColor: 'transparent',
  visualMap: {
    type: 'piecewise',
    bottom: 15,
    right: 15,
    precision: 0,
    pieces: buildVisualMapPieces(),
    text: ['High', 'Low'],
    calculable: true
  },
  // geo: {
  //   map: 'world',
  //   roam: true,
  // },
  // toolbox: {
  //   show: true,
  //   left: 'left',
  //   top: 'top',
  //   feature: {
  //     dataView: { readOnly: false },
  //     restore: {},
  //     saveAsImage: {}
  //   }
  // },
  series: {
    name: 'Population',
    type: 'map',
    roam: true,
    map: 'world',
    emphasis: {
      label: {
        show: true,
        color: '#436527',
        fontWeight: 800
      },
      focus: 'self',
      itemStyle: {
        areaColor: COLOR_SERIES[0],
        borderColor: '#436527',
        borderWidth: 1
      }
    },
    select: {
      label: {
        show: true,
        color: '#436527',
        fontWeight: 800
      },
      itemStyle: {
        areaColor: COLOR_SERIES[0],
        borderColor: '#436527',
        borderWidth: 1
      }
    },
    data: populationByYear[selectedYear.value.toString()]
  }
}})

const globalMap = ref<any>(null)

onMounted(() => {
  registerMap('world', worldMap as any);
});

function mapSelectChanged(params: any) {
  if (params.selected.length > 0)
    selectedCountryRegionIndex.value = params.selected[0].dataIndex[0]
  else
    selectedCountryRegionIndex.value = -1
}

//#endregion


//#region Chart 1.2: line chart for selected country or region
const selectedCountryRegionName = computed<string>(() => {
  return populationByYear[selectedYear.value.toString()][selectedCountryRegionIndex.value].name
})

function extractCountryRegionData() {
  const countryRegionData: CountryOrRegion = data.filter(el => {
    return el.Country_Territory === selectedCountryRegionName.value
  })[0]

  let dataResult: [number, number][] = []
  SEQUENTIAL_YEARS.forEach(year => {
    const populationKey = `Population${year}` as keyof CountryOrRegion
    const population = countryRegionData[populationKey] as number
    dataResult.push([year, population])
  })
  return dataResult
}

const lineChartOption = computed<EChartsOption>(() => {
  if (selectedCountryRegionIndex.value < 0)
    return {}
  return {
    title: {
      text: `Population Change of ${selectedCountryRegionName.value}`,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          formatter: (params) => { return `${params.value}` }
        }
      }
    },
    backgroundColor: 'transparent',
    grid: {
      left: 100,
      right: 32,
      top: 32,
      bottom: 24,
    },
    color: COLOR_SERIES,
    xAxis: {
      type: 'value',
      min: 1970,
      max: 2022,
      axisLabel: {
        formatter: (value, index) => { return `${value}` }
      },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        name: 'Population',
        type: 'line',
        symbolSize: 6,
        lineStyle: { width: 3 },
        data: extractCountryRegionData()
      }
    ]
}})

//#endregion


//#region Chart 2.1: the stacked area chart of continents' population
class Continent {
  public name: string = ''
  public population2022: number = 0
  public population2020: number = 0
  public population2015: number = 0
  public population2010: number = 0
  public population2000: number = 0
  public population1990: number = 0
  public population1980: number = 0
  public population1970: number = 0
  public memberIndexes: number[] = []
}

let continentNames = [] as string[]
let populationByContinent = {} as {[name: string]: Continent}

let elIndex = 0
data.forEach(el => {
  const continent = el.Continent
  if (!(continent in populationByContinent)) {
    continentNames.push(continent)
    populationByContinent[continent] = new Continent()
    populationByContinent[continent].name = continent
  }
  YEARS.forEach(year => {
    (populationByContinent as any)[continent][`population${year}` as keyof Continent] += el[`Population${year}` as keyof CountryOrRegion]
  })
  populationByContinent[continent].memberIndexes.push(elIndex)
  elIndex += 1
})

function buildContinentSeries() {
  let series = [] as object[]
  continentNames.forEach(continentName => {
    let continent: Continent = populationByContinent[continentName]
    series.push({
      name: continent.name,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      symbolSize: 6,
      lineStyle: { width: 3 },
      emphasis: {
        focus: 'series'
      },
      data: [continent.population1970, continent.population1980, continent.population1990,
        continent.population2000, continent.population2010, continent.population2020],
    })
  })
  return series
}

const stackedChartOption = computed<EChartsOption>(() => { return {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  backgroundColor: 'transparent',
  legend: {
    data: continentNames
  },
  color: COLOR_SERIES.slice(1, 7),
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [1970, 1980, 1990, 2000, 2010, 2020],
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: buildContinentSeries()
}})

//#endregion


//#region Chart 2.2: the sunburst chart to show the inner distribution of a continent
interface SunburstDatum {
  name: string,
  value: number,
  label?: {
    show?: boolean
  },
  children: SunburstDatum[],
  itemStyle?: any
}

function buildSunburstData(): SunburstDatum[] {
  let result = [] as SunburstDatum[]
  continentNames.forEach(continentName => {
    let continent: Continent = populationByContinent[continentName]

    let members: CountryOrRegion[] = continent.memberIndexes.map(index => data[index])
    let top5Members: CountryOrRegion[] = members.sort((a, b) => b.Population2022 - a.Population2022).slice(0, 5)

    let childrenList: SunburstDatum[] = top5Members.map(member => { return {
      name: member.Country_Territory,
      value: member.Population2022,
      itemStyle: { opacity: 1},
      children: []
    }})
    let otherPopulation = continent.population2022 - top5Members.reduce((sum, member) => sum + member.Population2022, 0)
    childrenList.push({
      name: 'Others',
      value: otherPopulation,
      itemStyle: { opacity: 0.6 },
      children: []
    })

    result.push({
      name: continent.name,
      value: continent.population2022,
      children: childrenList
    })
  })

  // Hide some countries'/regions' labels if their areas in the sunburst chart is too small
  const totalPopulation = result.reduce((sum, continent) => sum + continent.value, 0)
  result.forEach(continent => {
    continent.children.forEach(member => {
      member.label = {
        show: member.value > totalPopulation / 96
      }
    })
  })

  return result
}

const innerSunChartOption = computed<EChartsOption>(() => { return {
  color: COLOR_SERIES.slice(0, 7),
  title: {
    text: 'Population Distribution in 2022',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  backgroundColor: 'transparent',
  series: [
    {
      type: 'sunburst',
      sort: undefined,
      emphasis: {
          focus: 'ancestor'
      },
      data: buildSunburstData(),
      radius: [0, '85%'],
      label: {
        rotate: 'radial',
        overflow: 'breakAll'
      }
    }
  ]
}})

</script>


<template>
  <div id="WorldPopulationPage">
    <div id="InfoArea">
      <h1>World Population Data</h1>
      <p>
        The dataset comes from <a target="_blank" href="https://www.kaggle.com/datasets/iamsouravbanerjee/world-population-dataset">World Population Dataset</a> on kaggle.
        The GeoJSON map comes from <a target="_blank" href="https://echarts.apache.org/examples/data/asset/geo/world.json">Echarts</a>.
      </p>
      <p>
        Both the dataset and GeoJSON files are modified so that the names of countries/regions in them can match.
        However, this page is only used to show the capability of Echarts' visualizing map-based statistics, and the map including the names, boundaries, etc. of countries/regions is not official or authoritative.
      </p>
    </div>
    <div id="ChartArea">
      <div id="PopulationMap" class="chartWrapper">
        <h2>Population Visual Map</h2>
        <p >Please select a year to see the population distribution. And select a country/region to see its population change.</p>
        <div class="operationPanel">
          <radio-button class="radioButton" v-for="year in YEARS" :key="year"
              :content="year.toString()" :option-value="year" v-model="selectedYear" :active-color="COLOR_SERIES[0]" />
        </div>
        <v-chart id="GlobalMap" class="chart" :option="mapOption" autoresize @selectchanged="mapSelectChanged" />
        <v-chart id="CountryRegionLineChart" clas="chart" :option="lineChartOption" v-if="selectedCountryRegionIndex > 0"/>
      </div>
      <div id="ContinentDistribution" class="chartWrapper">
        <h2>Continent Distribution</h2>
        <p>The left part shows the distribution change of continents' population from 1970-2020; the right part shows the distribution in 2022.</p>
        <div class="infoPanel">
          <v-chart id="GlobalStackedChart" class="chart" :option="stackedChartOption" autoresize />
          <v-chart id="InnerSunChart" class="chart" :option="innerSunChartOption" autoresize/>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
#WorldPopulationPage {
  --theme-color1: #a9cf78;
  --theme-color2: #436527;

  background: var(--background-color);

  .chartWrapper {
    padding: 0 var(--content-margin);
  }
}

#InfoArea {
  padding-left: var(--content-margin);
  padding-right: var(--content-margin);
}

#ChartArea {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  height: fit-content;

  #PopulationMap {
    width: 100%;
    height: fit-content;
    position: relative;

    .operationPanel {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 1rem;

      .radioButton {
        margin-right: 1px;
      }
    }

    #GlobalMap {
      height: 80vh;
      border: 2px dashed var(--theme-color1);
    }

    #CountryRegionLineChart {
      height: 30vh;
      z-index: 1;
      margin-top: 1rem;
    }
  }

  #ContinentDistribution {
    width: 100%;
    height: fit-content;

    .infoPanel {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 50vh;

      .chart:nth-child(1) {
        width: calc(100% - 50vh);
      }

      .chart:nth-child(2) {
        width: 50vh;
      }
    }
  }
}

</style>