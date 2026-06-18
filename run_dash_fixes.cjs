const fs = require('fs');
let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// For Textarea readonly conditions
dash = dash.split('readOnly={status === "closed"}').join('readOnly={status === "closed" || order?.actionPhase === "تمت المسودة"}');
dash = dash.split('status === "closed" ? "bg-gray-100 opacity-80 cursor-not-allowed"').join('(status === "closed" || order?.actionPhase === "تمت المسودة") ? "bg-gray-100 opacity-80 cursor-not-allowed"');
dash = dash.split('if (status === "closed") return;').join('if (status === "closed" || order?.actionPhase === "تمت المسودة") return;');

// Hide buttons in dynamic sections if "تمت المسودة" isn't already handled (I previously tried to handle it, but it might have failed)
// Let's replace the button rendering logic.
const btnLogicOld = `{(!order.data?.sectionStatuses || order.data.sectionStatuses[key] !== "closed") && !isPostInitialDelivery && (
                          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-brand-100">`;
const btnLogicNew = `{(!order.data?.sectionStatuses || order.data.sectionStatuses[key] !== "closed") && !isPostInitialDelivery && order?.actionPhase !== "تمت المسودة" && (
                          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-brand-100">`;
dash = dash.split(btnLogicOld).join(btnLogicNew);

// Family Tree upload
dash = dash.split('disabled={(order.data?.sectionStatuses && order.data.sectionStatuses.familyTree === "closed") || isPostInitialDelivery}').join('disabled={(order.data?.sectionStatuses && order.data.sectionStatuses.familyTree === "closed") || isPostInitialDelivery || order?.actionPhase === "تمت المسودة"}');
dash = dash.split('readOnly={(order.data?.sectionStatuses && order.data.sectionStatuses.familyTree === "closed") || isPostInitialDelivery}').join('readOnly={(order.data?.sectionStatuses && order.data.sectionStatuses.familyTree === "closed") || isPostInitialDelivery || order?.actionPhase === "تمت المسودة"}');

const archiveUploadBtnOld = `disabled={isUploading}
                                onClick={() => setPendingUpload(null)}`;
const archiveUploadBtnNew = `disabled={isUploading}
                                onClick={() => setPendingUpload(null)}`;
// Wait, I can just disable the upload input
dash = dash.split(`disabled={isUploading}`).join(`disabled={isUploading || order?.actionPhase === "تمت المسودة"}`);
// Except, there are multiple "disabled={isUploading}", so let's be careful.
// Let's just do it securely using string replacement

// For Archive Room (الخزانة) inputs
dash = dash.split(`readOnly={order.data?.sectionStatuses?.archive === "closed" || isPostInitialDelivery}`).join(`readOnly={order.data?.sectionStatuses?.archive === "closed" || isPostInitialDelivery || order?.actionPhase === "تمت المسودة"}`);
dash = dash.split(`disabled={order.data?.sectionStatuses?.archive === "closed" || isPostInitialDelivery}`).join(`disabled={order.data?.sectionStatuses?.archive === "closed" || isPostInitialDelivery || order?.actionPhase === "تمت المسودة"}`);

// Timeline (المحطات)
dash = dash.split(`disabled={order.data?.sectionStatuses?.timeline === "closed" || isPostInitialDelivery}`).join(`disabled={order.data?.sectionStatuses?.timeline === "closed" || isPostInitialDelivery || order?.actionPhase === "تمت المسودة"}`);

fs.writeFileSync('src/pages/Dashboard.tsx', dash);
console.log("Done Dash");
