const fs = require('fs');
let code = fs.readFileSync('src/pages/OrderFlow.tsx', 'utf8');

code = code.replace(
  `      // We redirect directly to Stripe Payment Links with client_reference_id
      if (useTestLink) {
        window.location.href = "https://buy.stripe.com/14AcN6bfb9K13nY7pr8so05";
        return;
      }`,
  `      // We redirect directly to Stripe Payment Links with client_reference_id
      if (useTestLink) {
        const url = "https://buy.stripe.com/14AcN6bfb9K13nY7pr8so05";
        const newWin = window.open(url, '_blank');
        if (!newWin) window.location.href = url;
        return;
      }`
);

code = code.replace(
  `      if (session.url) {
        window.location.href = session.url;
      } else {`,
  `      if (session.url) {
        // Use window.open to prevent X-Frame-Options blocking in iframes
        const newWin = window.open(session.url, '_blank');
        if (!newWin) {
          // Fallback if popup blocker is active
          window.location.href = session.url;
        }
      } else {`
);

fs.writeFileSync('src/pages/OrderFlow.tsx', code);
