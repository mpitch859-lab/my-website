// js/api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
    const token = sessionStorage.getItem("session_token");
    const payload = JSON.stringify({ action, token, ...data });

    try {
        const response = await fetch(GAS_URL, {
            method: "POST",
            mode: "cors", // ต้องเปิด cors
            body: payload,
            // ห้ามใส่ Header Content-Type เพื่อลดปัญหา Preflight
        });

        if (!response.ok) throw new Error("เครือข่ายขัดข้อง");
        const result = await response.json();
        
        if (!result.success) throw new Error(result.error);
        return result;
    } catch (error) {
        console.error("API Error:", error);
        alert(error.message);
        throw error;
    }
}