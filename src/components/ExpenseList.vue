<script setup lang="ts">
import type { Expense } from '../types'
import { useFinance } from '../composables/useFinance'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

const props = defineProps<{
  expenses: Expense[]
}>()

const { deleteExpense } = useFinance()

const handleDelete = async (expense: Expense) => {
  if (confirm('Tem certeza que deseja apagar este gasto?')) {
    await deleteExpense(expense)
  }
}

const formatDate = (date: any) => {
  if (!date) return ''
  // Handle Firestore Timestamp or Date
  const d = date.toDate ? date.toDate() : date
  return dayjs(d).format('DD/MM/YYYY HH:mm')
}

// Group expenses by date (optional/nice to have) or just list
// For simplicity, just list
</script>

<template>
  <div space-y-4 pb-24> <!-- padding bottom for FAB -->
    <div 
      v-for="expense in expenses" 
      :key="expense.id"
      bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center group
    >
      <div>
        <h3 font-bold text-gray-900 dark:text-gray-100>{{ expense.name }}</h3>
        <p text-xs text-gray-500>{{ expense.category }} • {{ formatDate(expense.createdAt) }}</p>
      </div>
      
      <div flex items-center gap-3>
        <div text-red-500 font-bold font-mono>
          - R$ {{ expense.amount.toFixed(2) }}
        </div>
        <button 
          @click="handleDelete(expense)"
          p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red="900/20" rounded-lg transition-colors
          aria-label="Deletar"
        >
          <!-- Trash Icon SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div v-if="expenses.length === 0" text-center text-gray-500 py-10>
      Nenhum gasto registrado
    </div>
  </div>
</template>
