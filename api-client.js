// js/api-client.js
import { API_URL } from "./config.js";
async function callApi(action, payload = {}) {
const token = sessionStorage.getItem("session_token");
const params = new URLSearchParams();
params.set("action", action);
params.set("payload", JSON.stringify(payload));
if (token) params.set("token", token);
const res = await fetch(`${API_URL}?${params.toString()}`);
const data = await res.json();
if (data.error) throw new Error(data.error);
return data;
}
export { callApi };