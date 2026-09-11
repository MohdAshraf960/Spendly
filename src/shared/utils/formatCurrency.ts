export const formatInr = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;

// Truncates (does not round) so 9.959k stays 9.95k. Do not strip zeros on 10.
const formatUpToTwoDecimals = (value: number) => {
  const [whole, fraction = ''] = String(value).split('.');
  const decimals = fraction.slice(0, 2).replace(/0+$/, '');
  return decimals ? `${whole}.${decimals}` : whole;
};

// Compact INR for tiles and stats: k / L / Cr after 3+ digits.
export const formatInrCompact = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${formatUpToTwoDecimals(amount / 10000000)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${formatUpToTwoDecimals(amount / 100000)}L`;
  }

  if (amount >= 1000) {
    return `₹${formatUpToTwoDecimals(amount / 1000)}k`;
  }

  return formatInr(amount);
};
