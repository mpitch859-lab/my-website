// js/calendar.js
import { callApi, showNotify } from "./api-client.js";
async function initCalendar() {
try {
    const res = await callApi("list", {});
    const data = res.data || [];
    const events = data.map(item => ({
    id: item.id,
    title: `${item.type === 'income' ? 'รายรับ' : 'รายจ่าย'}: ${item.amount}฿`,
    start: item.date,
    color: item.type === 'income' ? 'green' : 'red'
    }));
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events,
    eventClick: function(info) {
        showNotify(info.event.title, `วันที่: ${info.event.start.toISOString().slice(0,10)}`, 'info');
    }
    });
    calendar.render();
} catch (e) { console.error(e); alert(e.message); }
}
if (window.location.pathname.split("/").pop() === "calendar.html") {
window.addEventListener("DOMContentLoaded", initCalendar);
}
