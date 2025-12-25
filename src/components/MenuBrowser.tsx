import React, { useEffect, useState } from 'react';
import { fetchMenuCategories, fetchMenuItems, fetchModifiers } from '../utils/orderService';
import { MenuCategory, MenuItem, Modifier, CartItem } from '../types/order';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';

interface MenuBrowserProps {
  onAddToCart: (item: CartItem) => void;
  onOrderSubmit: () => void;
  cartCount: number;
}

export const MenuBrowser: React.FC<MenuBrowserProps> = ({ onAddToCart, onOrderSubmit, cartCount }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, mods] = await Promise.all([
          fetchMenuCategories(),
          fetchModifiers(),
        ]);
        setCategories(cats);
        setModifiers(mods);
        if (cats.length > 0) {
          setSelectedCategory(cats[0].id);
        }
      } catch (error) {
        console.error('Failed to load menu data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const loadItems = async () => {
        try {
          const items = await fetchMenuItems(selectedCategory);
          setMenuItems(items);
          setSelectedItem(null);
        } catch (error) {
          console.error('Failed to load items:', error);
        }
      };
      loadItems();
    }
  }, [selectedCategory]);

  const handleAddToCart = () => {
    if (!selectedItem) return;

    onAddToCart({
      menu_item_id: selectedItem.id,
      quantity,
      modifier_ids: selectedModifiers,
      special_requests: specialRequests,
    });

    setQuantity(1);
    setSelectedModifiers([]);
    setSpecialRequests('');
    setSelectedItem(null);
  };

  const getSelectedModifierPrice = () => {
    return selectedModifiers.reduce((sum, modId) => {
      const mod = modifiers.find((m) => m.id === modId);
      return sum + (mod?.price_adjustment || 0);
    }, 0);
  };

  if (loading) {
    return <div>Loading menu...</div>;
  }

  return (
    <div className="flex h-full gap-6">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-slate-900">Menu</h2>
          <button
            onClick={onOrderSubmit}
            disabled={cartCount === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Fire Order ({cartCount})</span>
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`p-4 rounded-lg transition-all text-left ${
                selectedItem?.id === item.id
                  ? 'ring-2 ring-blue-600 bg-blue-50 border-2 border-blue-600'
                  : 'bg-white border-2 border-slate-200 hover:border-blue-400'
              }`}
            >
              <div className="font-semibold text-slate-900 mb-1">{item.name}</div>
              <div className="text-sm text-slate-600 mb-2 line-clamp-2">{item.description}</div>
              <div className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div className="w-80 bg-white rounded-xl shadow-xl p-6 flex flex-col border-l-4 border-blue-600">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedItem.name}</h3>
          <p className="text-slate-600 mb-6">{selectedItem.description}</p>

          <div className="mb-6">
            <div className="text-lg font-semibold text-slate-900 mb-2">Quantity</div>
            <div className="flex items-center gap-3 bg-slate-100 rounded-lg w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-slate-200 rounded transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-slate-200 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto mb-6">
            {['Noodle Type', 'Broth', 'Spice Level'].map((category) => (
              <div key={category}>
                <div className="text-sm font-semibold text-slate-700 mb-2">{category}</div>
                <div className="space-y-2">
                  {modifiers
                    .filter((m) => m.category === category)
                    .map((mod) => (
                      <label key={mod.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedModifiers.includes(mod.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedModifiers([...selectedModifiers, mod.id]);
                            } else {
                              setSelectedModifiers(selectedModifiers.filter((id) => id !== mod.id));
                            }
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-slate-700">{mod.name}</span>
                        {mod.price_adjustment > 0 && (
                          <span className="text-sm text-blue-600 ml-auto">+${mod.price_adjustment.toFixed(2)}</span>
                        )}
                      </label>
                    ))}
                </div>
              </div>
            ))}

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Special Requests</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Allergies, dietary restrictions..."
                className="w-full p-2 border border-slate-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-slate-600">Item Price:</span>
              <span className="font-semibold">${selectedItem.price.toFixed(2)}</span>
            </div>
            {getSelectedModifierPrice() > 0 && (
              <div className="flex justify-between mb-2">
                <span className="text-slate-600">Modifiers:</span>
                <span className="font-semibold">+${getSelectedModifierPrice().toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-slate-300 pt-2 flex justify-between">
              <span className="text-slate-900 font-bold">Total:</span>
              <span className="text-lg font-bold text-blue-600">
                ${((selectedItem.price + getSelectedModifierPrice()) * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};
