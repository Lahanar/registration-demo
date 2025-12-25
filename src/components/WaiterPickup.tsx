import React, { useEffect, useState } from 'react';
import { fetchActiveOrders, updateOrderStatus, subscribeToOrders } from '../utils/orderService';
import { OrderWithItems } from '../types/order';
import { Package, AlertCircle, CheckCircle2, LogOut } from 'lucide-react';

interface WaiterPickupProps {
  onLogout: () => void;
}

export const WaiterPickup: React.FC<WaiterPickupProps> = ({ onLogout }) => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleOrderPickup = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'served');
      const updated = await fetchActiveOrders();
      setOrders(updated);
    } catch (error) {
      console.error('Failed to mark order as served:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'cooking':
        return 'bg-amber-50 border-l-4 border-amber-500';
      case 'ready':
        return 'bg-green-50 border-l-4 border-green-500';
      default:
        return 'bg-slate-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Pending', icon: AlertCircle };
      case 'cooking':
        return { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Cooking', icon: Package };
      case 'ready':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Ready!', icon: CheckCircle2 };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-800', label: 'Unknown', icon: Package };
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading orders...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-slate-900">Order Pickup</h1>
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

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-4">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-md border-2 border-dashed border-slate-300">
              <Package className="w-16 h-16 text-slate-400 mb-4" />
              <p className="text-slate-600 text-lg font-semibold">No active orders</p>
            </div>
          ) : (
            orders.map((order) => {
              const readyItems = order.items?.filter((item) => item.status === 'ready') || [];
              const allReady = readyItems.length > 0 && readyItems.length === order.items?.length;

              return (
                <div
                  key={order.id}
                  className={`rounded-xl shadow-lg overflow-hidden transition-all ${getStatusColor(order.status)}`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900">Table {order.tables?.table_number}</h3>
                        <p className="text-slate-600 text-sm">Order placed: {new Date(order.created_at).toLocaleTimeString()}</p>
                      </div>

                      {(() => {
                        const badge = getStatusBadge(order.status);
                        const Icon = badge.icon;
                        return (
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${badge.bg} ${badge.text}`}>
                            <Icon className="w-5 h-5" />
                            <span className="font-semibold">{badge.label}</span>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {order.items?.map((item) => {
                        const isReady = item.status === 'ready';
                        return (
                          <div
                            key={item.id}
                            className={`p-4 rounded-lg border-2 ${
                              isReady ? 'bg-white border-green-300' : 'bg-white border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-semibold text-slate-900">
                                  {item.quantity}x {item.menu_item?.name}
                                </div>
                                {isReady && <div className="text-xs text-green-600 font-semibold mt-1">Ready for pickup</div>}
                              </div>
                              {isReady && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            </div>

                            {item.modifiers && item.modifiers.length > 0 && (
                              <div className="text-xs text-slate-600 space-y-1 mt-2">
                                {item.modifiers.map((mod, idx) => (
                                  <div key={idx}>• {mod.name}</div>
                                ))}
                              </div>
                            )}
                            {item.special_requests && (
                              <div className="text-xs text-amber-700 bg-amber-50 rounded mt-2 p-2 font-medium">
                                {item.special_requests}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {allReady && order.status !== 'served' && (
                      <button
                        onClick={() => handleOrderPickup(order.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                        Order Complete & Served
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
