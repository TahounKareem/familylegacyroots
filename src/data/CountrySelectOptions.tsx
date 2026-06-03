import React from 'react';
import { ALL_COUNTRIES } from './countries';

export function CountrySelectOptions() {
  return (
    <>
      {ALL_COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
    </>
  );
}
