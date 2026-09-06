import React, { useState } from 'react';
import { usePet } from '../../context/PetContext';
import { DollarSign, Plus, Trash2, Tag, ShoppingCart } from 'lucide-react';
import { ExpenseCategory } from '../../types';

export const ExpenseTracker: React.FC = () => {
  const { activePet, expenses, addExpense, deleteExpense } = usePet();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');

  if (!activePet) return null;

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    addExpense({
      category,
      amount: Number(amount),
      currency: '$',
      date: new Date().toISOString().split('T')[0],
      description,
      merchant: merchant || 'Direct Store'
    });
    setAmount('');
    setDescription('');
    setMerchant('');
    setShowForm(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Pet Expense Tracker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Running Total for {activePet.name}: <span className="font-bold text-emerald-600 dark:text-emerald-400">${totalSpent.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Expense</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddExpense} className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="food">Food & Treats</option>
                <option value="vet">Vet & Medical</option>
                <option value="supplies">Supplies & Habitat</option>
                <option value="grooming">Grooming</option>
                <option value="toys">Toys & Enrichment</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="49.99"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Merchant / Store</label>
              <input
                type="text"
                value={merchant}
                onChange={e => setMerchant(e.target.value)}
                placeholder="e.g. Amazon, Chewy"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Item Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. 30lb Salmon dry kibble bag"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
            >
              Save Expense
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {expenses.map(exp => (
          <div
            key={exp.id}
            className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">{exp.description}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {exp.date} • {exp.merchant || 'Store'} • <span className="capitalize">{exp.category}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                ${exp.amount.toFixed(2)}
              </span>
              <button
                onClick={() => deleteExpense(exp.id)}
                className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};