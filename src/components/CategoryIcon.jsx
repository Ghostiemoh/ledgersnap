import React from 'react';
import { Car, Coffee, FileText, Laptop, Receipt, ShoppingBag, User } from 'lucide-react';

const icons = {
  Groceries: ShoppingBag,
  Technology: Laptop,
  Lifestyle: Coffee,
  Transport: Car,
  Invoice: FileText,
  Personal: User,
  Uncategorized: Receipt,
};

const CategoryIcon = ({ category, className = 'h-4 w-4' }) => {
  const Icon = icons[category] || Receipt;
  return <Icon className={className} aria-hidden="true" />;
};

export default CategoryIcon;
