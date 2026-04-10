import React from 'react';
import { Camera } from 'lucide-react';

const ReceiptFAB = () => {
  return (
    <button
      className="fixed bottom-28 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full fab-glass flex items-center justify-center cloud-shadow z-50 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) hover:scale-110 active:scale-90 active:duration-100"
      aria-label="Scan Receipt"
    >
      <div className="relative">
        <Camera size={36} strokeWidth={1.5} className="relative z-10" />
        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
};

export default ReceiptFAB;
