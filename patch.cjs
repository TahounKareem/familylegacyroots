const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
code = code.replace(
  'if (success === "true" && orderId) {',
  `if (success === "true") {
      let targetOrder = null;
      if (orderId) {
        targetOrder = orders.find((o) => o.id === orderId);
      } else {
        const unpaidOrders = orders.filter((o) => o.status === "بانتظار الدفع" || o.status === "بإنتظار إتمام الدفع");
        if (unpaidOrders.length > 0) targetOrder = unpaidOrders[0];
      }
      const order = targetOrder;
      const effectiveOrderId = order ? order.id : orderId;
      if (order && effectiveOrderId) {`
);
code = code.replace(/updateOrderStatus\(orderId,/g, 'updateOrderStatus(effectiveOrderId,');
code = code.replace(/fulfillOrder\(orderId,/g, 'fulfillOrder(effectiveOrderId,');
code = code.replace(/order\.orderNumber \|\| orderId/g, 'order.orderNumber || effectiveOrderId');
fs.writeFileSync('src/pages/Dashboard.tsx', code);
