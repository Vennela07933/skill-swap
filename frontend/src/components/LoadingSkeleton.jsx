import React from 'react';

export const UserCardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl animate-pulse space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-slate-800 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          <div className="h-3 bg-slate-800 rounded w-1/3"></div>
        </div>
      </div>
      <div className="h-3 bg-slate-800 rounded w-full"></div>
      <div className="h-3 bg-slate-800 rounded w-4/5"></div>
      <div className="pt-4 border-t border-slate-800/50 flex justify-between gap-4">
        <div className="h-8 bg-slate-800 rounded w-1/3"></div>
        <div className="h-8 bg-slate-800 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-4 space-y-2">
          <div className="h-3 bg-slate-800 rounded w-1/2"></div>
          <div className="h-6 bg-slate-800 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};
