import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import PokemonPage from '../pages/PokemonPage.vue'
import WorldPopulationPage from "../pages/WorldPopulationPage.vue";


interface Route {
  path: string,
  component: any,
  meta: {
    name: string,
    dataPage: boolean
  }
}


function buildRoute(path: string, component: any, name='New Page', dataPage=false): Route {
  return {
    path: path,
    component: component,
    meta: {
      name: name,
      dataPage: dataPage
    }
  }
}


const routes = [
  buildRoute('/', HomePage),
  buildRoute('/pokemon', PokemonPage, 'Pokémon', true),
  buildRoute('/world-population', WorldPopulationPage, 'World Population', true)
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export { routes }
export type { Route }
export default router