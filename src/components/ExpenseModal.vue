<script setup lang="ts">
import { ref } from 'vue'
import { useFinance } from '../composables/useFinance'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { addExpense } = useFinance()

const name = ref('')
const category = ref('')
const amount = ref<number | ''>('')
const loading = ref(false)

async function handleSubmit() {
  if (!name.value || !amount.value) return
  
  loading.value = true
  try {
    await addExpense({
      name: name.value,
      category: category.value || 'Geral',
      amount: Number(amount.value)
    })
    close()
    // Reset form
    name.value = ''
    category.value = ''
    amount.value = ''
  } catch (e) {
    console.error(e)
    alert('Erro ao salvar')
  } finally {
    loading.value = false
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="modelValue" fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black-50 p-4 backdrop-blur-sm @click.self="close">
    <div w-full max-w-sm bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-xl transform transition-all>
      <h2 text-xl font-bold mb-4 text-gray-900 dark:text-gray-100>Registrar Gasto</h2>
      
      <form @submit.prevent="handleSubmit" space-y-4>
        <div>
          <label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1>Nome</label>
          <input 
            v-model="name"
            type="text" 
            w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2.5 text-sm focus:ring-green-500 focus:border-green-500
            placeholder="Ex: Almoço"
            required
          />
        </div>

        <div>
          <label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1>Categoria</label>
          <input 
            v-model="category"
            type="text" 
            w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2.5 text-sm focus:ring-green-500 focus:border-green-500
            placeholder="Ex: Alimentação"
          />
        </div>

        <div>
          <label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1>Valor</label>
          <div relative>
            <span absolute left-3 top-2.5 text-gray-500>R$</span>
            <input 
              v-model="amount"
              type="number" 
              step="0.01"
              w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2.5 text-sm focus:ring-green-500 focus:border-green-500
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div flex gap-3 mt-6>
          <button 
            type="button" 
            @click="close"
            flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
          >
            Cancelar
          </button>
          <button 
            type="submit"
            :disabled="loading"
            flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
          >
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
