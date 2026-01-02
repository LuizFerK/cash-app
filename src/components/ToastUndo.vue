<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  show: boolean
  message: string
  duration?: number
}>()

const emit = defineEmits<{
  (e: 'undo'): void
  (e: 'close'): void
}>()

let timer: number | undefined

watch(() => props.show, (val) => {
  if (val) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      emit('close')
    }, props.duration || 5000)
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div v-if="show" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none">
      <div class="bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 px-4 py-3 rounded-lg shadow-lg flex items-center justify-between pointer-events-auto">
        <span class="text-sm font-medium">{{ message }}</span>
        <button 
          @click="$emit('undo')"
          class="ml-4 text-blue-400 font-bold text-sm hover:text-blue-300 focus:outline-none uppercase"
        >
          Desfazer
        </button>
      </div>
    </div>
  </Transition>
</template>
