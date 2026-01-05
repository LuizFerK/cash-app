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
  Timestamp,
  DocumentReference,
  type DocumentData,
  Query
} from 'firebase/firestore'
import type { Expense, Config, ExpenseInput } from '../types'
import dayjs from 'dayjs'

const expenses = ref<Expense[]>([])
const expensesRef = ref<Query<DocumentData, DocumentData> | null>(null)
const config = ref<Config | null>(null)
const configRef = ref<DocumentReference<DocumentData, DocumentData> | null>(null)
const loading = ref(true)

// Singleton state
let initialized = false

export function useFinance() {
  if (!initialized) {
    init()
    initialized = true
  }

  const balance = computed(() => config.value?.balance || 0)
  const dailyAmount = computed(() => config.value?.dailyAmount || 0)

  async function addExpense(expense: ExpenseInput) {
    await addDoc(collection(db, 'expenses'), {
      ...expense,
      createdAt: serverTimestamp()
    })
    await updateBalance(-expense.amount)
  }

  async function deleteExpense(expense: Expense) {
    if (!expense.id) return
    await deleteDoc(doc(db, 'expenses', expense.id))
    await updateBalance(expense.amount)
  }

  async function restoreExpense(expense: Expense) {
    if (!expense.id) return
    await setDoc(doc(db, 'expenses', expense.id), expense)
    await updateBalance(-expense.amount)
  }

  return {
    expenses,
    config,
    balance,
    dailyAmount,
    loading,
    addExpense,
    deleteExpense,
    restoreExpense
  }
}

function init() {
  // Listen to expenses
  expensesRef.value = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'))
  onSnapshot(expensesRef.value, (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Expense))
  })

  // Listen to config
  configRef.value = doc(db, 'config', 'main')
  onSnapshot(configRef.value, async (snapshot) => {
    if (!snapshot.exists()) return await setupDefaultConfig()

    const configData = snapshot.data() as Config
    const isSynced = configData.lastSync.toDate().getDate() === Timestamp.now().toDate().getDate()

    if (!isSynced) return await syncBalance(configData)

    config.value = configData
    loading.value = false
  })
}

async function setupDefaultConfig() {
  const dailyAmount = Number(import.meta.env.VITE_DAILY_AMOUNT)
  const configData = {
    lastSync: Timestamp.now(),
    balance: dailyAmount,
    dailyAmount
  }

  await setDoc(configRef.value!, configData)

  config.value = configData
  loading.value = false
}

async function syncBalance(configData: Config) {
  const today = dayjs().startOf('day')
  const lastSync = dayjs(configData.lastSync.toDate()).startOf('day')
  const daysPassed = today.diff(lastSync, 'day')
  const totalIncome = Math.max(1, daysPassed) * Number(import.meta.env.VITE_DAILY_AMOUNT)

  config.value = configData
  await updateBalance(totalIncome, true)

  loading.value = false
}

async function updateBalance(value: number, sync: boolean = false) {
  if (!config.value) return

  const configData = {
    lastSync: sync ? Timestamp.now() : config.value.lastSync,
    dailyAmount: Number(import.meta.env.VITE_DAILY_AMOUNT),
    balance: config.value.balance + value
  }

  await setDoc(configRef.value!, configData)

  config.value = configData
}
