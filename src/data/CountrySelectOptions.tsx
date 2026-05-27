import { ARAB_COUNTRIES, OTHER_COUNTRIES } from "./countries";

export function CountrySelectOptions() {
  return (
    <>
      <option value="" disabled>اختر الدولة...</option>
      <optgroup label="الدول العربية">
        {ARAB_COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </optgroup>
      <optgroup label="باقي دول العالم">
        {OTHER_COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </optgroup>
    </>
  );
}
