import React from 'react';

interface StatCardProps {
    value: string;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div>
      <p className="text-4xl font-extrabold text-sky-600 dark:text-sky-400">{value}</p>
      <p className="text-zinc-500 dark:text-zinc-400 mt-1">{label}</p>
    </div>
  );
};

export default StatCard;