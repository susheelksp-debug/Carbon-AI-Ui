export default function formatDate(date, format) {
  const d = new Date(date);

  let hours = d.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 → 12

  const map = {
    DD: String(d.getDate()).padStart(2, "0"),
    MM: String(d.getMonth() + 1).padStart(2, "0"),
    YYYY: d.getFullYear(),

    HH: String(hours).padStart(2, "0"),  // 12-hour format
    H: hours,

    mm: String(d.getMinutes()).padStart(2, "0"),
    ss: String(d.getSeconds()).padStart(2, "0"),

    A: ampm, // AM or PM
  };

  return format.replace(/YYYY|MM|DD|HH|H|mm|ss|A/g, m => map[m]);
}
