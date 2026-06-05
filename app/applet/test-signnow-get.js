const SIGNNOW_API_KEY = "495ec6d39ffc100718a7b52560730e4c74ba4e02d2c28c8c4a59aedde8362176";
const SIGNNOW_TEMPLATE_ID = "c4a19bd6babc4a0fbd1913856a97f07d729848f0";

async function test() {
  try {
    const docRes = await fetch(`https://api.signnow.com/document/${SIGNNOW_TEMPLATE_ID}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${SIGNNOW_API_KEY}`
      }
    });
    console.log("Get Doc status:", docRes.status, await docRes.text());
  } catch (err) {
    console.error(err);
  }
}
test();
