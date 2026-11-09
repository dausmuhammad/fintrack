import { categoryName } from "./categories";
export function totals(transactions, month) {
  let balance = 0,
    income = 0,
    expense = 0;
  for (const t of transactions) {
    balance += t.type === "income" ? t.amount : -t.amount;
    if (t.date.slice(0, 7) === month) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
  }
  return { balance, income, expense };
}
export function budgetUsage(budget, transactions) {
  const spent = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        t.categoryId === budget.categoryId &&
        t.date.slice(0, 7) === budget.month,
    )
    .reduce((sum, t) => sum + t.amount, 0);
  const percent = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  return {
    spent,
    remaining: budget.amount - spent,
    percent,
    barPercent: Math.min(100, Math.max(0, percent)),
  };
}
export function filterTransactions(transactions, filters) {
  const query = filters.search?.trim().toLocaleLowerCase("id-ID") ?? "";
  return transactions
    .filter(
      (t) =>
        (!filters.month || t.date.startsWith(filters.month)) &&
        (!filters.type || t.type === filters.type) &&
        (!filters.category || t.categoryId === filters.category) &&
        `${t.note} ${categoryName(t.categoryId)}`
          .toLocaleLowerCase("id-ID")
          .includes(query),
    )
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
    );
}
