const fs = require('fs');

let store = fs.readFileSync('src/lib/store.ts', 'utf8');
store = store.replace(
  `  pendingOrderData:
    typeof window !== "undefined" && localStorage.getItem("pendingOrderData")
      ? JSON.parse(localStorage.getItem("pendingOrderData")!)
      : null,`,
  `  pendingOrderData: null,`
);
store = store.replace(
  `  setPendingOrderData: (data) => {
    if (data) localStorage.setItem("pendingOrderData", JSON.stringify(data));
    else localStorage.removeItem("pendingOrderData");
    set({ pendingOrderData: data });
  },`,
  `  setPendingOrderData: (data) => {
    set({ pendingOrderData: data });
  },`
);
fs.writeFileSync('src/lib/store.ts', store);

let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Fix the array validation for closing the archive room
const oldCheck = `const files = order.data?.uploadedFiles || [];
                              if (files.length === 0) {`;
const newCheck = `const docs = order.data?.documents || [];
                              const photos = order.data?.photos || [];
                              if (docs.length === 0 && photos.length === 0) {`;
dash = dash.replace(oldCheck, newCheck);

// Fix the URL bug in confirmUpload
dash = dash.replace(`{ url: downloadURL, ...mediaMeta }`, `{ ...mediaMeta, url: downloadURL }`);

fs.writeFileSync('src/pages/Dashboard.tsx', dash);
console.log("Bug fixes applied.");
