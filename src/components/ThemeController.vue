<script setup lang="ts">
import { ref } from 'vue'
import { SunIcon, MoonIcon } from '@heroicons/vue/20/solid'

import { useThemeStore } from '../utils/store.ts'

let savedTheme = sessionStorage.getItem('theme')
if (savedTheme === 'dark')
  document.body.classList.add('dark-mode')

const isDarkMode = ref<boolean>(
    document.body.classList.contains('dark-mode')
)

const themeStore = useThemeStore()

function toggleTheme() {
  document.body.classList.toggle('dark-mode')
  isDarkMode.value = document.body.classList.contains('dark-mode')
  if (isDarkMode.value)
    themeStore.setTheme('dark')
  else
    themeStore.setTheme('light')
  sessionStorage.setItem('theme', themeStore.theme)
}

</script>

<template>
  <div class="themeController" @click="toggleTheme">
    <transition>
      <MoonIcon v-if="isDarkMode"/>
      <SunIcon v-else/>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.themeController {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--layer-color);
  box-shadow: 0 8px 16px var(--shadow-color);
  cursor: pointer;

  color: var(--text-color1);

  svg {
    position: absolute;
    width: 60%;
    height: 60%;
  }
}

.v-enter-from, .v-leave-to {
  transform: scale(0);
}
.v-enter-to, .v-leave-from {
  transform: scale(1);
}
.v-enter-active {
  transition: all .1s linear .1s;
}
.v-leave-active {
  transition: all .1s linear;
}

</style>