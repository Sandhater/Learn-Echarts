<script setup lang="ts">
import { ref } from 'vue'
import { routes } from '../utils/router'
import ChartLikeBackground from '../components/ChartLikeBackground.vue'


const pages = ref(routes.filter(route => {
  return route.meta.dataPage
}))

</script>

<<template>
  <div id="HomePage">
    <div id="Banner">
      <h1>Visualization Examples<br/>with ECharts</h1>
      <ChartLikeBackground class="bannerBackground"/>
    </div>
    <div id="NavigationCards">
      <div class="pageCard" v-for="page in pages" :style="{'--page-card-color': page.meta.themeColor}">
        <RouterLink :to="page.path">
          {{ page.meta.name }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#Banner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 75vh;
  border-bottom: 1px solid var(--light-grey);
  position: relative;

  h1 {
    color: var(--text-color1);
    font-size: 4rem;
    font-weight: 1000;
    z-index: 1;
  }

  .bannerBackground {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}

#HomePage {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  min-height: 100vh;
  background: var(--background-color);
}

#NavigationCards {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 14rem;
  transform: translateY(-50%);
}

.pageCard {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--layer-color);
  height: 12rem;
  width: 30rem;
  margin: 0 2rem;
  position: relative;
  font-size: 2rem;
  color: var(--text-color1);
  font-weight: 1000;
  box-shadow: 0 16px 64px var(--shadow-color);
  transition: transform .2s;

  &::before {
    content: "";
    width: 0;
    height: 100%;
    position: absolute;
    left: 0;
    background: var(--page-card-color);
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    color: var(--text-color1);
    width: 100%;
    height: 100%;
    text-align: center;
  }
}

.pageCard:hover {
  transform: scale(1.05);
  transition: transform .2s;

  &::before {
    width: 100%;
    transition: width .4s ease;
  }

  a {
    color: var(--white);
  }
}

</style>
