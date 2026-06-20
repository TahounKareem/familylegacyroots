const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/pages/AdminPanel.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// I will extract the deliveryModal contents and replace it.
const modalStartRegex = /\{deliveryOrder && \([\s\S]*?<!-- Delivery Modal end marker if it existed -->/; // I'll just match between strings

// Let's replace the whole {deliveryOrder && ( ... )} block carefully
// Actually, I'll just write it manually using a very specific replace

let newFormHtml = `
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
              <div>
                <label className="block font-semibold text-brand-900 mb-2">
                  {deliveryTab === "draft" ? "رابط عرض النسخة الأولية للتصفح (Flipbook)" : "رابط النسخة الرقمية للسجل للتصفح"}
                </label>
                <input
                  type="url"
                  value={digitalCopyLink}
                  onChange={(e) => {
                    setDigitalCopyLink(e.target.value);
                    setDeliveryLink(e.target.value);
                  }}
                  placeholder="https://..."
                  dir="ltr"
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white text-left focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              
              {deliveryTab !== "draft" && (
                <>
                  <div className="flex flex-col gap-4 bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <div className="font-bold text-lg text-brand-900 border-b border-brand-200 pb-2">بيانات الشحنة (تظهر للعميل بعد التسليم)</div>
                    <div>
                      <label className="block text-sm font-semibold text-brand-900 mb-2">تاريخ الشحن</label>
                      <input
                        type="date"
                        value={shippingDate}
                        onChange={(e) => setShippingDate(e.target.value)}
                        className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-brand-900 mb-2">إسم الناقل</label>
                      <input
                        type="text"
                        value={carrierName}
                        onChange={(e) => setCarrierName(e.target.value)}
                        placeholder="أدخل اسم شركة الشحن..."
                        className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-brand-900 mb-2">رقم الشحنة للتتبع</label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="أدخل رقم التتبع..."
                        className="w-full mx-auto border border-brand-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-brand-900 mb-2 mt-2">
                       رابط النسخة الرقمية للسجل للتحميل
                    </label>
                    <input
                      type="url"
                      value={digitalCopyDownloadLink}
                      onChange={(e) => setDigitalCopyDownloadLink(e.target.value)}
                      placeholder="https://..."
                      dir="ltr"
                      className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white text-left focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-brand-900 mb-2">
                      رابط بوستر المشجرة
                    </label>
                    <input
                      type="url"
                      value={posterLink}
                      onChange={(e) => setPosterLink(e.target.value)}
                      placeholder="https://..."
                      dir="ltr"
                      className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white text-left focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-brand-900 mb-2 mt-4">
                  التوصيات واقتراحات فريق البحث
                </label>
                <textarea
                  value={researchRecommendations}
                  onChange={(e) => setResearchRecommendations(e.target.value)}
                  placeholder="أدخل التوصيات إن وجدت..."
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white min-h-[100px] focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>`;

// We will find the div with class "flex flex-col gap-4 overflow-y-auto pr-2 pb-4" right before <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-brand-100">
let startIndex = content.indexOf('<div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">');
let endIndex = content.indexOf('<div className="mt-6 flex justify-end gap-3 pt-4 border-t border-brand-100">', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newFormHtml + '\n            ' + content.substring(endIndex);
  fs.writeFileSync(filePath, content);
  console.log("AdminPanel delivery form reordered.");
} else {
  console.log("Could not find the delivery form boundaries.");
}
