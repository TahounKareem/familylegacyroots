const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto('http://localhost:3000/Team', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        const html = await page.content();
        if (html.includes('Crash Report')) {
            const errorText = await page.evaluate(() => {
                const el = document.querySelector('.bg-red-50.p-4');
                return el ? el.innerText : 'Error box not found';
            });
            console.log("EXTRACTED ERROR:");
            console.log(errorText);
        } else {
            console.log("No crash report seen. Title:", await page.title());
        }
        await browser.close();
    } catch (e) {
        console.error("Puppeteer script failed:", e);
    }
})();
