import { supabase } from './supabase';
import { Order, OrderItem, MenuItem, Modifier, Table, MenuCategory, OrderWithItems } from '../types/order';

export const fetchTables = async (): Promise<Table[]> => {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .order('table_number', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const fetchMenuCategories = async (): Promise<MenuCategory[]> => {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const fetchMenuItems = async (categoryId?: string): Promise<MenuItem[]> => {
  let query = supabase.from('menu_items').select('*');

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query.order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const fetchModifiers = async (): Promise<Modifier[]> => {
  const { data, error } = await supabase
    .from('modifiers')
    .select('*');

  if (error) throw error;
  return data || [];
};

export const createOrder = async (tableId: string): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ table_id: tableId, status: 'pending' }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addOrderItem = async (
  orderId: string,
  menuItemId: string,
  quantity: number,
  modifierIds: string[],
  specialRequests: string
): Promise<OrderItem> => {
  const { data, error } = await supabase
    .from('order_items')
    .insert([
      {
        order_id: orderId,
        menu_item_id: menuItemId,
        quantity,
        special_requests: specialRequests || null,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) throw error;

  if (modifierIds.length > 0) {
    const modifierInserts = modifierIds.map((modifierId) => ({
      order_item_id: data.id,
      modifier_id: modifierId,
    }));

    const { error: modError } = await supabase
      .from('order_item_modifiers')
      .insert(modifierInserts);

    if (modError) throw modError;
  }

  return data;
};

export const fetchActiveOrders = async (): Promise<OrderWithItems[]> => {
  const { data: orders, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      tables:table_id(id, table_number, capacity),
      order_items(*)
    `
    )
    .in('status', ['pending', 'cooking', 'ready'])
    .order('created_at', { ascending: false });

  if (error) throw error;

  const enrichedOrders = await Promise.all(
    (orders || []).map(async (order) => {
      const items = await Promise.all(
        (order.order_items || []).map(async (item) => {
          const { data: menuItem } = await supabase
            .from('menu_items')
            .select('*')
            .eq('id', item.menu_item_id)
            .single();

          const { data: modifiers } = await supabase
            .from('order_item_modifiers')
            .select('modifiers(*)')
            .eq('order_item_id', item.id);

          return {
            ...item,
            menu_item: menuItem,
            modifiers: modifiers?.map((m: any) => m.modifiers) || [],
          };
        })
      );

      return {
        ...order,
        items,
      };
    })
  );

  return enrichedOrders;
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) throw error;
};

export const updateOrderItemStatus = async (itemId: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('order_items')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', itemId);

  if (error) throw error;
};

export const subscribeToOrders = (callback: (orders: OrderWithItems[]) => void) => {
  const subscription = supabase
    .from('orders')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      () => {
        fetchActiveOrders().then(callback);
      }
    )
    .subscribe();

  return subscription;
};
