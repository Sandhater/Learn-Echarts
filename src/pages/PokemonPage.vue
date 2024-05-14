<template>
  <div id="PokemonPage">
    <div id="InfoArea">
      <h1>Pokémon Data</h1>
      <p>Based on the dataset
        <a target="_blank" href="https://www.kaggle.com/datasets/ingmateleal/pokemon-all-9-gen-information">Pokemon all 9 gen information</a>
        on kaggle.</p>
    </div>
    <div id="ChartArea">
      <div id="TypeChart" class="chartWrapper">
        <h2>Pokemons' Types</h2>
        <v-chart class="chart" :option="typeChartOption" autoresize />
      </div>
      <div id="ColorChart" class="chartWrapper">
        <h2>Pokemon's Colors</h2>
        <v-chart class="chart" :option="colorChartOption" autoresize />
      </div>
      <div id="StatBoxChart" class="chartWrapper">
        <h2>Pokemon's Stats</h2>
        <v-chart class="chart" :option="statBoxOption" autoresize />
      </div>
      <div id="ViriantChart" class="chartWrapper">
        <h2>Pokemon's Regional Viriants</h2>
        <v-chart class="chart" :option="viriantChartOption" autoresize />
      </div>
      <div id="AbilityChart" class="chartWrapper">
        <h2>Pokemon's Abilities</h2>
        <v-chart class="chart" :option="abilityChartOption" autoresize />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, provide } from 'vue'
import { use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { PieChart, BarChart, ScatterChart, HeatmapChart, BoxplotChart, SankeyChart, TreemapChart } from 'echarts/charts';
import {
  GridComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  DataZoomComponent,
  DatasetComponent
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';

import jsonToInterface from '../utils/jsonToInterface'
import dataset from '../data/pokemon.json'
import { boxplotAnalyze } from '../utils/statistic'

// Prepare the echarts
use([
  SVGRenderer,
  PieChart,
  BarChart,
  ScatterChart,
  HeatmapChart,
  BoxplotChart,
  SankeyChart,
  TreemapChart,
  GridComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  DataZoomComponent,
  DatasetComponent
]);

// provide(THEME_KEY, 'dark')


// Preprocess the JSON data
dataset.forEach(pokemon => {
  pokemon.Branch_Code = pokemon.Branch_Code.split('_')[1]
})

class Pokemon {
  public No: number = 0
  public Branch_Code: number = 0
  public Original_Name: string = ''
  public Name: string = ''
  public Gen: number = 1
  public Height: number = 0
  public Weight: number = 0
  public Type1: string = ''
  public Type2: string = ''
  public Ability1: string = ''
  public Ability2: string = ''
  public Ability_Hidden: string = ''
  public Color: string = ''
  public Gender_Male: number = 0
  public Gender_Female: number = 0
  public Gender_Unknown: number = 0
  public Egg_Cycles: number = 0
  public Egg_Steps: number = 0
  public Egg_Groups1: string = ''
  public Egg_Groups2: string = ''
  public Get_Rate: number = 0
  public Base_Experience: number = 0
  public Experience_Type: number = 0
  public Category: string = 'Ordinary'
  public Mega_Evolution_Flag: number = 0
  public Region_Form_Flag: number = 0
  public HP: number = 0
  public Attack: number = 0
  public Defense: number = 0
  public SP_Attack: number = 0
  public SP_Defense: number = 0
  public Speed: number = 0
  public E_HP: number = 0
  public E_Attack: number = 0
  public E_Defense: number = 0
  public E_SP_Attack: number = 0
  public E_SP_Defense: number = 0
  public E_Speed: number = 0
}

const data: Pokemon[] = dataset.map(el => jsonToInterface<Pokemon>(Pokemon, el))

const standardTypeSeries = ['Grass', 'Fire', 'Water', 'Electric', 'Ice', 'Ground', 'Flying', 'Rock', 'Normal', 'Bug', 'Poison', 'Fighting', 'Psychic', 'Ghost', 'Dragon', 'Steel', 'Dark', 'Fairy']
const standardColorSeries = ['#429837', '#e7623d', '#2e9be3', '#f4cc1b', '#43c7c6', '#a47840', '#73abcf', '#a5a580', '#818181', '#9ba32a', '#9257ca', '#e29219', '#e66d8f', '#6b476e', '#536eb7', '#69acc5', '#4d4646', '#da84d3']
 

// Chart 1: the bar chart about pokemons' types.
interface TypeCounter {
  [type: string]: [number, number, number]
}
let typeCounter: TypeCounter = {} as TypeCounter
data.forEach(pokemon => {
  if (pokemon.Type1 != '' && !(pokemon.Type1 in typeCounter))
    typeCounter[pokemon.Type1] = [0, 0, 0]
    if (pokemon.Type2 != '' && !(pokemon.Type2 in typeCounter))
    typeCounter[pokemon.Type2] = [0, 0, 0]

  if (pokemon.Type2 === '')
    typeCounter[pokemon.Type1][0]++    // The count of pokemons who have this type purely
  else {
    typeCounter[pokemon.Type1][1]++    // The count of pokemons who have this type as the primary type
    typeCounter[pokemon.Type2][2]++    // The count of pokemons who have this type as the secondary type
  }
})
let typeNames: string[] = []
let flattenedTypeCounter: [number[], number[], number[]] = [[], [], []]
for (const typeName in typeCounter) {
  typeNames.push(typeName)
  flattenedTypeCounter[0].push(typeCounter[typeName][0])   // Pure type pokemons' counts
  flattenedTypeCounter[1].push(typeCounter[typeName][1])   // Primary type pokemons' counts
  flattenedTypeCounter[2].push(typeCounter[typeName][2])   // Secondary type pokemons' counts
}

const typeChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    confine: true
  },
  color: standardColorSeries.slice(1, 4),
  legend: {},
  grid: {
    left: '0%',
    right: '3%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: typeNames
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: 'Count',
      nameTextStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: 'black'
      }
    }
  ],
  series: [
    {
      name: 'Pure Type',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: flattenedTypeCounter[0]
    },
    {
      name: 'Primary Type',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: flattenedTypeCounter[1]
    },
    {
      name: 'Secondary Type',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: flattenedTypeCounter[2]
    }
  ]
})


// Chart 2: the heatmap chart of pokemons' type and colors
interface ColorCounterItem {
  [color: string]: number
}
interface ColorCounterByType {
  [type: string]: ColorCounterItem
}
let colorCounterByType = {} as ColorCounterByType
let colorCategorySet: Set<string> = new Set<string>()
data.forEach(pokemon => {
  if (pokemon.Type1 != '') {
    if (!(pokemon.Type1 in colorCounterByType))
      colorCounterByType[pokemon.Type1] = {} as ColorCounterItem
    if (!(pokemon.Color in colorCounterByType[pokemon.Type1]))
      colorCounterByType[pokemon.Type1][pokemon.Color] = 0
    colorCounterByType[pokemon.Type1][pokemon.Color]++
  }

  if (pokemon.Type2 != '') {
    if (!(pokemon.Type2 in colorCounterByType))
      colorCounterByType[pokemon.Type2] = {} as ColorCounterItem
    if (!(pokemon.Color in colorCounterByType[pokemon.Type2]))
      colorCounterByType[pokemon.Type2][pokemon.Color] = 0
    colorCounterByType[pokemon.Type2][pokemon.Color]++
  }

  if (!(pokemon.Color in colorCategorySet))
    colorCategorySet.add(pokemon.Color)
})
let colorCategories: string[] = []
colorCategorySet.forEach(color => colorCategories.push(color))
let colorChartSeries: [number, number, number][] = []
let colorCountMax: number = 0
for(let i = 0; i < typeNames.length; i++) {
  for (let j = 0; j < colorCategories.length; j++) {
    let typeName = typeNames[i]
    let colorCategory = colorCategories[j]
    if (typeName in colorCounterByType) {
      let counterItem = colorCounterByType[typeName]
      if (colorCategory in counterItem) {
        let count = counterItem[colorCategory]
        colorChartSeries.push([i, j, count])
        if (count > colorCountMax)
          colorCountMax = count
        continue
      }
    }
    colorChartSeries.push([i, j, 0])
  }
}

const colorChartOption = ref({
  tooltip: {
    position: 'top'
  },
  grid: {
    left: '5%',
    right: '8%',
    height: '95%',
    top: '0%'
  },
  xAxis: {
    type: 'category',
    data: typeNames,
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    data: colorCategories,
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    max: colorCountMax / 2,
    calculable: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    bottom: '0%',
    inRange: {
      color: ['WhiteSmoke', standardColorSeries[1]]
    }
  },
  series: [
    {
      name: 'Count',
      type: 'heatmap',
      data: colorChartSeries,
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})


// Chart 3: the scatter chart of pokemons' stat
const statNames:string[] = ['Attack', 'Defense', 'SP_Attack', 'SP_Defense', 'Speed', 'HP']
const statsByCategory = {
  Ordinary: [[], [], [], [], [], []] as number[][],
  Mythical: [[], [], [], [], [], []] as number[][],
  'Semi-Legendary': [[], [], [], [], [], []] as number[][],
  Legendary: [[], [], [], [], [], []] as number[][],
}
data.forEach(pokemon => {
  const categoryKey = pokemon.Category as keyof typeof statsByCategory
  for (let i = 0; i < statNames.length; i++) {
    const statName: string = statNames[i]
    statsByCategory[categoryKey][i].push(pokemon[statName as keyof Pokemon] as number)
  }
})

const statsAnalysis = {
  Ordinary: [] as number[][],
  Mythical: [] as number[][],
  'Semi-Legendary': [] as number[][],
  Legendary: [] as number[][],
}
for (let i = 0; i < statNames.length; i++) {
  statsAnalysis.Ordinary.push(boxplotAnalyze(statsByCategory.Ordinary[i]))
  statsAnalysis.Mythical.push(boxplotAnalyze(statsByCategory.Mythical[i]))
  statsAnalysis['Semi-Legendary'].push(boxplotAnalyze(statsByCategory['Semi-Legendary'][i]))
  statsAnalysis.Legendary.push(boxplotAnalyze(statsByCategory.Legendary[i]))
}

const statBoxOption = ref({
  grid: {
    left: '5%',
    right: '8%',
    height: '90%',
    top: '5%'
  },
  tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'line'
    }
  },
  color: standardColorSeries.slice(1, 5),
  legend: {
    data: ['Ordinary', 'Mythical', 'Semi-Legendary', 'Legendary']
  },
  xAxis: {
    type: 'category',
    data: statNames,
    splitArea: { show: true }
  },
  yAxis: {
    type: 'value',
    name: 'Stats',
    min: 0,
    max: 270,
    interval: 30,
    splitLine: { show: false },
    nameTextStyle: {
      fontSize: 16,
      fontWeight: 600,
      color: 'black'
    }
  },
  series: [
    {
      name: 'Ordinary',
      type: 'boxplot',
      data: statsAnalysis.Ordinary
    },
    {
      name: 'Mythical',
      type: 'boxplot',
      data: statsAnalysis.Mythical
    },
    {
      name: 'Semi-Legendary',
      type: 'boxplot',
      data: statsAnalysis['Semi-Legendary']
    },
    {
      name: 'Legendary',
      type: 'boxplot',
      data: statsAnalysis.Legendary
    }
  ]
})


// Chart 4: the pie chart of pokemon's regional viriant
// Construct the table of each pokemon and its regional forms, and then filter the table.
interface ViriantItem {
  originalForm: Pokemon,
  regionalForm: Pokemon[]
}
let virants: ViriantItem[] = [{originalForm: data[0], regionalForm: []}]
data.forEach(pokemon => {
  if (pokemon.No === virants.slice(-1)[0].originalForm.No)
  {
    if (pokemon.Region_Form_Flag === 1)
      virants.slice(-1)[0].regionalForm.push(pokemon)
  }
  else
    virants.push({originalForm: pokemon, regionalForm: []})
})
virants = virants.filter(el => {
  return el.regionalForm.length > 0
})

// Count distribution of regions and orignal generation
interface ViriantCounter {
  [region: string]: {[gen: number]: number},
}
let viriantCounter = {} as ViriantCounter
let regionNames = [] as string[]
let generations = new Set<number>()
virants.forEach(el => {
  el.regionalForm.forEach(v => {
    let originalGen = el.originalForm.Gen
    let region = v.Name.split(' ')[0]
    if (!(region in viriantCounter)) {
      viriantCounter[region] = {}
      regionNames.push(region)
    }
    if (!(originalGen in viriantCounter[region])) {
      viriantCounter[region][originalGen] = 0
      generations.add(originalGen)
    }
    viriantCounter[region][originalGen]++
  })
})


function buildViriantChartData() {
  let data = [] as {}[]
  let i = 0
  regionNames.forEach(region => {
    data.push({
      name: region,
      itemStyle: {color: standardColorSeries[i]}
    })
    i++
    if (i > standardColorSeries.length - 1)
      i = 0
  })
  generations.forEach(gen => {
    data.push({
      name: 'Gen ' + gen,
      itemStyle: {color: standardColorSeries[i]}
    })
    i++
    if (i > standardColorSeries.length - 1)
      i = 0
  })
  return data
}

function buildViriantChartLinks() {
  let links = [] as {source: string, target: string, value: number}[]
  regionNames.forEach(region => {
    const counter = viriantCounter[region]
    for (const gen in counter) {
      links.push({
        source: 'Gen ' + gen,
        target: region,
        value: counter[gen]
      })
    }
  })
  return links
}

const viriantChartOption = ref({
  tooltip: {
    trigger: 'item'
  },
  color: standardColorSeries.slice(0, 15),
  series: {
    type: 'sankey',
    layout: 'none',
    emphasis: {
      focus: 'adjacency'
    },
    data: buildViriantChartData(),
    links: buildViriantChartLinks(),
    lineStyle: { color: 'gradient' }
  }
})


// Chart 5: the tree map of pokemon's abilities
interface AbilityCounter {
  [ability: string]: [number, number, number] // [ability1, ability2, hidden ability]
}
let abilityCounter = {} as AbilityCounter
const abilityProperties = ['Ability1', 'Ability2', 'Ability_Hidden']
data.forEach(pokemon => {
  for (let i = 0; i < 3; i++) {
      const property = abilityProperties[i] as keyof Pokemon
      const ability = pokemon[property]
      if (ability != '') {
        if (!(ability in abilityCounter))
          abilityCounter[ability] = [0, 0, 0]
        abilityCounter[ability][i]++
      }
    }
})

interface AbilityNode {
  name: string,
  value: number,
  children: {name: string, value: number}[]
}

let abilityData = [] as AbilityNode[]
for (const ability in abilityCounter) {
  const count = abilityCounter[ability]
  abilityData.push({
    name: ability,
    value: count[0] + count[1] + count[2],
    children: [
      { name: ability + '\n(as first)', value: count[0] },
      { name: ability + '\n(as second)', value: count[1]},
      { name: ability + '\n(as hidden)', value: count[2]}
    ]
  })
}

function abilityCountCompare(count1: AbilityNode, count2: AbilityNode) {
  let totalCount1 = 0
  count1.children.forEach(child => totalCount1 = totalCount1 + child.value)
  let totalCount2 = 0
  count2.children.forEach(child => totalCount2 = totalCount2 + child.value)
  if (totalCount1 < totalCount2) return -1
  else if (totalCount1 > totalCount2) return 1
  else return 0
}

abilityData.sort(abilityCountCompare)
abilityData = abilityData.slice(-18, -1)

const abilityChartOption = ref({
  tooltip: {
    trigger: 'item'
  },
  roam: false,
  color: standardColorSeries,
  series: [
    {
      type: 'treemap',
      data: abilityData
    }
  ]
})

</script>


<style lang="scss" scoped>
#PokemonPage {
  --theme-color1: #429837;
  --theme-color2: #e7623d;
  --theme-color3: #2e9be3;
  --theme-color4: #f4cc1b;

  padding: 0 var(--content-margin);
}

#InfoArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 8rem;
  padding: 1.5rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px var(--light-grey) solid;

  h1 {
    height: fit-content;
    font-size: 2rem;
  }

  p {
    a {
      color: var(--theme-color2);
      font-weight: 600;
    }
  }
}

#ChartArea {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  height: fit-content;

  #TypeChart {
  width: 100%;
  height: 35vw;
}

  #ColorChart {
    width: 100%;
    height: 90vh;
  }

  #StatBoxChart {
    width: 100%;
    height: 90vh;
  }

  #ViriantChart {
    width: 100%;
    height: 90vh;
  }

  #AbilityChart {
    width: 100%;
    height: 90vh;
  }
}

.chartWrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 2.5rem;

  h2 {
    display: flex;
    align-items: center;
    width: fit-content;
    height: 2.5rem;
    padding-left: 1.5rem;
    position: relative;
    margin-bottom: 2rem;
    font-size: 1.5rem;
  }

  h2::before {
    content: "";
    width: 0.75rem;
    height: 100%;
    background: var(--theme-color1);
    position: absolute;
    top: 0;
    left: 0;
  }

  .chart {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
}

</style>
