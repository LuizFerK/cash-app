import { Timestamp } from 'firebase/firestore'
import type { LucideIcon } from 'lucide-vue-next'

export type Category =
  | 'Mercado'
  | 'Restaurante'
  | 'Delivery'
  | 'Uber/99'
  | 'BlaBlaCar'
  | 'Ônibus'
  | 'Farmácia'
  | 'Cinema'
  | 'Ingresso'
  | 'Outros'

export interface Expense {
  id: string
  name: string
  category: Category
  amount: number
  createdAt: Timestamp
}

export interface ExpenseInput {
  name: string
  category: Category
  amount: number
}

export type CategoryIcon = {
  [key in Category]: {
    icon: LucideIcon
    color: string
  }
}