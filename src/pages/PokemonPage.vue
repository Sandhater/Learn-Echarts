<script setup lang="ts">
import {ref, computed} from 'vue'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { PieChart, BarChart, ScatterChart, HeatmapChart, BoxplotChart, SankeyChart, TreemapChart, GraphChart } from 'echarts/charts';
import {
  GridComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  DataZoomComponent,
  DatasetComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

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
  GraphChart,
  TreemapChart,
  GridComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  DataZoomComponent,
  DatasetComponent
])

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
  public Egg_Group1: string = ''
  public Egg_Group2: string = ''
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
 

//#region Chart 1: the bar chart about pokemons' types.
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

const typeChartOption = computed(() => { return {
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
}})
//#endregion


//#region Chart 2: The heatmap chart of pokemons' type and colors
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

const colorChartOption = computed(() => { return {
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
}})
//#endregion


//#region Chart 3: the scatter chart of pokemons' stat
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

const statBoxOption = computed(() => { return {
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
}})
//#endregion


//#region Chart 4: the pie chart of pokemon's regional variant
// Construct the table of each pokemon and its regional forms, and then filter the table.
interface VariantItem {
  originalForm: Pokemon,
  regionalForm: Pokemon[]
}
let variants: VariantItem[] = [{originalForm: data[0], regionalForm: []}]
data.forEach(pokemon => {
  if (pokemon.No === variants.slice(-1)[0].originalForm.No)
  {
    if (pokemon.Region_Form_Flag === 1)
      variants.slice(-1)[0].regionalForm.push(pokemon)
  }
  else
    variants.push({originalForm: pokemon, regionalForm: []})
})
variants = variants.filter(el => {
  return el.regionalForm.length > 0
})

// Count variants according to original generation, and then local areas
interface VariantCounter {
  [generation: string]: {[region: string]: number}
}
let variantCounter = {} as VariantCounter
let regionNames = new Set<string>()
variants.forEach(group => {
  let originalGen = 'Gen ' + group.originalForm.Gen;
  if (!(originalGen in variantCounter))
    variantCounter[originalGen] = {}
  group.regionalForm.forEach(variant => {
    let region = variant.Name.split(' ')[0]
    regionNames.add(region)
    if (!(region in variantCounter[originalGen]))
      variantCounter[originalGen][region] = 0
    variantCounter[originalGen][region]++
  })
})

function buildVariantChartData() {
  let chartData = [] as {}[]
  let i = 0
  for (const gen in variantCounter) {
    chartData.push({
      name: gen,
      itemStyle: { color: standardColorSeries[i] }
    })
    i = (i + 1) % standardColorSeries.length
  }
  regionNames.forEach(region => {
    chartData.push({
      name: region,
      itemStyle: { color: standardColorSeries[i] }
    })
    i = (i + 1) % standardColorSeries.length
  })
  return chartData
}

function buildVariantChartLinks() {
  let links = [] as { source: string, target: string, value: number }[]
  for (const gen in variantCounter) {
    const counter = variantCounter[gen]
    for (const region in counter) {
      links.push({
        source: gen,
        target: region,
        value: counter[region]
      })
    }
  }
  return links
}

const variantChartOption = computed(() => { return {
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
    layoutIterations: 0,
    data: buildVariantChartData(),
    links: buildVariantChartLinks(),
    lineStyle: { color: 'gradient' }
  }
}})
//#endregion


//#region Chart 5: the tree map of pokemon's abilities
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

const abilityChartOption = computed(() => { return {
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
}})
//#endregion


//#region Chart 6: the relation graph or pokemon's egg groups
const PokemonLatestNumber: number = data[data.length - 1].No

// Control the input No. of pokemons that will be checked for their egg groups
function buildInputModelsForEggGroup(): { index: number, model: number }[] {
  let models = [] as { index: number, model: number }[]
  for (let i = 0; i < 16; i++)
    models.push({index: i, model: (i + 1) * 16})
  models[0].model = 132   // The No.132 pokemon: Ditto
  return models
}
const eggGroupModels = ref(buildInputModelsForEggGroup())
function checkModelInput() {
  eggGroupModels.value.forEach(m => {
    if (m.model < 1) m.model = 1
    if (m.model > PokemonLatestNumber) m.model = PokemonLatestNumber
  })
}

function randomModelInput() {
  // To avoid duplication, randomly select numbers from different ranges.
  let start = 1
  const step = 60
  eggGroupModels.value.forEach(m => {
    m.model = start + Math.floor(Math.random() * step)
    start += step
  })
  confirmModelInput()
}

// Prepare for the graph chart of egg groups
const eggGroupNodes = ref([] as {}[])
const eggGroupLinks = ref([] as {}[])
const eggGroupCategories = ref([] as {}[])


const EggGroupChart = ref()
function confirmModelInput() {
  // First check if there are duplicated numbers, which will cause Echarts to crash
  const modelSet = new Set<number>()
  eggGroupModels.value.forEach(m => modelSet.add(m.model))
  if (modelSet.size < eggGroupModels.value.length) {
    alert('Duplicated numbers!')
    return
  }

  eggGroupNodes.value = []
  eggGroupLinks.value = []
  eggGroupCategories.value = []

  const selectedPokemons = [] as Pokemon[]
  let categorySet = new Set<string>()
  eggGroupModels.value.forEach(m => {
    // Step 1: build the nodes of the graph chart
    // Because a pokemon's index will always be less than its No., we can avoid many unnecessary searches.
    for (let i = m.model - 1; i <= data.length; i++) {
      if (data[i].No === m.model) {
        const pokemon: Pokemon = data[i]
        eggGroupNodes.value.push({
          name: pokemon.Original_Name,
          value: nodeValueFromGender(pokemon.Egg_Group1, pokemon.Egg_Group2, pokemon.Gender_Male, pokemon.Gender_Female, pokemon.Gender_Unknown),
          symbolSize: nodeSizeFromGender(pokemon.Gender_Male, pokemon.Gender_Female, pokemon.Gender_Unknown),
          category: pokemon.Egg_Group1
        })
        selectedPokemons.push(pokemon)
        categorySet.add(pokemon.Egg_Group1)
        break
      }
    }
  })

  // Step 2 : build the links of the graph chart
  // Specially, the links will start from the pokemon with more males and earlier number
  for (let i = 0; i < selectedPokemons.length; i++) {
    for (let j = i + 1; j < selectedPokemons.length; j++) {
      const pokemon1 = selectedPokemons[i]
      const pokemon2 = selectedPokemons[j]
      // Pokemons of undiscovered egg groups can not breed
      if (pokemon1.Egg_Group1 === 'Undiscovered' || pokemon2.Egg_Group1 === 'Undiscovered')
        continue
      // Ditto (No.132) can breed with most pokemons
      if (pokemon1.Egg_Group1 === 'Ditto' && pokemon2.Egg_Group1 != 'Ditto')
        eggGroupLinks.value.push({ source: j, target: i })
      else if (pokemon1.Egg_Group1 != 'Ditto' && pokemon2.Egg_Group1 === 'Ditto')
        eggGroupLinks.value.push({ source: i, target: j })
      // Pokemons with the same single gender cannot breed
      else if ((pokemon1.Gender_Male === 100 && pokemon2.Gender_Male === 100) || (pokemon1.Gender_Female === 100 && pokemon2.Gender_Female === 100)
          || (pokemon1.Gender_Unknown === 100 && pokemon2.Gender_Unknown === 100))
        continue
      // Pokemons sharing the same egg group can breed
      else if (pokemon1.Egg_Group1 === pokemon2.Egg_Group1 || pokemon1.Egg_Group1 === pokemon2.Egg_Group2
          || (pokemon1.Egg_Group2 != '' && (pokemon1.Egg_Group2 === pokemon2.Egg_Group1 || pokemon1.Egg_Group2 === pokemon2.Egg_Group2))) {
        if (pokemon1.Gender_Male > pokemon2.Gender_Female)
          eggGroupLinks.value.push({ source: i, target: j })
        else if (pokemon1.Gender_Male < pokemon2.Gender_Female)
          eggGroupLinks.value.push({ source: j, target: i })
        else if (pokemon1.No < pokemon2.No)
          eggGroupLinks.value.push({ source: i, target: j })
        else
          eggGroupLinks.value.push({ source: j, target: i })
      }
    }
  }

  // Step 3: build the categories of the graph chart
  categorySet.forEach(category => {
    eggGroupCategories.value.push({name: category})
  })
}

function nodeValueFromGender(eggGroup1: string, eggGroup2: string, genderMale: number, genderFemale: number, genderUnknown: number): string {
  let eggGroupStr = eggGroup1
  if (eggGroup2 != '')
    eggGroupStr = `${eggGroup1} + ${eggGroup2}`
  if (genderUnknown === 0)
    return `${eggGroupStr};\n♂ ${genderMale}%, ♀ ${genderFemale}%`
  else
    return `${eggGroupStr};\nGender Unknown`
}

function nodeSizeFromGender(genderMale: number, genderFemale: number, genderUnknown: number): number {
  const standardSize = 12.0
  if (genderUnknown === 100)
    return standardSize
  else
    return standardSize * ((genderMale * genderMale + 50) / 2550)
}

confirmModelInput()

const eggGroupChartOption = computed(() => { return {
  tooltip: {
    trigger: 'item',
  },
  color: standardColorSeries,
  legend: eggGroupCategories.value,
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      name: 'Egg Groups & Gender Ratio',
      type: 'graph',
      layout: 'circular',
      circular: {
        rotateLabel: false
      },
      data: eggGroupNodes.value,
      links: eggGroupLinks.value,
      categories: eggGroupCategories.value,
      roam: true,
      label: {
        position: 'right',
        formatter: '{b}'
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3
      }
    }
  ]
}})

//#endregion

</script>


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
        <h2>pokemons' Types</h2>
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
      <div id="VariantChart" class="chartWrapper">
        <h2>Pokemon's Regional Variants</h2>
        <v-chart class="chart" :option="variantChartOption" autoresize />
      </div>
      <div id="AbilityChart" class="chartWrapper">
        <h2>Pokemon's Abilities</h2>
        <v-chart class="chart" :option="abilityChartOption" autoresize />
      </div>
      <div id="EggGroupChart" class="chartWrapper">
        <h2>Pokemon's Egg Groups and Gender Ratio</h2>
        <p>Input pokemons' No. to see their egg groups. The legend shows their first egg groups, and the links show which two pokemons can breed.</p>
        <p class="hint">Hint: pokemons with the same <b>NO.</b> (whether or not they are regional variants, mega-evolved, etc.)
        share the same egg groups, with exception of <b>Cosplay Pikachu</b>, <b>Pikachu in a Cap</b> and <b>Ash Greninja</b>.</p>
        <div class="operationPanel">
          <div class="inputArea">
            <input type="number" class="numberInput" @input="checkModelInput"
                   v-for="m in eggGroupModels" :key="m.index" v-model="m.model" />
          </div>
          <div class="buttonArea">
            <button class="randomBtn" @click="randomModelInput">🎲 Random</button>
            <button class="confirmBtn" @click="confirmModelInput">👌 Confirm</button>
          </div>
        </div>
        <v-chart class="chart" :option="eggGroupChartOption" autoresize :ref="EggGroupChart" />
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
#PokemonPage {
  --theme-color1: #429837;
  --theme-color2: #e7623d;
  --theme-color3: #2e9be3;
  --theme-color4: #f4cc1b;

  padding: 0 var(--content-margin);
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

  #VariantChart {
    width: 100%;
    height: 90vh;
  }

  #AbilityChart {
    width: 100%;
    height: 90vh;
  }

  #EggGroupChart {
    width: 100%;
    height: 120vh;

    .operationPanel {
      margin-bottom: 2rem;

      .inputArea {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;

        input.numberInput {
          margin-bottom: 1rem;
          padding: 0 0.5rem;
          width: 12%;
          height: 2rem;
          border: 1px solid var(--light-grey);
          border-radius: 4px;
          outline: none;
          background: none;
        }
      }

      .buttonArea {
        display: flex;
        justify-content: center;

        button {
          width: 20%;
          height: 2rem;
          border: 1px solid #429837;
          border-radius: 4px;
          background: white;
          color: #429837;
          font-weight: 800;
          cursor: pointer;

          &:hover {
              background: #429837;
              color: white;
          }

          &:not(:last-child) {
            margin-right: 2rem;
          }
        }
      }
    }
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

  p {
    margin-bottom: 1rem;
  }

  .hint {
    color: var(--text-color3);
    font-style: italic;
  }
}

</style>
