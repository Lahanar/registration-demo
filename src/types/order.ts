export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'served';
export type ItemStatus = 'pending' | 'cooking' | 'ready' | 'served';

export interface Table {
  id: string;
  table_number: number;
  capacity: number;
  created_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  display_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  display_order: number;
}

export interface Modifier {
  id: string;
  category: string;
  name: string;
  price_adjustment: number;
}

export interface Order {
  id: string;
  table_id: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  status: ItemStatus;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemWithDetails extends OrderItem {
  menu_item?: MenuItem;
  modifiers?: Modifier[];
}

export interface OrderWithItems extends Order {
  table?: Table;
  items?: OrderItemWithDetails[];
}

export interface CartItem {
  menu_item_id: string;
  quantity: number;
  modifier_ids: string[];
  special_requests: string;
}
