const fs = require('fs');

let content = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

// Replace "تم تسليم السجل للعميل (مكتمل)" with "تم تسليم السجل للعميل (مغلق)"
content = content.replace(/تم تسليم السجل للعميل \(مكتمل\)/g, "تم تسليم السجل للعميل (مغلق)");

// Replace "طلب مكتمل" with "تم الإغلاق" ? Wait, he just wants the string.
content = content.replace(/تم تسليم السجل للعميل \(مكتمل\)/g, "تم تسليم السجل للعميل (مغلق)");

const researchTableHeadRegex = /(<thead className="bg-white text-brand-500 border-b border-brand-100">\s*<tr>\s*<th className="px-4 py-4 font-medium">رقم الطلب<\/th>\s*<th className="px-4 py-4 font-medium">تاريخ الطلب<\/th>\s*<th className="px-4 py-4 font-medium">الأولوية<\/th>\s*<th className="px-4 py-4 font-medium">\s*اسم العميل والعائلة\s*<\/th>\s*<th className="px-4 py-4 font-medium">نوع السجل<\/th>\s*<th className="px-4 py-4 font-medium">\s*مرحلة التنفيذ \(الإجراء\)\s*<\/th>\s*<th className="px-4 py-4 font-medium">\s*الإجراءات التسويقية\s*<\/th>\s*<\/tr>\s*<\/thead>)/;

const newResearchTableHead = `<thead className="bg-white text-brand-500 border-b border-brand-100">
                    <tr>
                      <th className="px-4 py-4 font-medium">رقم الطلب</th>
                      <th className="px-4 py-4 font-medium">تاريخ الطلب</th>
                      <th className="px-4 py-4 font-medium">الأولوية</th>
                      <th className="px-4 py-4 font-medium">
                        اسم العميل والعائلة
                      </th>
                      <th className="px-4 py-4 font-medium">نوع السجل</th>
                      <th className="px-4 py-4 font-medium text-center text-xs">
                        المساهمة في الإثراء
                      </th>
                      <th className="px-4 py-4 font-medium">
                        مرحلة التنفيذ (الإجراء)
                      </th>
                      <th className="px-4 py-4 font-medium">
                        التفاصيل
                      </th>
                    </tr>
                  </thead>`;

content = content.replace(researchTableHeadRegex, newResearchTableHead);

// Inside Research row logic:
const researchRowTbodyRegex = /(<td className="px-4 py-4">\s*<span className="px-2 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-100">\s*\{order\.recordType \|\| "سجل أساسي"\}\s*<\/span>\s*<\/td>)/;

const p1 = content.split('      {currentTab === "research_management" &&')[1];
const p2 = p1.split('      {currentTab === "articles" && (')[0];
let researchTabContent = p2;

// Add progress cell
researchTabContent = researchTabContent.replace(/(<td className="px-4 py-4">\s*<span className="px-2 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-100">\s*\{order\.recordType \|\| "سجل أساسي"\}\s*<\/span>\s*<\/td>)/g, `$1
                            {(() => {
                              const orderCreatedDate = new Date(order.createdAt);
                              const targetDate = new Date(orderCreatedDate);
                              targetDate.setDate(targetDate.getDate() + 15);
                              const diffTime = targetDate.getTime() - new Date().getTime();
                              const remDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              const validDays = remDays > 0 ? remDays : 0;
                              
                              const closedCount = Object.values(order.data?.sectionStatuses || {}).filter(s => s === "closed").length;
                              const pct = Math.round((closedCount / 10) * 100);
                              
                              return (
                                <td className="px-4 py-4 text-center">
                                  <div className="w-24 bg-brand-100 rounded-full h-1.5 mb-1 dark:bg-brand-200 mx-auto">
                                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: \`\${pct}%\` }}></div>
                                  </div>
                                  <span className="text-[10px] font-bold text-brand-600 block">{pct}% - מتبقي {validDays} يوم</span>
                                </td>
                              )
                            })()}`);

// Replace "الإجراءات التسويقية" buttons section with the toggler and actions snippet
const marketingActionsRegex = /(<td className="px-4 py-4 flex items-center justify-end gap-2">)[\s\S]*?(<\/td>\s*<\/tr>)/g;
// Actually the previous structure ends with </tr>. We need to append the expanded row.
researchTabContent = researchTabContent.replace(/(<td className="px-4 py-4 flex items-center justify-end gap-2">)[\s\S]*?(<\/td>)\s*<\/tr>/g, `<td className="px-4 py-4 flex items-center justify-end gap-2">
                                <button
                                  onClick={() =>
                                    setExpandedRows((prev) =>
                                      prev.includes(order.id)
                                        ? prev.filter((id) => id !== order.id)
                                        : [...prev, order.id],
                                    )
                                  }
                                  className="p-1 text-brand-600 rounded bg-brand-50 hover:bg-brand-100 transition"
                                  title="التفاصيل والإجراءات"
                                >
                                 {expandedRows.includes(order.id) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronLeft className="w-4 h-4" />
                                  )}
                                </button>
                              </td>
                            </tr>
                            {expandedRows.includes(order.id) && (
                              <tr className="bg-brand-50/80 border-b border-brand-100">
                                <td colSpan={10} className="px-4 py-3">
                                  <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-brand-100 w-full">
                                    <button
                                      onClick={() => {
                                        const url = \`\${window.location.origin}/dashboard?invite=true&order_id=\${order.id}\`;
                                        navigator.clipboard.writeText(url);
                                        setCopiedId(order.id);
                                        setTimeout(() => setCopiedId(null), 2000);
                                      }}
                                      className="px-3 py-1.5 bg-brand-100 hover:bg-brand-200 text-brand-700 font-bold text-[10px] rounded flex items-center gap-1 transition"
                                      title="نسخ رابط دعوة العائلة"
                                    >
                                      {copiedId === order.id ? (
                                        <Check className="w-3 h-3 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}{" "}
                                      رابط دعوة
                                    </button>
                                    
                                    <button
                                      onClick={() => {
                                        setResearchDeliveryOrder(order);
                                      }}
                                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px] rounded flex items-center gap-1 transition"
                                    >
                                      <Upload className="w-3 h-3" /> تسليم بحث
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}`);


content = content.replace(p2, researchTabContent);

// Fix trailing string bug where I used "متبقي" (with Hebrew mem incorrectly due to OCR maybe in the prompt?)
content = content.replace(/מتبقي/g, "متبقي"); // Fix any accidentally copy pasted M

fs.writeFileSync('src/pages/AdminPanel.tsx', content);

