// js/api-client.js
import { API_URL } from "./config.js";
export async function callApi(action, payload = {}) {
    const token = sessionStorage.getItem("session_token");
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action,
            payload,
            token
        })
    });
    const text = await res.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error("GAS ไม่ได้ส่ง JSON กลับมา");
    }
    if (data.error) throw new Error(data.error);
    return data;
}