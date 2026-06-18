const fs = require('fs');

let admin = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

const target1 = \`                                          onClick={() => {
                                            setDeliveryTab("final");
                                            setDeliveryOrder(order);
                                            setDigitalCopyLink(order.designLinks?.recordLink || "");
                                            setDigitalCopyDownloadLink(order.designLinks?.downloadLink || "");
                                            setDeliveryLink(order.designLinks?.recordLink || "");
                                            setPosterLink(order.designLinks?.treeLink || "");
                                          }}\`;

const rep1 = \`                                          onClick={() => {
                                            setDeliveryTab("final");
                                            setDeliveryOrder(order);
                                            setDigitalCopyLink(order.designLinks?.recordLink || "");
                                            setDigitalCopyDownloadLink(order.designLinks?.downloadLink || "");
                                            setDeliveryLink(order.designLinks?.recordLink || "");
                                            setPosterLink(order.designLinks?.treeLink || "");
                                            setShippingDate(order.designLinks?.shippingDate || "");
                                            setCarrierName(order.designLinks?.carrierName || "");
                                            setTrackingNumber(order.designLinks?.trackingNumber || "");
                                          }}\`;

const target2 = \`                  <div>
                    <label className="block font-semibold text-brand-900 mb-2">
                      التوصيات واقتراحات فريق البحث
                    </label>
                    <textarea
                      value={researchRecommendations}
                      onChange={(e) => setResearchRecommendations(e.target.value)}
                      placeholder="أكتب التوصيات..."
                      className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[100px]"
                    />
                  </div>

                  {deliveryTab === "final" && (
                    <div className="flex flex-col gap-4 mt-6 bg-amber-50 p-4 rounded-xl border border-amber-200">
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
                  )}

                </>\`;

const rep2 = \`                  {deliveryTab === "final" && (
                    <div className="flex flex-col gap-4 mt-6 bg-amber-50 p-4 rounded-xl border border-amber-200">
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
                  )}

                  <div>
                    <label className="block font-semibold text-brand-900 mb-2 mt-6">
                      التوصيات واقتراحات فريق البحث
                    </label>
                    <textarea
                      value={researchRecommendations}
                      onChange={(e) => setResearchRecommendations(e.target.value)}
                      placeholder="أكتب التوصيات..."
                      className="w-full border border-brand-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[100px]"
                    />
                  </div>

                </>\`;

admin = admin.replace(target1, rep1);
admin = admin.replace(target2, rep2);

fs.writeFileSync('src/pages/AdminPanel.tsx', admin);
console.log("Fixed Delivery Fields");
