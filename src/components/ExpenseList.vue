<script setup lang="ts">
import type { Expense } from '../types'
import ExpenseCard from './ExpenseCard.vue'

const props = defineProps<{
  expenses: Expense[]
}>()
</script>

<template>
  <div space-y-4 pb-25>
    <ExpenseCard
      v-for="expense in expenses"
      :key="expense.id"
      :expense="expense"
    />
    
    <div v-if="expenses.length === 0" text-center text-gray-500 py-10>
      Nenhuma compra registrada
    </div>
  </div>
</template>
