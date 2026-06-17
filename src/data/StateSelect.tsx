import React from 'react';
import { getStatesForCountry } from './statesMapping';

interface StateSelectProps {
  countryId: string | undefined;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const StateSelect: React.FC<StateSelectProps> = ({ countryId, value, onChange, placeholder, className }) => {
  const states = getStatesForCountry(countryId);

  // If no states are found for the country (or it's not mapped), fallback to a simple input field.
  if (!states || states.length === 0) {
    return (
      <input 
        type="text" 
        className={className || "w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3"} 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder || "المدينة / المحافظة"} 
      />
    );
  }

  return (
    <select 
      className={className || "w-full border-brand-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-3 bg-white"} 
      value={value || ""} 
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>{placeholder || "اختر المدينة / المحافظة..."}</option>
      {states.map(state => (
        <option key={state.isoCode} value={state.name}>{state.name}</option>
      ))}
    </select>
  );
};
