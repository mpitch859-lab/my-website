// api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
  try {
    const token = sessionStorage.getItem("session_token");

    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify({
        action,
        token,
        ...data
      })
    });

    const result = await res.json();
    return result;

  } catch (err) {
    console.error("API ERROR:", err);
    return { success: false, error: "สมัครไม่สำเร็จ: ตรวจสอบการตั้งค่า Anyone ใน GAS" };
  }
}