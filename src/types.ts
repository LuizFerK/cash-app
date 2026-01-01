import { Timestamp } from 'firebase/firestore'

export interface Expense {
  id?: string
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
  startDate: Timestamp
  dailyAmount: number
  manualOffsets?: number
}
