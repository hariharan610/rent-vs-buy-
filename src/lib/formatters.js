export const formatINR = (num) => {
  const abs = Math.abs(num);
  const sign = num < 0 ? "−" : "";
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)}Cr`;
  if (abs >= 100000)   return `${sign}₹${(abs / 100000).toFixed(2)}L`;
  if (abs >= 1000)     return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  return `${sign}₹${Math.round(abs)}`;
};

export const formatINRFull = (num) =>
  "₹" + Math.round(Math.abs(num)).toLocaleString("en-IN");
