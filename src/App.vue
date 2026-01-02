<script setup lang="ts">
import { ref } from 'vue'
import { useFinance } from './composables/useFinance'
import ExpenseList from './components/ExpenseList.vue'
import ExpenseModal from './components/ExpenseModal.vue'

const { balance, expenses, loading } = useFinance()
const showAddModal = ref(false)
</script>

<template>
  <div min-h-screen text-gray-900 dark:text-gray-100 font-sans>
    <div max-w-md mx-auto min-h-screen flex flex-col relative>
      
      <!-- Header / Balance -->
      <header pt-10 pb-6 px-6 rounded-b-3xl shadow-sm z-10 sticky top-0>
        <h1 text-sm uppercase tracking-wide text-gray-500 mb-1 font-bold>Saldo Atual</h1>
        <div 
          text-5xl font-extrabold tracking-tighter
          :class="{
            'text-green-600 dark:text-green-500': balance >= 0,
            'text-red-600 dark:text-red-500': balance < 0
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
        <h2 text-lg text-gray-500 font-bold mb-4>Histórico</h2>
        <ExpenseList :expenses="expenses" />
      </main>

      <!-- FAB -->
      <button 
        @click="showAddModal = true"
        fixed bottom-6 right-6 w-14 h-14 bg-black dark:bg-white text-white
        dark:text-black rounded-full shadow-lg flex items-center justify-center
        text-2xl hover:scale-105 transition-transform active:scale-95 focus:outline-none
        aria-label="Adicionar Gasto"
      >
        +
      </button>

      <ExpenseModal v-model="showAddModal" />
    </div>
  </div>
</template>