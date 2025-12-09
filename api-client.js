// js/api-client.js
import { WEB_APP_URL } from "./config.js";
async function callApi(action, payload = {}) {
const token = sessionStorage.getItem("session_token");
const body = { action, payload };
if (token) body.token = token;
const res = await fetch(WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
});
const data = await res.json();
if (data.error) throw new Error(data.error);
return data;
}
export { callApi };
