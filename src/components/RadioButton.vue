<script setup lang="ts">
interface Props {
  content?: string,
  optionValue: any,
  modelValue: any,
  activeColor?: any,
  leftEnd?: boolean,
  rightEnd?: boolean
}

withDefaults(defineProps<Props>(), {
  content: 'RadioButton',
  activeColor: '#000000'
})

</script>

<template>
  <label class="radioButton" :class="{checked: modelValue===optionValue}"
    :style="{'--active-color': activeColor}">
    <input type="radio" :value="optionValue" :checked="modelValue===optionValue"
      @change="$emit('update:modelValue', optionValue)"/>
    {{content}}
  </label>
</template>

<style scoped lang="scss">
.radioButton {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  background: var(--light-grey);
}

input[type="radio"]{
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
  visibility: visible;
  display: none;
}

.checked {
  color: var(--white);
  font-weight: bold;
  background: var(--active-color);
}

</style>