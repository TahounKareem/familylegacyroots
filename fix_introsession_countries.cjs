const fs = require('fs');
let code = fs.readFileSync('src/pages/IntroSession.tsx', 'utf8');

code = code.replace(
  'import { Country } from "country-state-city";',
  'import { ALL_COUNTRIES } from "../data/countries";'
);

code = code.replace(
  '  const countries = Country.getAllCountries();\n',
  ''
);

code = code.replace(
  `    let callingCode = "";
    if (formData.country) {
      const selectedC = countries.find(c => c.name === formData.country);
      if (selectedC) {
        callingCode = \`+\${selectedC.phonecode}\`;
      }
    }`,
  `    let callingCode = "";
    if (formData.country) {
      const selectedC = ALL_COUNTRIES.find(c => c.name === formData.country);
      if (selectedC && selectedC.code) {
        callingCode = selectedC.code;
      }
    }`
);

code = code.replace(
  `                {countries.map(c => (
                  <option key={c.isoCode} value={c.name}>{c.name}</option>
                ))}`,
  `                {ALL_COUNTRIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}`
);

fs.writeFileSync('src/pages/IntroSession.tsx', code);
