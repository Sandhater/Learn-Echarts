<script setup lang="ts">
import {ref, watch} from 'vue'
import {useThemeStore} from './utils/store.ts'
import ThemeController from './components/ThemeController.vue'

const forceUpdateKey = ref(0)
const themeStore = useThemeStore()
watch(() => themeStore.theme, () => {
  forceUpdateKey.value ++
})

</script>

<template>
  <RouterView :key="forceUpdateKey" />
  <ThemeController id="ThemeController"/>
</template>

<style lang="scss" scoped>
#ThemeController {
  position: fixed;
  left: 2rem;
  bottom: 2rem;
}
</style>
