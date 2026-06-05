const SIGNNOW_API_KEY = "495ec6d39ffc100718a7b52560730e4c74ba4e02d2c28c8c4a59aedde8362176";
const SIGNNOW_TEMPLATE_ID = "c4a19bd6babc4a0fbd1913856a97f07d729848f0";

async function test() {
  try {
    const tempRes = await fetch(`https://api.signnow.com/template/${SIGNNOW_TEMPLATE_ID}/copy`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SIGNNOW_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ document_name: `Test Template` })
    });
    console.log("Temp status:", tempRes.status, await tempRes.text());

    const docRes = await fetch(`https://api.signnow.com/document/${SIGNNOW_TEMPLATE_ID}/copy`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SIGNNOW_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ document_name: `Test Document` })
    });
    console.log("Doc status:", docRes.status, await docRes.text());
  } catch (err) {
    console.error(err);
  }
}
test();
