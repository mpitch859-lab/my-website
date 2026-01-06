// js/api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
    const token = sessionStorage.getItem("session_token");
    const payload = {
        action,
        token, // แนบ token ไปด้วยเสมอ
        ...data
    };

    try {
        const response = await fetch(GAS_URL, {
            method: "POST",
            mode: "cors",
            // ไม่ใส่ headers Content-Type เพื่อเลี่ยง Preflight (OPTIONS) ที่จุกจิก
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
        }
        
        return result; // คืนค่า { success: true, data: ... }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("การเชื่อมต่อผิดพลาด: " + error.message);
        throw error;
    }
}