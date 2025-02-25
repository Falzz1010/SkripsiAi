import React from 'react';
import { SelectFieldProps } from '../../types';

export default function SelectField({ label, value, onChange, options, icon }: SelectFieldProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-3 text-lg font-black uppercase text-black dark:text-white">
        {icon}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-white dark:bg-[#2A2A2A] 
                 text-black dark:text-white
                 input-neubrutalism"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}