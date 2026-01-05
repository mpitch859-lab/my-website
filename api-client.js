const API_URL = "https://script.google.com/macros/s/AKfycbyXXXXXXXXXXXX/exec";
export async function apiCall(action, payload = {}) {
    const res = await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ action, payload })
});
if (!res.ok) {
    throw new Error("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
}
const json = await res.json();
if (json.error) {
    throw new Error(json.error);
}
return json.data;
}