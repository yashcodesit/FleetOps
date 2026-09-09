import React from 'react';

export const StatusPill = ({ status, isDark = false, className = '' }) => {
  const norm = status.toLowerCase().replace('_', ' ');

  let variant = 'pending';
  if (norm === 'in transit' || norm === 'transit') variant = 'transit';
  if (norm === 'delivered' || norm === 'complete') variant = 'delivered';
  if (norm === 'failed') variant = 'failed';

  const darkPrefix = isDark ? 'dark-' : '';

  return (
    <span className={`pill ${darkPrefix}${variant} ${className}`}>
      {norm.toUpperCase()}
    </span>
  );
};
