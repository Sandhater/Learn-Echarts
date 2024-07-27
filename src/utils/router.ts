import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import PokemonPage from '../pages/PokemonPage.vue'
import WorldPopulationPage from "../pages/WorldPopulationPage.vue";


interface Route {
  path: string,
  component: any,
  meta: {
    name: string,
    dataPage: boolean,
    themeColor: string
  }
}


function buildRoute(path: string, component: any, name='New Page', dataPage=false, color: string='#000000'): Route {
  return {
    path: path,
    component: component,
    meta: {
      name: name,
      dataPage: dataPage,
      themeColor: color
    }
  }
}


const routes = [
  buildRoute('/', HomePage),
  buildRoute('/pokemon', PokemonPage, 'Pokémon', true, '#f4cc1b'),
  buildRoute('/world-population', WorldPopulationPage, 'World Population', true, '#a9cf78')
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export { routes }
export type { Route }
export default router