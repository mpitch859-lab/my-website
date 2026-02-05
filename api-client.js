// api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
  try {
    const token = sessionStorage.getItem("session_token");

    const res = await fetch(GAS_URL, {
      method: "POST",
      mode: "cors", // ต้องใส่ cors เพื่อให้ Browser ยอมรับ JSON
      headers: {
        "Content-Type": "text/plain" // ใช้ text/plain เพื่อเลี่ยง Preflight ของ GAS
      },
      body: JSON.stringify({
        action,
        token,
        ...data
      })
    });

    const result = await res.json();
    return result; // ส่งผลลัพธ์กลับไป (จะมี success และ data/error)

  } catch (err) {
    console.error("API ERROR:", err);
    return { success: false, error: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" };
  }
}