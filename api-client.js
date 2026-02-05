// api-client.js
export async function callApi(action, data = {}) {
  try {
    const token = sessionStorage.getItem("session_token");

    const res = await fetch(GAS_URL, {
      method: "POST",
      // ห้ามใส่โหมด no-cors เพราะเราต้องการอ่าน JSON กลับมา
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
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
    return { success: false, error: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" };
  }
}