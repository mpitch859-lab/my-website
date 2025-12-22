// js/api-client.js
import { API_URL } from "./config.js";
export async function callApi(action, payload = {}) {
    // ดึง token จาก sessionStorage มาส่งไปด้วยทุกครั้ง
    const token = sessionStorage.getItem("session_token");
    const res = await fetch(API_URL, {
        method: "POST",
        // ใช้ text/plain เพื่อเลี่ยงการติด CORS Preflight ในบางกรณีของ GAS
        headers: {
            "Content-Type": "text/plain;charset=utf-8" 
        },
        // ส่งโครงสร้าง JSON ตามที่ Server รอรับ (action, payload, token)
        body: JSON.stringify({ action, payload, token })
    });
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    
    // ถ้า server ส่ง error กลับมาใน JSON ให้ throw ออกไป
    if (data.error) throw new Error(data.error); 
    
    return data;
}