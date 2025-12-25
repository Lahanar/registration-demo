import React, { useEffect, useState } from 'react';
import { fetchActiveOrders, updateOrderItemStatus, subscribeToOrders } from '../utils/orderService';
import { OrderWithItems } from '../types/order';
import { Clock, ChefHat, CheckCircle, LogOut } from 'lucide-react';

interface KitchenDisplayProps {
  onLogout: () => void;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ onLogout }) => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'cooking' | 'ready'>('pending');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchActiveOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();

    const subscription = subscribeToOrders((data) => {
      setOrders(data);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleItemStatus = async (itemId: string, newStatus: string) => {
    try {
      await updateOrderItemStatus(itemId, newStatus);
      const updated = await fetchActiveOrders();
      setOrders(updated);
    } catch (error) {
      console.error('Failed to update item status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-50 border-red-300';
      case 'cooking':
        return 'bg-amber-50 border-amber-300';
      case 'ready':
        return 'bg-green-50 border-green-300';
      default:
        return 'bg-slate-50';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800';
      case 'cooking':
        return 'bg-amber-100 text-amber-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const hasItemsWithStatus = order.items?.some((item) => item.status === filter);
    return hasItemsWithStatus;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading kitchen display...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <div className="bg-slate-800 shadow-xl border-b-2 border-amber-500">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-bold text-white">Kitchen Display System</h1>
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

      <div className="flex gap-4 bg-slate-800 px-8 py-4 border-b border-slate-700">
        {(['pending', 'cooking', 'ready'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all capitalize ${
              filter === status
                ? 'bg-amber-500 text-slate-900 shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const filteredItems = order.items?.filter((item) => item.status === filter) || [];

            return (
              <div
                key={order.id}
                className={`rounded-xl shadow-lg border-2 overflow-hidden ${getStatusColor(filter)} transition-all`}
              >
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">Table {order.tables?.table_number}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeColor(filter)}`}>
                      {filter}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(order.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {filteredItems.map((item, idx) => (
                      <div key={item.id} className="bg-white rounded-lg p-4 border border-slate-200">
                        <div className="mb-3">
                          <div className="font-semibold text-slate-900 text-lg">
                            {item.quantity}x {item.menu_item?.name}
                          </div>
                          {item.special_requests && (
                            <div className="text-sm text-slate-700 mt-1 font-medium">
                              Note: {item.special_requests}
                            </div>
                          )}
                          {item.modifiers && item.modifiers.length > 0 && (
                            <div className="text-xs text-slate-600 mt-2 space-y-1">
                              {item.modifiers.map((mod, midx) => (
                                <div key={midx}>• {mod.name}</div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-slate-200">
                          {filter === 'pending' && (
                            <button
                              onClick={() => handleItemStatus(item.id, 'cooking')}
                              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded font-semibold transition-colors text-sm"
                            >
                              Start Cooking
                            </button>
                          )}
                          {filter === 'cooking' && (
                            <button
                              onClick={() => handleItemStatus(item.id, 'ready')}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark Ready
                            </button>
                          )}
                          {filter === 'ready' && (
                            <div className="flex-1 bg-green-100 text-green-800 px-3 py-2 rounded font-semibold text-center text-sm">
                              Ready for Pickup
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64">
            <ChefHat className="w-16 h-16 text-slate-700 mb-4" />
            <p className="text-slate-400 text-xl font-semibold">No {filter} orders</p>
          </div>
        )}
      </div>
    </div>
  );
};
