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
  "تونس": "TN",
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

  
  if (countryId === "مصر") {
    return [
      { name: "القاهرة", isoCode: "C" }, { name: "الجيزة", isoCode: "GZ" }, { name: "الإسكندرية", isoCode: "ALX" },
      { name: "الدقهلية", isoCode: "DK" }, { name: "الشرقية", isoCode: "SHR" }, { name: "المنوفية", isoCode: "MNF" },
      { name: "القليوبية", isoCode: "KB" }, { name: "البحيرة", isoCode: "BH" }, { name: "الغربية", isoCode: "GH" },
      { name: "بورسعيد", isoCode: "PTS" }, { name: "دمياط", isoCode: "DT" }, { name: "الإسماعيلية", isoCode: "IS" },
      { name: "السويس", isoCode: "SU" }, { name: "كفر الشيخ", isoCode: "KFS" }, { name: "الفيوم", isoCode: "FYM" },
      { name: "بني سويف", isoCode: "BNS" }, { name: "المنيا", isoCode: "MN" }, { name: "أسيوط", isoCode: "AST" },
      { name: "سوهاج", isoCode: "SHG" }, { name: "قنا", isoCode: "KN" }, { name: "أسوان", isoCode: "ASW" },
      { name: "الأقصر", isoCode: "LX" }, { name: "البحر الأحمر", isoCode: "RS" }, { name: "الوادي الجديد", isoCode: "NV" },
      { name: "مطروح", isoCode: "MT" }, { name: "شمال سيناء", isoCode: "SIN" }, { name: "جنوب سيناء", isoCode: "JS" }
    ];
  }

  if (countryId === "الأردن" || countryId === "الاردن") {
    return [
      { name: "عمان", isoCode: "AM" }, { name: "إربد", isoCode: "IR" }, { name: "الزرقاء", isoCode: "AZ" },
      { name: "المفرق", isoCode: "MA" }, { name: "عجلون", isoCode: "AJ" }, { name: "جرش", isoCode: "JA" },
      { name: "مادبا", isoCode: "MD" }, { name: "البلقاء", isoCode: "BA" }, { name: "الكرك", isoCode: "KA" },
      { name: "الطفيلة", isoCode: "TA" }, { name: "معان", isoCode: "MN" }, { name: "العقبة", isoCode: "AQ" }
    ];
  }

  if (countryId === "فلسطين") {
    return [
      { name: "القدس", isoCode: "JEM" }, { name: "غزة", isoCode: "GZA" }, { name: "رام الله والبيرة", isoCode: "RBH" },
      { name: "الخليل", isoCode: "HBN" }, { name: "نابلس", isoCode: "NBS" }, { name: "جنين", isoCode: "JEN" },
      { name: "طولكرم", isoCode: "TKM" }, { name: "قلقيلية", isoCode: "QQA" }, { name: "بيت لحم", isoCode: "BTM" },
      { name: "سلفيت", isoCode: "SLT" }, { name: "أريحا", isoCode: "JCO" }, { name: "طوباس", isoCode: "TBS" },
      { name: "شمال غزة", isoCode: "NGZ" }, { name: "دير البلح", isoCode: "DBH" }, { name: "خان يونس", isoCode: "KYS" },
      { name: "رفح", isoCode: "RFH" }
    ];
  }

  if (countryId === "سوريا") {
    return [
      { name: "دمشق", isoCode: "DI" }, { name: "حلب", isoCode: "HL" }, { name: "حمص", isoCode: "HO" },
      { name: "حماة", isoCode: "HA" }, { name: "اللاذقية", isoCode: "LA" }, { name: "دير الزور", isoCode: "DY" },
      { name: "السويداء", isoCode: "SU" }, { name: "درعا", isoCode: "DR" }, { name: "إدلب", isoCode: "ID" },
      { name: "طرطوس", isoCode: "TA" }, { name: "الرقة", isoCode: "RA" }, { name: "القنيطرة", isoCode: "QU" },
      { name: "الحسكة", isoCode: "HI" }, { name: "ريف دمشق", isoCode: "RD" }
    ];
  }

  if (countryId === "لبنان") {
    return [
      { name: "بيروت", isoCode: "BA" }, { name: "جبل لبنان", isoCode: "JL" }, { name: "الشمال", isoCode: "AS" },
      { name: "الجنوب", isoCode: "JA" }, { name: "البقاع", isoCode: "BI" }, { name: "النبطية", isoCode: "NA" },
      { name: "بعلبك الهرمل", isoCode: "BH" }, { name: "عكار", isoCode: "AK" }
    ];
  }
  
  if (countryId === "العراق") {
    return [
      { name: "بغداد", isoCode: "BG" }, { name: "البصرة", isoCode: "BA" }, { name: "نينوى", isoCode: "NI" },
      { name: "أربيل", isoCode: "AR" }, { name: "النجف", isoCode: "NA" }, { name: "كربلاء", isoCode: "KA" },
      { name: "كركوك", isoCode: "KI" }, { name: "الأنبار", isoCode: "AN" }, { name: "بابل", isoCode: "BB" },
      { name: "ديالى", isoCode: "DI" }, { name: "صلاح الدين", isoCode: "SD" }, { name: "الناصرية (ذي قار)", isoCode: "DQ" },
      { name: "السليمانية", isoCode: "SU" }, { name: "ميسان", isoCode: "MA" }, { name: "القادسية", isoCode: "QA" },
      { name: "واسط", isoCode: "WA" }, { name: "دهوك", isoCode: "DA" }, { name: "المثنى", isoCode: "MU" }
    ];
  }

  if (countryId === "المغرب") {
    return [
      { name: "الدار البيضاء سطات", isoCode: "CAS" }, { name: "الرباط سلا القنيطرة", isoCode: "RAB" }, 
      { name: "طنجة تطوان الحسيمة", isoCode: "TTA" }, { name: "مراكش آسفي", isoCode: "MAR" }, 
      { name: "فاس مكناس", isoCode: "FES" }, { name: "الشرق", isoCode: "ORI" }, 
      { name: "سوس ماسة", isoCode: "SM" }, { name: "بني ملال خنيفرة", isoCode: "BMK" }, 
      { name: "درعة تافيلالت", isoCode: "DT" }, { name: "كلميم واد نون", isoCode: "GUO" }, 
      { name: "العيون الساقية الحمراء", isoCode: "LSH" }, { name: "الداخلة وادي الذهب", isoCode: "DO" }
    ];
  }

  if (countryId === "الجزائر") {
    return [
      { name: "الجزائر", isoCode: "16" }, { name: "وهران", isoCode: "31" }, { name: "قسنطينة", isoCode: "25" },
      { name: "عنابة", isoCode: "23" }, { name: "بليدة", isoCode: "09" }, { name: "باتنة", isoCode: "05" },
      { name: "سطيف", isoCode: "19" }, { name: "تيزي وزو", isoCode: "15" }, { name: "جيجل", isoCode: "18" },
      { name: "تلمسان", isoCode: "13" }, { name: "سكيكدة", isoCode: "21" }, { name: "تيارت", isoCode: "14" },
      { name: "برج بوعريريج", isoCode: "34" }, { name: "بجاية", isoCode: "06" }, { name: "غليزان", isoCode: "48" }
    ];
  }

  if (countryId === "تونس") {
    return [
      { name: "تونس", isoCode: "11" }, { name: "أريانة", isoCode: "12" }, { name: "بن عروس", isoCode: "13" },
      { name: "منوبة", isoCode: "14" }, { name: "نابل", isoCode: "21" }, { name: "زغوان", isoCode: "22" },
      { name: "بنزرت", isoCode: "17" }, { name: "باجة", isoCode: "31" }, { name: "جندوبة", isoCode: "32" },
      { name: "الكاف", isoCode: "33" }, { name: "سليانة", isoCode: "34" }, { name: "القيروان", isoCode: "41" },
      { name: "القصرين", isoCode: "42" }, { name: "سيدي بوزيد", isoCode: "43" }, { name: "سوسة", isoCode: "51" },
      { name: "المنستير", isoCode: "52" }, { name: "المهدية", isoCode: "53" }, { name: "صفاقس", isoCode: "61" },
      { name: "قابس", isoCode: "81" }, { name: "مدنين", isoCode: "82" }, { name: "تطاوين", isoCode: "83" },
      { name: "قفصة", isoCode: "71" }, { name: "توزر", isoCode: "72" }, { name: "قبلي", isoCode: "73" }
    ];
  }

  if (countryId === "ليبيا") {
    return [
      { name: "طرابلس", isoCode: "TB" }, { name: "بنغازي", isoCode: "BA" }, { name: "مصراتة", isoCode: "MI" },
      { name: "الزاوية", isoCode: "ZA" }, { name: "سبها", isoCode: "SB" }, { name: "الخمس", isoCode: "KH" },
      { name: "درنة", isoCode: "DR" }, { name: "طبرق", isoCode: "TQ" }, { name: "غريان", isoCode: "GH" }
    ];
  }
  
  if (countryId === "السودان") {
    return [
      { name: "الخرطوم", isoCode: "KH" }, { name: "الجزيرة", isoCode: "GZ" }, { name: "البحر الأحمر", isoCode: "RS" },
      { name: "كسلا", isoCode: "KA" }, { name: "شمال كردفان", isoCode: "NK" }, { name: "القضارف", isoCode: "GD" },
      { name: "جنوب دارفور", isoCode: "SD" }, { name: "شمال دارفور", isoCode: "ND" }, { name: "نهر النيل", isoCode: "NR" }
    ];
  }

  if (countryId === "اليمن") {
    return [
      { name: "صنعاء", isoCode: "SN" }, { name: "عدن", isoCode: "AD" }, { name: "تعز", isoCode: "TA" },
      { name: "الحديدة", isoCode: "HU" }, { name: "أمانة العاصمة", isoCode: "AM" }, { name: "حضرموت", isoCode: "HD" },
      { name: "إب", isoCode: "IB" }, { name: "ذمار", isoCode: "DH" }, { name: "عمران", isoCode: "AMR" },
      { name: "مأرب", isoCode: "MA" }
    ];
  }

  // Fallback to empty array which renders a text input for the user to type in Arabic manually

  return [];
};
