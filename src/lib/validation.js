import { categories } from "./categories";
import { localDate } from "./format";
export const MAX_AMOUNT = 999_999_999_999;
export const MAX_FILE = 5 * 1024 * 1024;
export const validAmount = (v) =>
  typeof v === "number" && Number.isSafeInteger(v) && v >= 1 && v <= MAX_AMOUNT;
export const validMonth = (v) =>
  typeof v === "string" && /^(?!0000)\d{4}-(0[1-9]|1[0-2])$/.test(v);
export function validDate(v) {
  if (
    typeof v !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(v) ||
    !validMonth(v.slice(0, 7))
  )
    return false;
  const d = new Date(`${v}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}
const record = (v) => !!v && typeof v === "object" && !Array.isArray(v);
const validId = (v) =>
  typeof v === "string" && v.trim().length > 0 && v.length <= 128;
const timestamp = (v) =>
  typeof v === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v) &&
  !Number.isNaN(Date.parse(v)) &&
  new Date(v).toISOString() === v;
export function transactionErrors(t, today = localDate()) {
  const errors = {};
  if (!validAmount(t.amount))
    errors.amount = "Isi nominal bulat antara Rp1 dan Rp999.999.999.999.";
  if (!categories.some((c) => c.id === t.categoryId && c.type === t.type))
    errors.categoryId = "Pilih kategori yang sesuai jenis transaksi.";
  if (!validDate(t.date) || t.date > today)
    errors.date = "Pilih tanggal valid sampai hari ini.";
  if (typeof t.note !== "string" || t.note.length > 200)
    errors.note = "Catatan maksimal 200 karakter.";
  return errors;
}
export function validBudget(b) {
  return (
    validId(b.id) &&
    validMonth(b.month) &&
    validAmount(b.amount) &&
    categories.some((c) => c.id === b.categoryId && c.type === "expense")
  );
}
export function validateData(input) {
  if (
    !record(input) ||
    input.schemaVersion !== 1 ||
    !Array.isArray(input.transactions) ||
    !Array.isArray(input.budgets)
  )
    throw new Error("Format backup atau versi data tidak didukung.");
  const ids = new Set();
  const transactions = input.transactions.map((v) => {
    if (
      !record(v) ||
      !validId(v.id) ||
      ids.has(v.id) ||
      !timestamp(v.createdAt) ||
      !timestamp(v.updatedAt)
    )
      throw new Error("Identitas atau waktu transaksi tidak valid/duplikat.");
    const t = v;
    if (
      Object.keys(transactionErrors(t)).length ||
      !["income", "expense"].includes(t.type)
    )
      throw new Error(
        "Data transaksi tidak valid. Periksa nominal, kategori, tanggal, dan catatan.",
      );
    ids.add(t.id);
    return {
      id: t.id,
      type: t.type,
      amount: t.amount,
      categoryId: t.categoryId,
      date: t.date,
      note: t.note,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  });
  const pairs = new Set();
  const budgets = input.budgets.map((v) => {
    if (!record(v)) throw new Error("Data budget tidak valid.");
    const b = v;
    const pair = `${b.month}:${b.categoryId}`;
    if (!validBudget(b) || ids.has(b.id) || pairs.has(pair))
      throw new Error("Budget tidak valid atau terdapat budget duplikat.");
    ids.add(b.id);
    pairs.add(pair);
    return {
      id: b.id,
      month: b.month,
      categoryId: b.categoryId,
      amount: b.amount,
    };
  });
  const absoluteTotal = transactions.reduce((total, t) => total + t.amount, 0);
  if (!Number.isSafeInteger(absoluteTotal))
    throw new Error("Jumlah nominal melampaui kapasitas perhitungan aman.");
  return { schemaVersion: 1, transactions, budgets };
}
export const parseBackup = (text) => {
  try {
    return validateData(JSON.parse(text));
  } catch (error) {
    if (error instanceof SyntaxError)
      throw new Error("File bukan JSON yang valid.");
    throw error;
  }
};
