const fs = require('fs');
let text = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const broken2 = `
                                updateSpecificData({
                                  sectionStatuses: { ...(order.data.sectionStatuses || {
    setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
  }), familyTree: "closed" }
                                });`;

const correct2 = `
                                updateSpecificData({
                                  sectionStatuses: { ...(order.data.sectionStatuses || {}), familyTree: "closed" }
                                });
                                setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});`;

text = text.split(broken2).join(correct2);

// Check for archive
const broken3 = `
                                updateSpecificData({
                                  sectionStatuses: { ...(order.data.sectionStatuses || {
    setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
  }), archive: "closed" }
                                });`;

const correct3 = `
                                updateSpecificData({
                                  sectionStatuses: { ...(order.data.sectionStatuses || {}), archive: "closed" }
                                });
                                setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});`;

text = text.split(broken3).join(correct3);

fs.writeFileSync('src/pages/Dashboard.tsx', text);
