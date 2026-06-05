import fs from 'fs';

const SIGNNOW_API_KEY = "495ec6d39ffc100718a7b52560730e4c74ba4e02d2c28c8c4a59aedde8362176";
const SIGNNOW_TEMPLATE_ID = "c4a19bd6babc4a0fbd1913856a97f07d729848f0";

async function test() {
  try {
    console.log("Testing user endpoint...");
    const userRes = await fetch("https://api.signnow.com/user", {
      method: "GET",
      headers: { "Authorization": `Bearer ${SIGNNOW_API_KEY}` }
    });
    console.log("User:", await userRes.text());

    console.log("\nTesting template GET endpoint...");
    const getRes = await fetch(`https://api.signnow.com/document/${SIGNNOW_TEMPLATE_ID}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${SIGNNOW_API_KEY}` }
    });
    console.log("Doc/Template get:", getRes.status, await getRes.text());
  } catch (err) {
    console.error(err);
  }
}
test();
