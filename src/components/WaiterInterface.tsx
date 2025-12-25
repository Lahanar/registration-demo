import React, { useState } from 'react';
import { Table } from '../types/order';
import { MenuBrowser } from './MenuBrowser';
import { addOrderItem, createOrder } from '../utils/orderService';
import { CartItem } from '../types/order';
import { LogOut, ArrowLeft } from 'lucide-react';

interface WaiterInterfaceProps {
  table: Table;
  onBack: () => void;
  onLogout: () => void;
}

export const WaiterInterface: React.FC<WaiterInterfaceProps> = ({ table, onBack, onLogout }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = (item: CartItem) => {
    setCart([...cart, item]);
    setMessage(`Added ${item.quantity} item(s) to cart`);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;

    setSubmitting(true);
    try {
      const order = await createOrder(table.id);
      setOrderId(order.id);

      for (const item of cart) {
        await addOrderItem(
          order.id,
          item.menu_item_id,
          item.quantity,
          item.modifier_ids,
          item.special_requests
        );
      }

      setCart([]);
      setMessage('Order fired to kitchen!');
      setTimeout(() => {
        setOrderId(null);
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit order:', error);
      setMessage('Failed to submit order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="border-l border-slate-300 pl-6">
              <h2 className="text-xl font-bold text-slate-900">Table {table.table_number}</h2>
              <p className="text-sm text-slate-600">Capacity: {table.capacity}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-8">
        <MenuBrowser onAddToCart={handleAddToCart} onOrderSubmit={handleSubmitOrder} cartCount={cart.length} />
      </div>

      {message && (
        <div className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          {message}
        </div>
      )}

      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-slate-900">Submitting order...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
