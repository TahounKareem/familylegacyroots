const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const sBlock = `                          <div className="flex flex-col md:flex-row gap-4 mb-2 border-t border-brand-100/50 pt-4">
                            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-brand-100 flex-1 flex flex-col gap-1">
                              <span className="text-xs font-bold text-brand-400">البريد الإلكتروني</span>
                              <span className="text-sm font-mono text-brand-800 break-all">{currentUser.email}</span>
                            </div>
                            
                            {order && (
                              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-brand-100 flex-1 flex flex-col gap-1">
                                <span className="text-xs font-bold text-brand-400">رقم الطلب</span>
                                <span className="text-sm font-mono text-brand-800 break-all">#{order.orderNumber || order.id.toUpperCase()}</span>
                              </div>
                            )}
                          </div>`;

const newBlock = `                          <div className="flex flex-col md:flex-row gap-4 mb-2 border-t border-brand-100/50 pt-4">
                            {order && (
                              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-brand-100 flex-1 flex flex-col gap-1">
                                <span className="text-xs font-bold text-brand-400">رقم الطلب</span>
                                <span className="text-sm font-mono text-brand-800 break-all">#{order.orderNumber || order.id.toUpperCase()}</span>
                              </div>
                            )}
                          </div>`;

content = content.replace(sBlock, newBlock);

fs.writeFileSync('src/pages/Dashboard.tsx', content);

