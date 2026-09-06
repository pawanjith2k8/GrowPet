import React from 'react';
import { ProductComparison } from '../../types';
import { Star, ExternalLink, Zap, DollarSign, Clock, ShieldCheck, Check } from 'lucide-react';

interface ProductComparisonCardProps {
  product: ProductComparison;
}

export const ProductComparisonCard: React.FC<ProductComparisonCardProps> = ({ product }) => {
  const handleStoreClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const minPrice = Math.min(...product.stores.map(s => s.price));
  const maxPrice = Math.max(...product.stores.map(s => s.price));
  const savings = +(maxPrice - minPrice).toFixed(2);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4 hover:shadow-card transition-all duration-200">
      {/* Best Overall Pick Banner */}
      {product.bestPick && (
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-300/60 dark:border-amber-700/40 p-3 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
              Best Pick
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {product.bestPick.storeName}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 italic text-right hidden sm:block font-medium">
            &quot;{product.bestPick.reason}&quot;
          </p>
        </div>
      )}

      {/* Product Image & Details */}
      <div className="flex items-start gap-4">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-200/80 dark:border-slate-800 flex-shrink-0 shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {product.targetSpeciesTag}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.overallRating}</span>
              <span className="text-[11px] text-slate-400 font-normal">({product.reviewCount.toLocaleString()})</span>
            </div>
            {savings > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                Save up to ${savings}
              </span>
            )}
          </div>

          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug tracking-tight">
            {product.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>
      </div>

      {/* Multi-Store Comparison Grid */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Live Retailer Comparison Matrix
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {product.stores.map((store, idx) => {
            return (
              <div
                key={idx}
                onClick={() => handleStoreClick(store.productUrl)}
                className="group flex flex-col justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/60 dark:bg-slate-950/60 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 cursor-pointer transition-all duration-200 shadow-subtle"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      {store.storeName}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-base text-slate-900 dark:text-slate-100">
                      ${store.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1.5 flex-wrap my-1">
                  {store.isLowestPrice && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Lowest Price
                    </span>
                  )}

                  {store.isFastestDelivery && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Fastest
                    </span>
                  )}

                  {store.isArrivingSoon && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-[9px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Arriving Soon ({store.deliveryDateFormatted})
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-bold">
                  <span>{store.deliveryDateFormatted}</span>
                  <div className="flex items-center gap-1">
                    <span>View on {store.storeName}</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};