// js/api-client.js
import { API_URL } from "./config.js";
async function call(action, payload = {}) {
    const res = await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ action, payload })
});
if (!res.ok) throw new Error("Network error");
return await res.json();
}