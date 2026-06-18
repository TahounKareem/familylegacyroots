const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// The corrupted pattern repeats 4 times:
const brokenStr = `
                                  updateSpecificData({
                                    [key]: (order.data as any)[key],
                                    sectionStatuses: { ...(order.data.sectionStatuses || {
    setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
  }), [key]: "closed" }
                                  });`;

const correctStr = `
                                  updateSpecificData({
                                    [key]: (order.data as any)[key],
                                    sectionStatuses: { ...(order.data.sectionStatuses || {}), [key]: "closed" }
                                  });
                                  setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});`;

content = content.split(brokenStr).join(correctStr);

// There is also one for family tree maybe?
const brokenTreeStr = `
                                    updateOrderData(order.id, {
                                      "data.sectionStatuses.familyTree": "closed"
                                    });
    setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
  }`;
const correctTreeStr = `
                                    updateOrderData(order.id, {
                                      "data.sectionStatuses.familyTree": "closed"
                                    });
                                    setSuccessModal({isOpen: true, title: "تم حفظ وإغلاق القسم!", subtitle: "تم الاعتماد كنسخة نهائية لفريق البحث بنجاح.", isDone: true});
`;
// Let's check if the tree is broken just in case. It matched `if (confirm...` 
const brokenGenericStr = `}), [key]: "closed" }`;
// The first replace handles [key]
fs.writeFileSync('src/pages/Dashboard.tsx', content);

