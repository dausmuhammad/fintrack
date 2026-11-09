"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";
import { useFinTrack } from "./providers/provider";
import { totals, filterTransactions, budgetUsage } from "@/lib/calculations";
import { localDate, monthLabel, money } from "@/lib/format";
import { categories, categoryName } from "@/lib/categories";
import { Button } from "./ui/button";
import { EmptyState, TransactionList } from "./transaction-list";
import { TransactionDialog } from "./transaction-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { SelectField } from "./ui/select";
import { MonthPickerControl } from "./ui/date-picker";
export function MonthPicker({ month, onChange }) {
  return (
    <div className="month-picker">
      <Label htmlFor="period">Periode</Label>
      <MonthPickerControl id="period" value={month} onValueChange={onChange} />
    </div>
  );
}
export function PageHeading({ title, subtitle, children }) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
export function BudgetMeter({ budget, transactions }) {
  const usage = budgetUsage(budget, transactions);
  return (
    <div className="budget-meter">
      <div className="budget-label">
        <strong>{categoryName(budget.categoryId)}</strong>
        <span className={usage.percent > 100 ? "expense" : "muted"}>
          {Math.round(usage.percent)}% terpakai
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`Budget ${categoryName(budget.categoryId)}`}
        aria-valuenow={Math.round(usage.barPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${Math.round(usage.percent)} persen terpakai`}
        className={`progress-track ${usage.percent > 100 ? "over-budget" : ""}`}
      >
        <div style={{ width: `${usage.barPercent}%` }} />
      </div>
      <div className="budget-detail">
        <span>
          {money(usage.spent)}{" "}
          <span className="muted">/ {money(budget.amount)}</span>
        </span>
        <span className={usage.remaining < 0 ? "expense" : "muted"}>
          {usage.remaining < 0
            ? `Budget terlampaui · Sisa ${money(usage.remaining)}`
            : `Sisa ${money(usage.remaining)}`}
        </span>
      </div>
    </div>
  );
}
export function Dashboard() {
  const { data, loadError } = useFinTrack();
  const [month, setMonth] = useState(() => localDate().slice(0, 7));
  const [adding, setAdding] = useState(false);
  const summary = totals(data.transactions, month);
  const recent = filterTransactions(data.transactions, { month }).slice(0, 5);
  const budgets = data.budgets.filter((b) => b.month === month);
  return (
    <>
      <PageHeading
        title="Ringkasan keuangan"
        subtitle="Lihat posisi uangmu, lalu tentukan langkah berikutnya."
      >
        <MonthPicker month={month} onChange={setMonth} />
      </PageHeading>
      <div className="summary-grid">
        <section className="summary-card balance-card">
          <span className="metric-label">Saldo saat ini</span>
          <strong className="balance-value">{money(summary.balance)}</strong>
          <span className="muted">Seluruh catatan, sepanjang waktu</span>
        </section>
        <section className="summary-card income-card">
          <span className="metric-label">
            <ArrowDownLeft size={18} className="income" aria-hidden="true" />
            Pemasukan
          </span>
          <strong className="metric-value income">
            +{money(summary.income)}
          </strong>
          <span className="muted">{monthLabel(month)}</span>
        </section>
        <section className="summary-card expense-card">
          <span className="metric-label">
            <ArrowUpRight size={18} className="expense" aria-hidden="true" />
            Pengeluaran
          </span>
          <strong className="metric-value expense">
            −{money(summary.expense)}
          </strong>
          <span className="muted">{monthLabel(month)}</span>
        </section>
      </div>
      <div className="dashboard-columns">
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Transaksi terbaru</h2>
              <p className="muted">{monthLabel(month)}</p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/transaksi">Lihat semua</Link>
            </Button>
          </div>
          {recent.length ? (
            <TransactionList transactions={recent} />
          ) : (
            <EmptyState
              description={
                data.transactions.length
                  ? "Tidak ada transaksi pada periode ini. Pilih bulan lain atau catat transaksi."
                  : undefined
              }
            >
              <Button
                variant="outline"
                disabled={!!loadError}
                onClick={() => setAdding(true)}
              >
                <Plus size={16} aria-hidden="true" />
                Tambah transaksi pertama
              </Button>
            </EmptyState>
          )}
        </section>
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Budget bulanan</h2>
              <p className="muted">Jaga pengeluaran sesuai rencana.</p>
            </div>
          </div>
          {budgets.length ? (
            <div className="budget-preview">
              {budgets.map((b) => (
                <BudgetMeter
                  key={b.id}
                  budget={b}
                  transactions={data.transactions}
                />
              ))}
            </div>
          ) : (
            <div className="budget-empty">
              <p>
                Belum ada batas pengeluaran untuk{" "}
                {monthLabel(month).toLowerCase()}.
              </p>
              <p className="muted">
                Tentukan budget per kategori untuk melihat sisa pengeluaranmu.
              </p>
            </div>
          )}
          <Button asChild variant="outline" className="budget-link">
            <Link href="/budget">Atur budget</Link>
          </Button>
        </section>
      </div>
      <TransactionDialog open={adding} onOpenChange={setAdding} />
    </>
  );
}
export function Transactions() {
  const { data, loadError } = useFinTrack();
  const [month, setMonth] = useState(() => localDate().slice(0, 7));
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const rows = filterTransactions(data.transactions, {
    month,
    type,
    category,
    search,
  });
  return (
    <>
      <PageHeading
        title="Transaksi"
        subtitle="Setiap uang masuk dan keluar, dalam satu catatan."
      >
        <MonthPicker month={month} onChange={setMonth} />
      </PageHeading>
      <section className="panel">
        <div className="filters">
          <div className="field search-field">
            <Label htmlFor="search">Cari transaksi</Label>
            <Input
              id="search"
              type="search"
              placeholder="Cari catatan atau kategori"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="field">
            <Label htmlFor="filter-type">Jenis</Label>
            <SelectField
              label="Pilih jenis transaksi"
              id="filter-type"
              value={type || "all"}
              onValueChange={(value) => {
                setType(value === "all" ? "" : value);
                setCategory("");
              }}
              options={[
                { value: "all", label: "Semua jenis" },
                { value: "income", label: "Pemasukan" },
                { value: "expense", label: "Pengeluaran" },
              ]}
            />
          </div>
          <div className="field">
            <Label htmlFor="filter-category">Kategori</Label>
            <SelectField
              label="Pilih kategori transaksi"
              id="filter-category"
              value={category || "all"}
              onValueChange={(value) =>
                setCategory(value === "all" ? "" : value)
              }
              options={[
                { value: "all", label: "Semua kategori" },
                ...categoriesForFilter(type).map((c) => ({
                  value: c.id,
                  label:
                    c.name +
                    (!type
                      ? ` (${c.type === "income" ? "masuk" : "keluar"})`
                      : ""),
                })),
              ]}
            />
          </div>
        </div>
        <div className="list-caption">
          <span>
            {rows.length} transaksi · {monthLabel(month)}
          </span>
          {(type || category || search) && (
            <Button
              variant="ghost"
              onClick={() => {
                setType("");
                setCategory("");
                setSearch("");
              }}
            >
              Bersihkan filter
            </Button>
          )}
        </div>
        {rows.length ? (
          <TransactionList transactions={rows} editable />
        ) : (
          <EmptyState
            title={
              data.transactions.length
                ? "Tidak ada transaksi yang cocok"
                : "Belum ada transaksi"
            }
            description={
              data.transactions.length
                ? "Ubah periode atau filter untuk menemukan catatanmu."
                : undefined
            }
          >
            {!data.transactions.length && (
              <Button
                variant="outline"
                disabled={!!loadError}
                onClick={() => setAdding(true)}
              >
                Tambah transaksi pertama
              </Button>
            )}
          </EmptyState>
        )}
      </section>
      <TransactionDialog open={adding} onOpenChange={setAdding} />
    </>
  );
}
function categoriesForFilter(type) {
  return categories.filter((c) => !type || c.type === type);
}
