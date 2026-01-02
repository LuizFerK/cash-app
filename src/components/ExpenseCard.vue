<script setup lang="ts">
import { ref } from 'vue'
import { useSwipe } from '@vueuse/core'
import type { Expense } from '../types'
import dayjs from 'dayjs'

const props = defineProps<{
  expense: Expense
}>()

const emit = defineEmits<{
  (e: 'delete', expense: Expense): void
}>()

const el = ref<HTMLElement | null>(null)
// Swipe State
const left = ref('0px')
const opacity = ref(1)

const { lengthX, isSwiping } = useSwipe(el, {
  passive: false,
  onSwipe() {
    // Only allow swiping left (negative X)
    if (lengthX.value < 0) {
      left.value = '0px'
      return
    }
    
    // Move element to left (translateX is negative)
    left.value = `-${lengthX.value}px`
    
    // Delete threshold ~ 150px
    if (lengthX.value > 150) {
      opacity.value = 1 - (lengthX.value - 150) / 100
    }
  },
  onSwipeEnd() {
    if (lengthX.value > 150) { // Threshold reached
      left.value = '-100%'
      opacity.value = 0
      // Small delay for animation before emitting
      setTimeout(() => emit('delete', props.expense), 100)
    } else {
      // Bounce back
      left.value = '0px'
      opacity.value = 1
    }
  }
})

const formatDate = (date: any) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : date
  return dayjs(d).format('DD/MM HH:mm')
}
</script>

<template>
  <div relative overflow-hidden rounded-xl mb-4 select-none touch-pan-y>
    <!-- Background (Trash Icon) -->
    <div 
      absolute inset-0 m-1 bg-red-600 rounded-xl flex items-center justify-end pr-6 pointer-events-none
    >
      <div text-white font-bold flex items-center gap-2>
        <span>Apagar</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </div>
    </div>

    <!-- Foreground Card -->
    <div 
      ref="el"
      relative bg="#412B6B" p-4 rounded-xl shadow-sm border="~ #5C3E94" flex justify-between items-center transition-transform will-change-transform
      :style="{ transform: `translateX(${left})`, opacity: opacity, transition: isSwiping ? 'none' : 'all 0.3s ease-out' }"
    >
      <div text-left w="2/3">
        <h3 font-bold text-gray-200 overflow-hidden text-ellipsis whitespace-nowrap>{{ expense.name }}</h3>
        <p text-xs text-gray-500>{{ expense.category }} • {{ formatDate(expense.createdAt) }}</p>
      </div>
      <div w-32 text-red-500 font-bold font-mono text-right>
        - R$ {{ expense.amount.toFixed(2) }}
      </div>
    </div>
  </div>
</template>
