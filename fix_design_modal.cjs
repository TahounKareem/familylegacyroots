const fs = require('fs');

let admin = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

// The chunk we want to replace
const oldShipping = `{designSubmitOrder.printRequested && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mt-4 space-y-4 text-right">
                  <h4 className="font-bold text-amber-900 mb-2 border-b border-amber-200 pb-2">بيانات الشحنة</h4>
                  <div>
                    <label className="block font-semibold text-brand-900 mb-1 text-sm bg-transparent">تاريخ الشحن</label>
                    <input type="date" value={shippingDate} onChange={(e) => setShippingDate(e.target.value)} className="w-full border border-brand-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-semibold text-brand-900 mb-1 text-sm bg-transparent">إسم الناقل</label>
                    <input type="text" value={carrierName} onChange={(e) => setCarrierName(e.target.value)} className="w-full border border-brand-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none" placeholder="مثال: أرامكس, DHL..." />
                  </div>
                  <div>
                    <label className="block font-semibold text-brand-900 mb-1 text-sm bg-transparent">رقم الشحنة للتتبع</label>
                    <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="w-full border border-brand-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none" placeholder="أدخل رقم التتبع" />
                  </div>
                </div>
              )}`;

const newShipping = `<div className="flex flex-col gap-4 mt-6 bg-amber-50 p-4 rounded-xl border border-amber-200 text-right">
                <div className="font-bold text-lg text-brand-900 border-b border-brand-200 pb-2">بيانات الشحنة</div>
                <div>
                  <label className="block text-sm font-semibold text-brand-900 mb-2">تاريخ الشحن</label>
                  <input type="date" value={shippingDate} onChange={(e) => setShippingDate(e.target.value)} className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-900 mb-2">إسم الناقل</label>
                  <input type="text" value={carrierName} onChange={(e) => setCarrierName(e.target.value)} placeholder="أدخل اسم شركة الشحن..." className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-900 mb-2">رقم الشحنة للتتبع</label>
                  <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="أدخل رقم التتبع..." className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
              </div>`;

if (admin.includes(oldShipping)) {
    admin = admin.replace(oldShipping, newShipping);
    console.log("Successfully replaced shipping layout in design modal.");
} else {
    console.log("Could not find the shipping block layout exactly. Need to investigate.");
}

const oldButtonCond = `onClick={handleDesignSubmit}
                disabled={isFulfilling || !designRecordLink.trim() || (designSubmitOrder.printRequested && (!shippingDate || !carrierName || !trackingNumber))}`;

const newButtonCond = `onClick={handleDesignSubmit}
                disabled={isFulfilling || !designRecordLink.trim()}`;

if (admin.includes(oldButtonCond)) {
    admin = admin.replace(oldButtonCond, newButtonCond);
}

// In handleDesignSubmit, we should also save the shipping info
const oldHandleDesignSubmitSave = `downloadLink: designDownloadLink,
          treeLink: designTreeLink,
          copiesShipped: designCopiesShipped`;
const newHandleDesignSubmitSave = `downloadLink: designDownloadLink,
          treeLink: designTreeLink,
          copiesShipped: !!trackingNumber,
          shippingDate,
          carrierName,
          trackingNumber`;

if (admin.includes(oldHandleDesignSubmitSave)) {
    admin = admin.replace(oldHandleDesignSubmitSave, newHandleDesignSubmitSave);
}

fs.writeFileSync('src/pages/AdminPanel.tsx', admin);
