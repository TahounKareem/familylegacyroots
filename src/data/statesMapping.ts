import { State } from 'country-state-city';

const ISO_MAP: Record<string, string> = {
  "السعودية": "SA",
  "اليمن": "YE",
  "عمان": "OM",
  "الامارات": "AE",
  "الكويت": "KW",
  "قطر": "QA",
  "البحرين": "BH",
  "العراق": "IQ",
  "سوريا": "SY",
  "الاردن": "JO",
  "فلسطين": "PS",
  "مصر": "EG",
  "ليبيا": "LY",
  "الجزائر": "DZ",
  "المغرب": "MA",
  "موريتانيا": "MR",
  "السودان": "SD",
  "الصومال": "SO",
  "جيبوتي": "DJ",
  "جزر القمر": "KM",
  "تركيا": "TR",
  "ايران": "IR",
  "باكستان": "PK",
  "افغانستان": "AF",
  "الهند": "IN",
  "اندونيسيا": "ID",
  "ماليزيا": "MY",
  "الفلبين": "PH",
  "الصين": "CN",
  "اليابان": "JP",
  "كوريا_الجنوبية": "KR",
  "روسيا": "RU",
  "المملكة_المتحدة": "GB",
  "فرنسا": "FR",
  "المانيا": "DE",
  "ايطاليا": "IT",
  "اسبانيا": "ES",
  "هولندا": "NL",
  "السويد": "SE",
  "النرويج": "NO",
  "سويسرا": "CH",
  "كندا": "CA",
  "المكسيك": "MX",
  "البرازيل": "BR",
  "الارجنتين": "AR",
  "تشيلي": "CL",
  "استراليا": "AU",
  "نيوزيلندا": "NZ",
  "جنوب_افريقيا": "ZA",
  "نيجيريا": "NG",
  "كينيا": "KE",
  "الولايات المتحدة": "US",
};

export const getStatesForCountry = (countryId: string | undefined): { name: string, isoCode: string }[] => {
  if (!countryId) return [];
  
  if (countryId === "السعودية") {
    return [
      { name: "الرياض", isoCode: "01" },
      { name: "مكة المكرمة", isoCode: "02" },
      { name: "المدينة المنورة", isoCode: "03" },
      { name: "القصيم", isoCode: "04" },
      { name: "المنطقة الشرقية", isoCode: "05" },
      { name: "عسير", isoCode: "06" },
      { name: "تبوك", isoCode: "07" },
      { name: "حائل", isoCode: "08" },
      { name: "الحدود الشمالية", isoCode: "09" },
      { name: "جازان", isoCode: "10" },
      { name: "نجران", isoCode: "11" },
      { name: "الباحة", isoCode: "12" },
      { name: "الجوف", isoCode: "14" }
    ];
  }
  
  if (countryId === "الامارات") {
    return [
      { name: "أبو ظبي", isoCode: "AZ" },
      { name: "دبي", isoCode: "DU" },
      { name: "الشارقة", isoCode: "SH" },
      { name: "عجمان", isoCode: "AJ" },
      { name: "أم القيوين", isoCode: "UQ" },
      { name: "رأس الخيمة", isoCode: "RK" },
      { name: "الفجيرة", isoCode: "FU" }
    ];
  }

  if (countryId === "الكويت") {
    return [
      { name: "العاصمة", isoCode: "KU" },
      { name: "حولي", isoCode: "HA" },
      { name: "الفروانية", isoCode: "FA" },
      { name: "مبارك الكبير", isoCode: "MU" },
      { name: "الأحمدي", isoCode: "AH" },
      { name: "الجهراء", isoCode: "JA" }
    ];
  }

  if (countryId === "البحرين") {
    return [
      { name: "العاصمة", isoCode: "13" },
      { name: "المحرق", isoCode: "15" },
      { name: "الشمالية", isoCode: "17" },
      { name: "الجنوبية", isoCode: "14" }
    ];
  }
  
  if (countryId === "قطر") {
    return [
      { name: "الدوحة", isoCode: "DA" },
      { name: "الريان", isoCode: "RA" },
      { name: "الوكرة", isoCode: "WA" },
      { name: "الخور", isoCode: "KH" },
      { name: "الشمال", isoCode: "SH" },
      { name: "أم صلال", isoCode: "US" },
      { name: "الضعاين", isoCode: "ZA" }
    ];
  }
  
  if (countryId === "عمان") {
     return [
      { name: "مسقط", isoCode: "MU" },
      { name: "ظفار", isoCode: "ZU" },
      { name: "مسندم", isoCode: "MU" },
      { name: "البريمي", isoCode: "BU" },
      { name: "الداخلية", isoCode: "DA" },
      { name: "شمال الباطنة", isoCode: "BS" },
      { name: "جنوب الباطنة", isoCode: "BJ" },
      { name: "شمال الشرقية", isoCode: "SS" },
      { name: "جنوب الشرقية", isoCode: "SJ" },
      { name: "الظاهرة", isoCode: "ZA" },
      { name: "الوسطى", isoCode: "WU" }
     ];
  }

  // Fallback to empty array which renders a text input for the user to type in Arabic manually
  return [];
};
