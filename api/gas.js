export default async function handler(req, res) {
const gasUrl = "https://script.google.com/macros/s/AKfycbyRRHBA-1WMtQ2swFcwW3MQ_RLVYJFd58XkOoRrS2tAu8SbKMMb-cqmuWeLRtdbXa_M/exec";
const qs = new URLSearchParams(req.query).toString();
const response = await fetch(`${gasUrl}?${qs}`);
const text = await response.text();
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Content-Type", "application/json");
res.status(200).send(text);
}