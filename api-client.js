// js/api-client.js
import { API_URL } from "./config.js";
export async function callApi(action, payload = {}) {
    const token = sessionStorage.getItem("session_token");
    const res = await fetch(API_URL, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
            action: action,
            payload: payload,
            token: token
        })
    });
    if (!res.ok) throw new Error("Network error หรือ URL ของ GAS ไม่ถูกต้อง");
    const result = await res.json();
    if (result.error) throw new Error(result.error);
    return result;
}