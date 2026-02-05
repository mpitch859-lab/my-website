// api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
    try {
        const token = sessionStorage.getItem("session_token");
        const bodyData = { action, token, ...data };

        // ส่งแบบ text/plain เพื่อเลี่ยง CORS Preflight (OPTIONS) 100%
        // แต่ฝั่ง GAS จะใช้ JSON.parse อ่านข้อมูลได้ปกติ
        const response = await fetch(GAS_URL, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(bodyData)
        });

        // ตรวจสอบว่ามีข้อมูลตอบกลับมาไหม
        const resultText = await response.text();
        if (!resultText) throw new Error("ไม่มีการตอบกลับจากเซิร์ฟเวอร์");
        
        const result = JSON.parse(resultText);

        // จัดการกรณี Session หมดอายุ
        if (!result.success && result.error?.includes("Session expired")) {
            if (!window.location.pathname.includes("login.html")) {
                alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
                sessionStorage.clear();
                window.location.href = "login.html";
            }
            return result;
        }

        if (!result.success) throw new Error(result.error);
        return result;

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}