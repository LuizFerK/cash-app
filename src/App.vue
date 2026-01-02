<script setup lang="ts">
import { ref } from 'vue'
import { useFinance } from './composables/useFinance'
import ExpenseList from './components/ExpenseList.vue'
import ExpenseModal from './components/ExpenseModal.vue'
import { PiggyBank, ShoppingBasket, Plus } from 'lucide-vue-next'

const { balance, dailyAmount, expenses, loading } = useFinance()
const showAddModal = ref(false)
</script>

<template>
  <div bg="#343466" px-4 text-left min-h-screen text-gray-900 font-sans>
    <div mt-2 text-xs text-gray-400 v-if="loading">
      Carregando...
    </div>
    <div v-else max-w-md mx-auto min-h-screen flex flex-col relative>
      <!-- Header / Balance -->
      <div id="background-accent" :class="{'green': balance >= 0, 'red': balance < 0}"></div>
      <header pt-10 pb-6 z-10 sticky top-0>
        
        <div flex items-center gap-2 mb-1>
          <PiggyBank text-gray-200 />
          <h1 text-sm tracking-wide text-gray-200 font-bold>Saldo Atual</h1>
        </div>
        <div text-5xl font-semibold tracking-tighter mb-1 text-gray-200>
          R$ {{ balance.toFixed(2) }}
        </div>
        <span text-sm text-gray-200>Gasto médio diário: R$ {{ dailyAmount.toFixed(2) }}</span>
      </header>

      <!-- Content -->
      <main flex-1 py-6>
        <div flex items-center gap-2 mb-4>
          <ShoppingBasket :size="20" text-gray-200 />
          <h1 text-sm tracking-wide text-gray-200 font-bold>Compras recentes</h1>
        </div>
        <ExpenseList :expenses="expenses" />
      </main>

      <!-- FAB -->
      <button 
        @click="showAddModal = true"
        fixed bottom-6 right-6 w-14 h-14 class="red" text-white
        rounded-full shadow-lg flex items-center justify-center
        text-2xl hover:scale-105 transition-transform active:scale-95
        aria-label="Adicionar Gasto"
      >
        <Plus :size="22" color-gray-200 />
      </button>

      <ExpenseModal v-model="showAddModal" />
    </div>
  </div>
</template>