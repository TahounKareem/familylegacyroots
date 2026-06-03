import { writeFileSync } from 'fs';

const ARAB_COUNTRIES = [
  { id: "السعودية", name: "المملكة العربية السعودية", code: "+966" },
  { id: "اليمن", name: "اليمن", code: "+967" },
  { id: "عمان", name: "سلطنة عمان", code: "+968" },
  { id: "الامارات", name: "الإمارات العربية المتحدة", code: "+971" },
  { id: "الكويت", name: "الكويت", code: "+965" },
  { id: "قطر", name: "قطر", code: "+974" },
  { id: "البحرين", name: "البحرين", code: "+973" },
  { id: "العراق", name: "العراق", code: "+964" },
  { id: "سوريا", name: "سوريا", code: "+963" },
  { id: "الاردن", name: "الأردن", code: "+962" },
  { id: "فلسطين", name: "فلسطين", code: "+970" },
  { id: "مصر", name: "مصر", code: "+20" },
  { id: "ليبيا", name: "ليبيا", code: "+218" },
  { id: "الجزائر", name: "الجزائر", code: "+213" },
  { id: "المغرب", name: "المغرب", code: "+212" },
  { id: "موريتانيا", name: "موريتانيا", code: "+222" },
  { id: "السودان", name: "السودان", code: "+249" },
  { id: "الصومال", name: "الصومال", code: "+252" },
  { id: "جيبوتي", name: "جيبوتي", code: "+253" },
  { id: "جزر القمر", name: "جزر القمر", code: "+269" }
];

const OTHER_EXISTING = [
  { id: "تركيا", name: "تركيا", code: "+90" },
  { id: "ايران", name: "إيران", code: "+98" },
  { id: "باكستان", name: "باكستان", code: "+92" },
  { id: "افغانستان", name: "أفغانستان", code: "+93" },
  { id: "الهند", name: "الهند", code: "+91" },
  { id: "اندونيسيا", name: "إندونيسيا", code: "+62" },
  { id: "ماليزيا", name: "ماليزيا", code: "+60" },
  { id: "الفلبين", name: "الفلبين", code: "+63" },
  { id: "الصين", name: "الصين", code: "+86" },
  { id: "اليابان", name: "اليابان", code: "+81" },
  { id: "كوريا_الجنوبية", name: "كوريا الجنوبية", code: "+82" },
  { id: "روسيا", name: "روسيا", code: "+7" },
  { id: "المملكة_المتحدة", name: "المملكة المتحدة", code: "+44" },
  { id: "فرنسا", name: "فرنسا", code: "+33" },
  { id: "المانيا", name: "ألمانيا", code: "+49" },
  { id: "ايطاليا", name: "إيطاليا", code: "+39" },
  { id: "اسبانيا", name: "إسبانيا", code: "+34" },
  { id: "هولندا", name: "هولندا", code: "+31" },
  { id: "السويد", name: "السويد", code: "+46" },
  { id: "النرويج", name: "النرويج", code: "+47" },
  { id: "سويسرا", name: "سويسرا", code: "+41" },
  { id: "كندا", name: "كندا", code: "+1" },
  { id: "المكسيك", name: "المكسيك", code: "+52" },
  { id: "البرازيل", name: "البرازيل", code: "+55" },
  { id: "الارجنتين", name: "الأرجنتين", code: "+54" },
  { id: "تشيلي", name: "تشيلي", code: "+56" },
  { id: "استراليا", name: "أستراليا", code: "+61" },
  { id: "نيوزيلندا", name: "نيوزيلندا", code: "+64" },
  { id: "جنوب_افريقيا", name: "جنوب أفريقيا", code: "+27" },
  { id: "نيجيريا", name: "نيجيريا", code: "+234" },
  { id: "كينيا", name: "كينيا", code: "+254" }
];

const ALL_REST_RAW = [
  "أثيوبيا","أذربيجان","أرمينيا","أروبا","أريتريا","أوغندا",
  "ألبانيا","أندورا","أنغولا","أوزبكستان","أوكرانيا","أوروغواي",
  "أيسلندا","إكوادور","أيرلندا","إستونيا","إسواتيني","إفريقيا الوسطى",
  "بابوا غينيا الجديدة","باراغواي","بالاو","بوتسوانا","بوتان","بورتوريكو",
  "بوركينا فاسو","بوروندي","البوسنة والهرسك","بولندا","بوليفيا","بيرو",
  "بيلاروسيا","بليز","بنما","بنين","تايوان","تايلاند","تركمانستان",
  "تشاد","تنزانيا","توغو","توفالو","تونغا","تيمور الشرقية","جامايكا",
  "الجبل الأسود","غرينادا","غواتيمالا","غيانا","غينيا","غينيا الاستوائية",
  "غينيا بيساو","الفاتيكان","فانواتو","فنزويلا","فنلندا","فيجي",
  "قبرص","كازاخستان","كرواتيا","كمبوديا","كوبا","كوت ديفوار",
  "كوريا الشمالية","كولومبيا","الكونغو","الكونغو الديمقراطية","لاتفيا","لاوس",
  "لبنان","لوكسمبورغ","ليتوانيا","ليسوتو","ليختنشتاين","ماكاو","مالاوي",
  "مالطا","مالي","مدغشقر","مقدونيا الشمالية","موريشيوس","موزمبيق",
  "مولدوفا","موناكو","ميكرونيسيا","ناميبيا","ناورو","النيجر","نيكاراغوا",
  "نيبال","هايتي","هندوراس","المجر","جزر البهاما","رواندا","رومانيا"
];

const EU_COUNTRIES = [
    "النمسا", "بلجيكا", "بلغاريا", "التشيك", "الدنمارك", "فنلندا",
    "اليونان", "أيرلندا", "إيطاليا", "هولندا", "بولندا", "البرتغال",
    "سلوفاكيا", "إسبانيا", "السويد", "كرواتيا", "قبرص", "إستونيا",
    "لاتفيا", "ليتوانيا", "لوكسمبورغ", "مالطا", "رومانيا", "سلوفينيا", "المجر", "فرنسا", "ألمانيا"
];

// Deduplicate ALL_REST_RAW + EU_COUNTRIES
const allRestSet = new Set([...ALL_REST_RAW, ...EU_COUNTRIES]);
const ALL_REST_NODUPES = Array.from(allRestSet);

const currentNames = new Set([...ARAB_COUNTRIES, ...OTHER_EXISTING].map(c => c.name));

const NEW_COUNTRIES = ALL_REST_NODUPES
  .filter(name => !currentNames.has(name) && name !== "إسرائيل" && name !== "الولايات المتحدة الأمريكية")
  .map(name => ({ id: name.replace(/ /g, '_'), name, code: "" }))
  .sort((a, b) => a.name.localeCompare(b.name, 'ar'));

const ALL_COUNTRIES = [...ARAB_COUNTRIES, ...OTHER_EXISTING, ...NEW_COUNTRIES];

const fileContent = `export const ALL_COUNTRIES = ${JSON.stringify(ALL_COUNTRIES, null, 2)};
export const getPhoneCode = (countryId: string) => {
  const c = ALL_COUNTRIES.find(c => c.id === countryId);
  return c ? (c.code || "") : "";
};
`;

writeFileSync('src/data/countries.ts', fileContent);

const selectContent = `import React from 'react';
import { ALL_COUNTRIES } from './countries';

export function CountrySelectOptions() {
  return (
    <>
      {ALL_COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
    </>
  );
}
`;

writeFileSync('src/data/CountrySelectOptions.tsx', selectContent);
