const fs = require('fs');

let code = fs.readFileSync('src/data/statesMapping.ts', 'utf8');

const additionalCountries = `
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
      { name: "تونس", isoCode: "11" }, { name: "صفاقس", isoCode: "61" }, { name: "سوسة", isoCode: "51" },
      { name: "بنزرت", isoCode: "17" }, { name: "نابل", isoCode: "21" }, { name: "القيروان", isoCode: "41" },
      { name: "قابس", isoCode: "81" }, { name: "المنستير", isoCode: "52" }, { name: "مدنين", isoCode: "82" },
      { name: "المهدية", isoCode: "53" }
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
`;

code = code.replace('// Fallback to empty array which renders a text input for the user to type in Arabic manually', additionalCountries);

fs.writeFileSync('src/data/statesMapping.ts', code);
