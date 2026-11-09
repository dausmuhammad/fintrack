import { describe, it, expect } from "vitest";
import {
  transactionErrors,
  validateData,
  validDate,
  validAmount,
  parseBackup,
} from "../src/lib/validation";
import {
  totals,
  budgetUsage,
  filterTransactions,
} from "../src/lib/calculations";
import { readData, writeData, clearData, DATA_KEY } from "../src/lib/storage";
import { localDate } from "../src/lib/format";
import { emptyData } from "../src/lib/data";
const transaction = (values = {}) => ({
  id: "tx-1",
  type: "income",
  amount: 5_000_000,
  categoryId: "income-salary",
  date: "2025-01-31",
  note: "",
  createdAt: "2025-01-31T00:00:00.000Z",
  updatedAt: "2025-01-31T00:00:00.000Z",
  ...values,
});
const expense = transaction({
  id: "tx-2",
  type: "expense",
  amount: 50_000,
  categoryId: "expense-food",
  note: "Makan siang",
});
const budget = {
  id: "budget-1",
  month: "2025-01",
  categoryId: "expense-food",
  amount: 100_000,
};
function memoryStorage() {
  const values = new Map();
  return {
    getItem: (k) => values.get(k) ?? null,
    setItem: (k, v) => values.set(k, v),
    removeItem: (k) => values.delete(k),
  };
}
describe("Perhitungan keuangan", () => {
  it("memisahkan saldo sepanjang waktu dan total bulan terpilih", () => {
    const rows = [
      transaction(),
      expense,
      transaction({ id: "tx-3", amount: 1_000, date: "2025-02-01" }),
    ];
    expect(totals(rows, "2025-01")).toEqual({
      balance: 4_951_000,
      income: 5_000_000,
      expense: 50_000,
    });
    expect(totals(rows, "2025-02").income).toBe(1_000);
  });
  it("budget terlampaui tidak membuat progress melebihi 100%", () => {
    expect(budgetUsage(budget, [expense])).toEqual({
      spent: 50_000,
      remaining: 50_000,
      percent: 50,
      barPercent: 50,
    });
    const result = budgetUsage(budget, [{ ...expense, amount: 150_000 }]);
    expect(result).toEqual({
      spent: 150_000,
      remaining: -50_000,
      percent: 150,
      barPercent: 100,
    });
    expect(budgetUsage({ ...budget, amount: 0 }, []).percent).toBe(0);
  });
  it("menggabungkan filter dengan AND dan mengurutkan tanggal lalu waktu", () => {
    const later = {
      ...expense,
      id: "later",
      createdAt: "2025-02-01T00:00:00.000Z",
    };
    const rows = [transaction(), expense, later];
    expect(
      filterTransactions(rows, {
        month: "2025-01",
        type: "expense",
        category: "expense-food",
        search: "MAKAN",
      }).map((t) => t.id),
    ).toEqual(["later", "tx-2"]);
    expect(filterTransactions(rows, { month: "2025-02" })).toEqual([]);
  });
  it("edit dan hapus langsung mengubah saldo dan budget", () => {
    const updated = { ...expense, amount: 150_000 };
    expect(totals([transaction(), updated], "2025-01").balance).toBe(4_850_000);
    expect(budgetUsage(budget, [updated]).remaining).toBe(-50_000);
    expect(totals([transaction()], "2025-01").balance).toBe(5_000_000);
    expect(budgetUsage(budget, []).spent).toBe(0);
  });
});
describe("Validasi kontrak runtime", () => {
  it.each([0, -1, 1.1, NaN, Infinity, 1_000_000_000_000, "5000", null])(
    "menolak nominal %s",
    (v) => expect(validAmount(v)).toBe(false),
  );
  it("menerima batas nominal sah", () => {
    expect(validAmount(1)).toBe(true);
    expect(validAmount(999_999_999_999)).toBe(true);
  });
  it("memvalidasi leap day dan tanggal tanpa konversi zona waktu", () => {
    expect(validDate("2024-02-29")).toBe(true);
    expect(validDate("2025-02-29")).toBe(false);
    expect(validDate("2025-04-31")).toBe(false);
    expect(localDate(new Date(2025, 0, 31, 23, 59))).toBe("2025-01-31");
  });
  it("menolak tanggal masa depan, kategori salah, dan catatan terlalu panjang", () => {
    expect(
      transactionErrors(
        transaction({
          date: "2025-02-01",
          categoryId: "expense-food",
          note: "a".repeat(201),
        }),
        "2025-01-31",
      ),
    ).toHaveProperty("date");
    expect(
      transactionErrors(transaction({ categoryId: "expense-food" })),
    ).toHaveProperty("categoryId");
  });
  it("menolak schema salah, ID duplikat, budget duplikat dan timestamp invalid", () => {
    expect(() => validateData({ ...emptyData(), schemaVersion: 2 })).toThrow();
    expect(() =>
      validateData({
        ...emptyData(),
        transactions: [transaction(), transaction()],
      }),
    ).toThrow();
    expect(() =>
      validateData({
        ...emptyData(),
        budgets: [budget, { ...budget, id: "b2" }],
      }),
    ).toThrow();
    expect(() =>
      validateData({
        ...emptyData(),
        transactions: [transaction({ createdAt: "2025-02-30T00:00:00.000Z" })],
      }),
    ).toThrow();
    expect(() => parseBackup("{")).toThrow("JSON");
  });
});
describe("Repository dan backup", () => {
  it("round trip backup dan reload", () => {
    const store = memoryStorage();
    const data = {
      schemaVersion: 1,
      transactions: [transaction(), expense],
      budgets: [budget],
    };
    writeData(store, data);
    expect(readData(store)).toEqual(data);
    expect(parseBackup(JSON.stringify(data))).toEqual(data);
  });
  it("impor invalid dan kuota penuh tidak mengubah data lama", () => {
    const store = memoryStorage();
    writeData(store, { ...emptyData(), transactions: [transaction()] });
    const before = store.getItem(DATA_KEY);
    expect(() =>
      writeData(store, {
        ...emptyData(),
        transactions: [transaction({ amount: -10 })],
      }),
    ).toThrow();
    expect(store.getItem(DATA_KEY)).toBe(before);
    const blocked = {
      ...store,
      setItem() {
        throw new Error("QuotaExceeded");
      },
    };
    expect(() => writeData(blocked, emptyData())).toThrow("QuotaExceeded");
    expect(readData(store).transactions).toHaveLength(1);
  });
  it("JSON rusak tidak ditimpa saat dibaca", () => {
    const store = memoryStorage();
    store.setItem(DATA_KEY, "{broken");
    expect(() => readData(store)).toThrow();
    expect(store.getItem(DATA_KEY)).toBe("{broken");
  });
  it("reset hanya menghapus data FinTrack", () => {
    const store = memoryStorage();
    store.setItem("unrelated", "keep");
    writeData(store, emptyData());
    clearData(store);
    expect(store.getItem(DATA_KEY)).toBeNull();
    expect(store.getItem("unrelated")).toBe("keep");
  });
});
