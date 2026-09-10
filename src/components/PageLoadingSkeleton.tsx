import React from 'react';
import { Leaf } from 'lucide-react';

export const PageLoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-bubble border border-[#e5e9ee] flex flex-col items-center max-w-sm w-full text-center">
        <div className="relative w-16 h-16 rounded-full bg-[#f4f6f8] shadow-bubble-inset flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-3 border-[#00356a]/15 border-t-[#006e21] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-[#006e21]" />
          </div>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full mb-2">
          HOKI Structural Systems
        </span>
        <h3 className="text-base font-extrabold text-[#00356a]">
          Loading Engineering View...
        </h3>
        <p className="text-xs text-[#00356a]/60 mt-1">
          Optimizing lightweight data assets
        </p>
      </div>
    </div>
  );
};
