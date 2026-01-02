<script setup lang="ts">
import { ref } from 'vue'
import type { Expense } from '../types'
import { useFinance } from '../composables/useFinance'
import ExpenseCard from './ExpenseCard.vue'
import ToastUndo from './ToastUndo.vue'

const props = defineProps<{
  expenses: Expense[]
}>()

const { deleteExpense, restoreExpense } = useFinance()

const showToast = ref(false)
const deletedExpense = ref<Expense | null>(null)

const handleDelete = async (expense: Expense) => {
  // Save for undo
  deletedExpense.value = expense
  // Delete
  await deleteExpense(expense)
  // Show undo
  showToast.value = true
}

const handleUndo = async () => {
  if (deletedExpense.value) {
    await restoreExpense(deletedExpense.value)
    deletedExpense.value = null
    showToast.value = false
  }
}
</script>

<template>
  <div space-y-4 pb-20> <!-- padding bottom for FAB -->
    <ExpenseCard
      v-for="expense in expenses"
      :key="expense.id"
      :expense="expense"
      @delete="handleDelete"
    />
    
    <div v-if="expenses.length === 0" text-center text-gray-500 py-10>
      Nenhum gasto registrado
    </div>

    <ToastUndo 
      :show="showToast" 
      message="Gasto apagado" 
      @undo="handleUndo" 
      @close="showToast = false"
    />
  </div>
</template>
