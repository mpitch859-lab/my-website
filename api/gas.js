export default async function handler(req, res) {
const gasUrl = "https://script.google.com/macros/s/AKfycbyxqppbVZ08wseHHDFSK5RD39G21DfKEXI6kMUOI8nSKTnu5wDLiMosNbs685vvbiQ1/exec";
const qs = new URLSearchParams(req.query).toString();
const response = await fetch(`${gasUrl}?${qs}`);
const text = await response.text();
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Content-Type", "application/json");
res.status(200).send(text);
}