import * as Lucide from 'lucide-vue-next'
import type { CategoryIcon } from './types'

export const categories: CategoryIcon = {
  Mercado: { icon: Lucide.ShoppingCart, color: '#A3DC9A' },
  Restaurante: { icon: Lucide.Utensils, color: '#CD5656' },
  Delivery: { icon: Lucide.HamburgerIcon, color: '#B77466' },
  'Uber/99': { icon: Lucide.CarTaxiFront, color: '#FD7979' },
  BlaBlaCar: { icon: Lucide.Luggage, color: '#BBDCE5' },
  Ônibus: { icon: Lucide.BusFront, color: '#BBDCE5' },
  Farmácia: { icon: Lucide.HeartPlus, color: '#8CA9FF' },
  Cinema: { icon: Lucide.Clapperboard, color: '#DEE791' },
  Ingresso: { icon: Lucide.Ticket, color: '#7F55B1' },
  Outros: { icon: Lucide.Box, color: '#f98fa5' },
}
