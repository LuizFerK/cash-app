<script setup lang="ts">
import { ref } from 'vue'
import { useFinance } from './composables/useFinance'
import ExpenseList from './components/ExpenseList.vue'
import ExpenseModal from './components/ExpenseModal.vue'

const { balance, expenses, loading } = useFinance()
const showAddModal = ref(false)
</script>

<template>
  <div bg="#211832" px-4 text-center min-h-screen text-gray-900 font-sans>
    <div max-w-md mx-auto min-h-screen flex flex-col relative>
      
      <!-- Header / Balance -->
      <header bg="#211832" pt-10 pb-6 px-6 shadow-sm z-10 sticky top-0>
        <h1 text-sm uppercase tracking-wide text-gray-200 mb-1 font-bold>Saldo Atual</h1>
        <div 
          text-5xl font-extrabold tracking-tighter
          :class="{
            'text-green-600': balance >= 0,
            'text-red-600': balance < 0
          }"
        >
          R$ {{ balance.toFixed(2) }}
        </div>
        <div mt-2 text-xs text-gray-400 v-if="loading">
          Atualizando...
        </div>
      </header>

      <!-- Content -->
      <main flex-1 py-6>
        <h2 text-lg text-gray-200 font-bold mb-4>Histórico</h2>
        <ExpenseList :expenses="expenses" />
      </main>

      <!-- FAB -->
      <button 
        @click="showAddModal = true"
        fixed bottom-6 right-6 w-14 h-14 bg="#5C3E94" text-white
        rounded-full shadow-lg flex items-center justify-center
        text-2xl hover:scale-105 transition-transform active:scale-95
        focus:outline-none
        aria-label="Adicionar Gasto"
      >
        +
      </button>

      <ExpenseModal v-model="showAddModal" />
    </div>
  </div>
</template>