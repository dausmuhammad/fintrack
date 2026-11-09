"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categories, categoryName } from "@/lib/categories";
import { localDate, money } from "@/lib/format";
import { validAmount } from "@/lib/validation";
import { useFinTrack } from "./providers/provider";
import { PageHeading, MonthPicker, BudgetMeter } from "./overview";
import { Button } from "./ui/button";
import { ResponsiveDialog } from "./ui/responsive-dialog";
import { EmptyState } from "./transaction-list";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { SelectField } from "./ui/select";
export function Budgets() {
  const { data, mutate, notify, loadError } = useFinTrack();
  const [month, setMonth] = useState(() => localDate().slice(0, 7));
  const [form, setForm] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const budgets = data.budgets.filter((b) => b.month === month);
  function remove() {
    try {
      mutate((d) => ({
        ...d,
        budgets: d.budgets.filter((b) => b.id !== deleting.id),
      }));
      setDeleting(null);
      notify("Budget dihapus. Transaksi tetap tersimpan.");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <>
      <PageHeading
        title="Budget bulanan"
        subtitle="Beri batas pada pengeluaran, tanpa kehilangan gambaran besarnya."
      >
        <MonthPicker month={month} onChange={setMonth} />
      </PageHeading>
      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Rencana pengeluaran</h2>
            <p className="muted">
              Satu batas untuk setiap kategori dalam sebulan.
            </p>
          </div>
          <Button disabled={!!loadError} onClick={() => setForm({})}>
            <Plus size={17} aria-hidden="true" />
            Tambah budget
          </Button>
        </div>
        {budgets.length ? (
          <div className="budget-grid">
            {budgets.map((b) => (
              <article className="budget-item" key={b.id}>
                <BudgetMeter budget={b} transactions={data.transactions} />
                <div className="budget-item-footer">
                  <span className="muted">Batas {money(b.amount)}</span>
                  <div className="actions">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit budget ${categoryName(b.categoryId)}`}
                      onClick={() => setForm(b)}
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Hapus budget ${categoryName(b.categoryId)}`}
                      onClick={() => {
                        setDeleting(b);
                        setError("");
                      }}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum ada budget bulan ini"
            description="Mulai dari kategori yang paling sering kamu belanjakan. Transaksi yang sudah ada langsung ikut dihitung."
          />
        )}
      </section>
      <ResponsiveDialog
        open={!!form}
        onOpenChange={(open) => !open && setForm(null)}
        title={form?.id ? "Edit budget" : "Tambah budget"}
        description="Tentukan batas pengeluaran kategori untuk bulan yang dipilih."
      >
        {form && (
          <BudgetForm budget={form} month={month} close={() => setForm(null)} />
        )}
      </ResponsiveDialog>
      <ResponsiveDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Hapus budget?"
        description="Batas budget ini akan dihapus. Catatan transaksi tidak berubah."
      >
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <div className="actions">
          <Button variant="outline" onClick={() => setDeleting(null)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={remove}>
            Hapus budget
          </Button>
        </div>
      </ResponsiveDialog>
    </>
  );
}
function BudgetForm({ budget, month, close }) {
  const { mutate, notify } = useFinTrack();
  const [category, setCategory] = useState(budget.categoryId ?? "");
  const [amount, setAmount] = useState(budget.amount?.toString() ?? "");
  const [error, setError] = useState("");
  function save(e) {
    e.preventDefault();
    setError("");
    const value = /^\d+$/.test(amount) ? Number(amount) : NaN;
    if (!category || !validAmount(value)) {
      setError(
        "Pilih kategori dan isi nominal bulat Rp1 sampai Rp999.999.999.999.",
      );
      return;
    }
    try {
      mutate((d) => {
        if (budget.id && !d.budgets.some((b) => b.id === budget.id))
          throw new Error("Budget sudah dihapus di tab lain.");
        if (
          d.budgets.some(
            (b) =>
              b.month === month &&
              b.categoryId === category &&
              b.id !== budget.id,
          )
        )
          throw new Error(
            "Kategori ini sudah memiliki budget pada bulan tersebut. Edit budget yang ada.",
          );
        const next = {
          id: budget.id ?? crypto.randomUUID(),
          month,
          categoryId: category,
          amount: value,
        };
        return {
          ...d,
          budgets: budget.id
            ? d.budgets.map((b) => (b.id === budget.id ? next : b))
            : [...d.budgets, next],
        };
      });
      notify("Budget tersimpan.");
      close();
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <form className="form-stack" onSubmit={save} noValidate>
      <div className="field">
        <Label htmlFor="budget-category">Kategori pengeluaran</Label>
        <SelectField
          label="Kategori pengeluaran"
          id="budget-category"
          value={category}
          onValueChange={setCategory}
          placeholder="Pilih kategori"
          options={categories
            .filter((c) => c.type === "expense")
            .map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>
      <div className="field">
        <Label htmlFor="budget-amount">Batas budget (Rp)</Label>
        <Input
          id="budget-amount"
          inputMode="numeric"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <Button type="submit">Simpan budget</Button>
    </form>
  );
}
