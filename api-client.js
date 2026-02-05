// api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
  try {
    const token = sessionStorage.getItem("session_token");

    // เพิ่มการเช็คตรงนี้ ถ้า GAS_URL ไม่มีค่า ให้แจ้งเตือนทันที
    if (!GAS_URL) {
      console.error("หา GAS_URL ไม่เจอ! กรุณาเช็คไฟล์ config.js");
      return { success: false, error: "ระบบไม่ได้ตั้งค่า URL เซิร์ฟเวอร์" };
    }

    const res = await fetch(GAS_URL, {
      method: "POST",
      // ใช้ text/plain เพื่อเลี่ยงปัญหา CORS ที่คุณเจอในรูปก่อนๆ
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action,
        token,
        ...data
      })
    });

    // ตรวจสอบว่า Google ส่งข้อมูลกลับมาสำเร็จไหม
    if (!res.ok) throw new Error("Network response was not ok");

    const result = await res.json();
    return result;

  } catch (err) {
    console.error("API ERROR:", err);
    return { success: false, error: "เชื่อมต่อไม่สำเร็จ: " + err.message };
  }
}