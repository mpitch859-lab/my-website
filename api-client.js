// js/api-client.js
import { GAS_URL } from "./config.js";
export async function callApi(action, data = {}) {
    try {
        const response = await fetch(GAS_URL, {
            method: "POST",
            // ห้ามใส่ headers: { 'Content-Type': 'application/json' }
            body: JSON.stringify({ action, ...data })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.error);
        return result;
    } catch (error) {
        console.error("API Error:", error);
        alert("เกิดข้อผิดพลาด: " + error.message);
        throw error;
    }
}