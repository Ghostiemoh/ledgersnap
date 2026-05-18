export const formatCurrency = (value = 0, options = {}) => {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(amount);
};

export const formatSignedCurrency = (value = 0) => {
  const amount = Number(value) || 0;
  const prefix = amount > 0 ? '+' : amount < 0 ? '-' : '';

  return `${prefix}${formatCurrency(Math.abs(amount))}`;
};

export const getTodayLabel = () =>
  new Intl.DateTimeFormat('en-NG', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

export const getPercent = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};
