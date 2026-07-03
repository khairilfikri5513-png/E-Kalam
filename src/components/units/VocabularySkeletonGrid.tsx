import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const VocabularySkeletonGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-[2rem] p-4 shadow-md shadow-slate-200/50 border border-slate-100 flex flex-col items-center w-full h-[220px]">
          <Skeleton className="h-24 w-full rounded-2xl mb-3" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-12 w-12 rounded-full mt-auto" />
        </div>
      ))}
    </div>
  );
};
