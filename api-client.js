// js/api-client.js
import { CONFIG } from "./config.js";

export async function callApi(action, payload = {}) {
    const controller = new AbortController();
    const timer = setTimeout(
    () => controller.abort(),
    CONFIG.TIMEOUT_MS
);

const token = sessionStorage.getItem("session_token");
try {
    const res = await fetch(CONFIG.GAS_URL, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
    },
        body: JSON.stringify({
        action,
        payload,
        token
    }),
        signal: controller.signal
    });
    if (!res.ok) {
        throw new Error("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ");
    }
    return await res.json();
} finally {
    clearTimeout(timer);
}
}