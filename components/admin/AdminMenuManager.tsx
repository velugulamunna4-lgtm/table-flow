'use client';

import React, { useState } from 'react';
import { useMenuStore } from '@/lib/store';
import { MenuItem, VegType } from '@/types';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { SpiceLevel } from '@/components/ui/SpiceLevel';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit2, Trash2, Search, Check, AlertCircle, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export const AdminMenuManager: React.FC = () => {
  const { menuItems, updateMenuItems, setItemAvailability } = useMenuStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('350');
  const [category, setCategory] = useState<'specials' | 'starters' | 'mains' | 'biryani' | 'desserts' | 'drinks'>('mains');
  const [vegType, setVegType] = useState<VegType>('veg');
  const [spiceLevel, setSpiceLevel] = useState<0 | 1 | 2 | 3>(1);
  const [description, setDescription] = useState('');

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setPrice('350');
    setCategory('mains');
    setVegType('veg');
    setSpiceLevel(1);
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price.toString());
    setCategory(item.category);
    setVegType(item.vegType);
    setSpiceLevel(item.spiceLevel);
    setDescription(item.description);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingItem) {
      // Update
      const updated = menuItems.map((i) =>
        i.id === editingItem.id
          ? {
              ...i,
              name,
              price: parseInt(price, 10) || 100,
              category,
              vegType,
              spiceLevel,
              description,
            }
          : i
      );
      updateMenuItems(updated);
    } else {
      // Create new
      const newItem: MenuItem = {
        id: `item-custom-${Date.now()}`,
        name,
        price: parseInt(price, 10) || 100,
        category,
        vegType,
        spiceLevel,
        description,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
        emojiFallback: '🍲',
        preparationTimeMinutes: 15,
      };
      updateMenuItems([newItem, ...menuItems]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (itemId: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      updateMenuItems(menuItems.filter((i) => i.id !== itemId));
    }
  };

  const filtered = menuItems.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items..."
            className="w-full h-11 pl-10 pr-4 rounded-pill bg-canvas border border-borderSubtle text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Add New Dish
        </Button>
      </div>

      {/* Menu Table */}
      <div className="bg-surface rounded-3xl border border-borderSubtle overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-canvas border-b border-borderSubtle font-heading font-black text-content-secondary uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Dish</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Diet</th>
                <th className="py-3.5 px-3">Spice</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-3">In Stock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {filtered.map((dish) => (
                <tr key={dish.id} className="hover:bg-canvas/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-heading font-bold text-sm text-content-primary">
                      {dish.name}
                    </div>
                    <div className="text-[11px] text-content-muted line-clamp-1 max-w-xs">
                      {dish.description}
                    </div>
                  </td>
                  <td className="py-3 px-3 capitalize font-medium text-content-secondary">
                    {dish.category}
                  </td>
                  <td className="py-3 px-3">
                    <VegIndicator type={dish.vegType} size="sm" showLabel />
                  </td>
                  <td className="py-3 px-3">
                    <SpiceLevel level={dish.spiceLevel} />
                  </td>
                  <td className="py-3 px-3 font-heading font-black text-content-primary">
                    {formatCurrency(dish.price)}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => setItemAvailability(dish.id, !dish.isAvailable)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                        dish.isAvailable
                          ? 'bg-status-success/15 text-status-success'
                          : 'bg-status-alert/15 text-status-alert'
                      }`}
                    >
                      {dish.isAvailable ? 'Available' : 'Sold Out'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(dish)}
                        className="p-2 rounded-full hover:bg-canvas text-content-secondary hover:text-content-primary"
                        title="Edit dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(dish.id)}
                        className="p-2 rounded-full hover:bg-canvas text-content-secondary hover:text-status-alert"
                        title="Delete dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Dish' : 'Add New Dish to Menu'}
      >
        <div className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-bold text-content-secondary block mb-1">
              Dish Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Malai Kofta"
              className="w-full p-2.5 rounded-xl bg-canvas border border-borderSubtle text-sm font-medium focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-content-secondary block mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-canvas border border-borderSubtle text-sm font-bold focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-content-secondary block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-canvas border border-borderSubtle text-sm font-medium focus:ring-1 focus:ring-primary"
              >
                <option value="specials">Chef's Specials</option>
                <option value="starters">Starters</option>
                <option value="mains">Main Course</option>
                <option value="biryani">Dum Biryani</option>
                <option value="desserts">Desserts</option>
                <option value="drinks">Beverages</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-content-secondary block mb-1">
                Dietary
              </label>
              <select
                value={vegType}
                onChange={(e) => setVegType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-canvas border border-borderSubtle text-sm font-medium focus:ring-1 focus:ring-primary"
              >
                <option value="veg">Pure Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-content-secondary block mb-1">
                Spice Level (0 to 3)
              </label>
              <select
                value={spiceLevel}
                onChange={(e) => setSpiceLevel(parseInt(e.target.value) as any)}
                className="w-full p-2.5 rounded-xl bg-canvas border border-borderSubtle text-sm font-medium focus:ring-1 focus:ring-primary"
              >
                <option value={0}>0 - Mild</option>
                <option value={1}>1 - Medium</option>
                <option value={2}>2 - Spicy</option>
                <option value={3}>3 - Fiery Hot</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-content-secondary block mb-1">
              Short Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fresh farm ingredients, charcoal smoked..."
              className="w-full p-2.5 rounded-xl bg-canvas border border-borderSubtle text-sm font-medium focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" className="flex-1" onClick={handleSave}>
              Save Dish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
