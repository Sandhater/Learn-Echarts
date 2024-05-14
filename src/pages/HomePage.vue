<<template>
  <div id="HomePage">
    <div class="page-card" v-for="page in pages">
      <RouterLink :to="page.path">
        {{ page.meta.name }}
      </RouterLink>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { routes } from '../utils/router'


const pages = ref(routes.filter(route => {
  return route.meta.dataPage
}))

</script>


<style lang="scss" scoped>

#HomePage {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  min-height: 100vh;
  background: var(--background-color);
}

.page-card {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--layer-color);
  height: 12rem;
  width: 60%;
  margin: 0.5rem;

  a {
    font-size: 2rem;
    color: var(--text-color1);
    font-weight: 1000;
  }
}

</style>
