export type Category = 'beans' | 'gear' | 'cups'

export type ProductRow = {
  id: string
  created_at: string
  name: string
  slug: string
  brand: string
  category: Category
  price: number
  compare_at_price: number | null
  description: string
  color: string
  sizes: string[]
  images: string[]
  stock: number
  is_featured: boolean
  roast: number
}

export type WishlistRow = {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

export type CartItemRow = {
  id: string
  user_id: string
  product_id: string
  size: string
  quantity: number
  created_at: string
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export type OrderRow = {
  id: string
  user_id: string
  status: OrderStatus
  total: number
  full_name: string
  address: string
  city: string
  phone: string
  created_at: string
}

export type OrderItemRow = {
  id: string
  order_id: string
  product_id: string
  size: string
  quantity: number
  unit_price: number
}

export type AdminRow = {
  user_id: string
  created_at: string
}

export type SiteSettingRow = {
  key: string
  value: string
  updated_at: string
}

export type OrderWithItems = OrderRow & {
  order_items: {
    id: string
    size: string
    quantity: number
    unit_price: number
    products: { name: string } | null
  }[]
}

type TableDefinition<Row, InsertOmit extends keyof Row> = {
  Row: Row
  Insert: Omit<Row, InsertOmit>
  Update: Partial<Omit<Row, InsertOmit>>
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      products: TableDefinition<ProductRow, 'id' | 'created_at'>
      wishlist: TableDefinition<WishlistRow, 'id' | 'created_at'>
      cart_items: TableDefinition<CartItemRow, 'id' | 'created_at'>
      orders: TableDefinition<OrderRow, 'id' | 'created_at'>
      order_items: TableDefinition<OrderItemRow, 'id'>
      admins: TableDefinition<AdminRow, 'created_at'>
      site_settings: TableDefinition<SiteSettingRow, 'updated_at'>
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
