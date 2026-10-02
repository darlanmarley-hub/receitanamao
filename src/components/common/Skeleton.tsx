import React from 'react';

export const RecipeCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-warm-200 shadow-soft animate-pulse">
      <div className="w-full h-48 bg-warm-200" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="w-20 h-5 bg-warm-200 rounded-md" />
          <div className="w-12 h-5 bg-warm-200 rounded-md" />
        </div>
        <div className="w-3/4 h-6 bg-warm-200 rounded-md" />
        <div className="w-full h-10 bg-warm-100 rounded-md" />
        <div className="flex justify-between items-center pt-2 border-t border-warm-100">
          <div className="w-24 h-4 bg-warm-200 rounded-md" />
          <div className="w-8 h-8 bg-warm-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};
