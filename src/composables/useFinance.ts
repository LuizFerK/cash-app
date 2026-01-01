import { ref, computed } from 'vue'
import { db } from '../firebase'
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  setDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import type { Expense, Config, ExpenseInput } from '../types'
import dayjs from 'dayjs'

const expenses = ref<Expense[]>([])
const config = ref<Config | null>(null)
const loading = ref(true)

// Singleton state
let initialized = false

export function useFinance() {
  if (!initialized) {
    init()
    initialized = true
  }

  const balance = computed(() => {
    if (!config.value) return 0

    const start = dayjs(config.value.startDate.toDate())
    const now = dayjs()
    const daysPassed = now.diff(start, 'day')

    const totalIncome = Math.max(0, daysPassed) * config.value.dailyAmount + (config.value.manualOffsets || 0)

    const totalExpenses = expenses.value.reduce((acc, curr) => acc + curr.amount, 0)

    return totalIncome - totalExpenses
  })

  async function addExpense(expense: ExpenseInput) {
    await addDoc(collection(db, 'expenses'), {
      ...expense,
      createdAt: serverTimestamp()
    })
  }

  async function deleteExpense(id: string) {
    await deleteDoc(doc(db, 'expenses', id))
  }

  return {
    expenses,
    config,
    balance,
    loading,
    addExpense,
    deleteExpense
  }
}

function init() {
  // Listen to expenses
  const expensesQuery = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'))

  onSnapshot(expensesQuery, (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Expense))
  })

  // Listen to config
  const configRef = doc(db, 'config', 'main')
  onSnapshot(configRef, async (snapshot) => {
    if (snapshot.exists()) {
      config.value = snapshot.data() as Config
    } else {
      // Initialize default config if not exists
      // Default: Start today, 72 daily
      const defaultConfig = {
        startDate: Timestamp.now(),
        dailyAmount: 72,
        manualOffsets: 0
      }
      await setDoc(configRef, defaultConfig)
    }
    loading.value = false
  })
}
