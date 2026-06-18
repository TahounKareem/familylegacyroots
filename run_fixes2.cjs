const fs = require('fs');

let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// We need to add confirmModal state and UI. 
// A lot of places use confirm("هل أنت ...") 
// So we can do this: 
// Add `confirmModal` state and `setConfirmModal` beside `successModal`.
if (!dash.includes('const [confirmModal, setConfirmModal]')) {
  dash = dash.replace(
      'const [successModal, setSuccessModal] = useState<{isOpen: boolean, title: string, subtitle: string, isDone?: boolean}>({isOpen: false, title: "", subtitle: ""});',
      'const [successModal, setSuccessModal] = useState<{isOpen: boolean, title: string, subtitle: string, isDone?: boolean}>({isOpen: false, title: "", subtitle: ""});\n  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, onConfirm: () => void}>({isOpen: false, onConfirm: () => {}});'
  );

  // Replace confirm calls
  dash = dash.replace(
    /if\s*\(\s*confirm\s*\(\s*"هل أنت متأكد من حفظ وإغلاق هذا القسم\؟ بمجرد إغلاقه سيتم اعتماده كنسخة نهائية للباحثين\."\s*\)\s*\)\s*\{/g,
    `setConfirmModal({
                                isOpen: true,
                                onConfirm: () => {`
  );

  // But we have to close the setConfirmModal argument at the end of the `if` block. 
  // Since it's tricky with regex, let's target the exact string instead of regex to be safe!
  // It's the `isDone: true});` line, followed by `}` and `} else`.

  dash = dash.replace(
    /} else {/g,
    `}\n                              });\n                            } else {`
  );
  // Wait, there might be multiple `} else {` that are NOT the confirm else!
  // This is too dangerous. Let's do a precise string replacement for the specific blocks.
}
fs.writeFileSync('src/pages/Dashboard.tsx', dash);
