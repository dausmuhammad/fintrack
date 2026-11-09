export const categories = [
  { id: "income-salary", name: "Gaji", type: "income" },
  { id: "income-freelance", name: "Freelance", type: "income" },
  { id: "income-gift", name: "Hadiah", type: "income" },
  { id: "income-other", name: "Lainnya", type: "income" },
  { id: "expense-food", name: "Makan", type: "expense" },
  { id: "expense-transport", name: "Transportasi", type: "expense" },
  { id: "expense-bills", name: "Tagihan", type: "expense" },
  { id: "expense-shopping", name: "Belanja", type: "expense" },
  { id: "expense-entertainment", name: "Hiburan", type: "expense" },
  { id: "expense-health", name: "Kesehatan", type: "expense" },
  { id: "expense-other", name: "Lainnya", type: "expense" },
];
export const categoryName = (id) =>
  categories.find((c) => c.id === id)?.name ?? id;
