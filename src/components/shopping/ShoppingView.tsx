import React, { useState, useMemo } from 'react';
import { usePet } from '../../context/PetContext';
import { searchAndCompareProducts, SortOption } from '../../services/shoppingService';
import { ProductComparisonCard } from './ProductComparisonCard';
import { SpeciesSearchChips } from './SpeciesSearchChips';
import { Search, Clock, DollarSign, Star, X } from 'lucide-react';

export const ShoppingView: React.FC = () => {
  const { activePet } = usePet();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('best_match');
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);

  const products = useMemo(() => {
    return searchAndCompareProducts(
      searchQuery,
      activePet?.category,
      sortBy,
      undefined,
      fastDeliveryOnly
    );
  }, [searchQuery, activePet?.category, sortBy, fastDeliveryOnly]);

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-14">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Multi-Store Pet Price Compare
          </h2>
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            Amazon • Chewy • Petco • Flipkart
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Search any pet item, compare prices across retailers, and click out directly to real product store pages
        </p>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search any product (e.g. dog food, aquarium filter, reptile UV lamp, bird cage)..."
          className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <SpeciesSearchChips
        activeQuery={searchQuery}
        onSelectChip={query => setSearchQuery(query)}
      />

      <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setSortBy('best_match')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              sortBy === 'best_match'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Best Match
          </button>

          <button
            onClick={() => setSortBy('price_asc')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
              sortBy === 'price_asc'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Lowest Price</span>
          </button>

          <button
            onClick={() => setSortBy('delivery_fastest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
              sortBy === 'delivery_fastest'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Fastest Delivery</span>
          </button>

          <button
            onClick={() => setSortBy('rating')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
              sortBy === 'rating'
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Top Rated</span>
          </button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
          <input
            type="checkbox"
            checked={fastDeliveryOnly}
            onChange={e => setFastDeliveryOnly(e.target.checked)}
            className="accent-emerald-600 w-3.5 h-3.5 rounded"
          />
          <span>Arriving Tomorrow / 2-Days Only</span>
        </label>
      </div>

      <div className="space-y-4">
        {products.map(product => (
          <ProductComparisonCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};