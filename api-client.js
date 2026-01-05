// js/api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
    const token = sessionStorage.getItem("session_token");
    const res = await fetch(GAS_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        action,
        token,
        ...data,
    }),
});
return await res.json();
}
