import { Timestamp } from 'firebase/firestore'

export interface Expense {
  id: string
  name: string
  category: string
  amount: number
  createdAt: Timestamp
}

export interface ExpenseInput {
  name: string
  category: string
  amount: number
}

export interface Config {
  lastSync: Timestamp
  balance: number
  dailyAmount: number
}
