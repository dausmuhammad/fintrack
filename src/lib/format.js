export const money = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
export const localDate = (now = new Date()) =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
export const dateLabel = (value) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
export const monthLabel = (value) =>
  new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(
    new Date(`${value}-01T12:00:00`),
  );
