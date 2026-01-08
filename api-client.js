import { callApi } from "./api-client.js";

export async function initCalendar() {
    try {
        // 1. ดึงข้อมูลจาก API (จะแนบ Token ให้อัตโนมัติจาก api-client ที่เราแก้กันก่อนหน้า)
        const res = await callApi("list", {});
        const data = res.data || [];
        
        // 2. แปลงข้อมูลให้เข้ากับรูปแบบของ FullCalendar
        const events = data.map(item => ({
            id: item.id,
            // แสดงข้อความบนปฏิทิน เช่น "รายรับ: 100฿"
            title: `${item.type}: ${item.amount}฿`,
            start: item.date,
            // กำหนดสี: รายรับสีเขียว (#28a745), อื่นๆ (รายจ่าย) สีแดง (#dc3545)
            color: item.type === 'รายรับ' ? '#28a745' : '#dc3545'
        }));

        const calendarEl = document.getElementById('calendar');
        
        // 3. ตรวจสอบว่า Library โหลดมาพร้อมใช้งานหรือไม่
        if (calendarEl && typeof FullCalendar !== 'undefined') {
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                locale: 'th', // แสดงผลภาษาไทย
                events: events,
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth'
                },
                eventClick: function(info) {
                    alert(`${info.event.title}\nวันที่: ${info.event.start.toLocaleDateString('th-TH')}`);
                }
            });
            calendar.render();
        } else {
            console.error("ไม่สามารถโหลด FullCalendar ได้ หรือไม่พบ Element #calendar");
        }
    } catch (e) {
        console.error("Calendar Error:", e);
        // Error เรื่อง Session จะถูกแจ้งเตือนผ่าน api-client.js อยู่แล้ว
    }
}
