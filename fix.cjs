const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
code = code.replace(
  `      const effectiveOrderId = order ? order.id : orderId;
      if (order && effectiveOrderId) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {`,
  `      const effectiveOrderId = order ? order.id : orderId;
      if (order && effectiveOrderId) {`
);
fs.writeFileSync('src/pages/Dashboard.tsx', code);
