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
  name.value = ''
  category.value = ''
  amount.value = ''
  emit('update:modelValue', false)
}
</script>

<template>
  <Transition name="modal">
    <div v-if="modelValue" fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black-50 backdrop-blur-sm @click.self="close">
      <div w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-6 shadow-xl class="modal-card">
      <h2 text-xl font-bold mb-4 text-gray-900>Registrar Gasto</h2>
      
      <form @submit.prevent="handleSubmit" space-y-4>
        <div>
          <label block text-sm font-medium text-gray-700 mb-1>Nome</label>
          <input 
            v-model="name"
            type="text" 
            w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:ring-green-500 focus:border-green-500
            placeholder="Ex: Almoço"
            required
          />
        </div>

        <div>
          <label block text-sm font-medium text-gray-700 mb-1>Categoria</label>
          <select 
            v-model="category"
            w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:ring-green-500 focus:border-green-500
            :class="category === '' ? 'text-gray-400' : 'text-gray-700'"
          >
            <option selected disabled value="">Ex: Mercado</option>
            <option value="Mercado">Mercado</option>
            <option value="Comida/Bebida">Comida/Bebida</option>
            <option value="Delivery">Delivery</option>
            <option value="Uber/99">Uber/99</option>
            <option value="BlaBlaCar">BlaBlaCar</option>
            <option value="Ônibus">Ônibus</option>
            <option value="Farmácia">Farmácia</option>
            <option value="Cinema">Cinema</option>
            <option value="Ingresso">Ingresso</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div>
          <label block text-sm font-medium text-gray-700 mb-1>Valor</label>
          <div relative>
            <span absolute left-3 top-2.5 text-gray-500>R$</span>
            <input 
              v-model="amount"
              type="number" 
              step="0.01"
              w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:ring-green-500 focus:border-green-500
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div flex gap-3 mt-6>
          <button 
            type="button" 
            @click="close"
            flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50
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
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: translateY(100%);
}
</style>
