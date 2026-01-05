<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSwipe } from '@vueuse/core'
import type { Expense } from '../types'
import dayjs from 'dayjs'
import { Trash } from 'lucide-vue-next'
import { categories } from '../utils'

const props = defineProps<{
  expense: Expense
}>()

const emit = defineEmits<{
  (e: 'delete', expense: Expense): void
}>()

const el = ref<HTMLElement | null>(null)
// Swipe State
const left = ref(0)
const opacity = ref(1)

const { isSwiping } = useSwipe(el, {
  passive: false,
  onSwipe() {
    // Only allow swiping left (negative X)
    // if (lengthX.value < 0) {
    //   left.value = 0
    //   return
    // }
    
    // // Move element to left (translateX is negative)
    // left.value = -lengthX.value
    
    // // Delete threshold ~ 150px
    // if (lengthX.value > 150) {
    //   opacity.value = 1 - (lengthX.value - 150) / 100
    // }
  },
  onSwipeEnd() {
    // if (lengthX.value > 150) { // Threshold reached
    //   left.value = -350
    //   opacity.value = 0
    //   // Small delay for animation before emitting
    //   setTimeout(() => emit('delete', props.expense), 100)
    // } else {
    //   // Bounce back
    //   left.value = 0
    //   opacity.value = 1
    // }
  }
})

const formatDate = (date: any) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : date
  return dayjs(d).format('DD/MM HH:mm')
}

const category = computed(() => categories[props.expense.category])
</script>

<template>
  <div relative rounded-xl mb-4 select-none touch-pan-y>
    <!-- Background (Trash Icon) -->
    <div 
      absolute inset-0 m-1
      bg-gradient-to-l from-gray="200/10" to-transparent rounded-3xl flex items-center
      justify-end pr-6 pointer-events-none
      :style="{ opacity: -left / 100 }"
    >
      <div text-white font-medium flex items-center gap-2>
        <span>Apagar</span>
        <Trash :size="22" />
      </div>
    </div>

    <!-- Foreground Card -->
    <div 
      ref="el"
      relative bg="#3f4171" bg-opacity-50 p-4 rounded-3xl shadow-sm flex justify-between items-center transition-transform will-change-transform
      :style="{ transform: `translateX(${left}px)`, opacity: opacity, transition: isSwiping ? 'none' : 'all 0.3s ease-out' }"
    >
      <div mr-4 w-13 h-10 rounded-xl bg="#343466" grid place-items-center>
        <component :is="category.icon" :size="20" :color="category.color" />
      </div>
      <div text-left w="2/3">
        <h3 font-semibold text-gray-200 overflow-hidden text-ellipsis whitespace-nowrap class="expense_name">{{ expense.name }}</h3>
        <p text-xs text-gray-400>{{ expense.category }} • {{ formatDate(expense.createdAt) }}</p>
      </div>
      <div w-32 text="#f98fa5" font-bold font-mono text-right>
        -R${{ expense.amount.toFixed(2).replace('.', ',') }}
      </div>
    </div>
  </div>
</template>

<style>
.expense_name::first-letter {
  text-transform: uppercase;
}
</style>
