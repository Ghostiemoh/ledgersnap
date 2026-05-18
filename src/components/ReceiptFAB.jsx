import React from 'react';
import { Camera } from 'lucide-react';

const ReceiptFAB = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="button-primary fixed bottom-24 right-4 z-40 h-14 w-14 rounded-lg p-0 shadow-lg md:hidden"
    aria-label="Capture receipt"
  >
    <Camera className="h-5 w-5" aria-hidden="true" />
  </button>
);

export default ReceiptFAB;
