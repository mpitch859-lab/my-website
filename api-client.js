// api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
  try {
    const token = sessionStorage.getItem("session_token");
    const body = { action, token, ...data };

    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    return await res.json();
  } catch (err) {
    return { success: false, error: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" };
  }
}
