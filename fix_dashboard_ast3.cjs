const fs = require('fs');
let text = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const broken = `
                                updateSpecificData({
                                  sectionStatuses: { ...(order.data.sectionStatuses || {
    setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
  }), timeline: "closed" }
                                });`;

const correct = `
                                updateSpecificData({
                                  sectionStatuses: { ...(order.data.sectionStatuses || {}), timeline: "closed" }
                                });
                                setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});`;

text = text.split(broken).join(correct);

fs.writeFileSync('src/pages/Dashboard.tsx', text);
