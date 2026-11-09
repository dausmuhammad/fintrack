"use client";
import { useState } from "react";
import {
  Pencil,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import { categoryName } from "@/lib/categories";
import { money, dateLabel } from "@/lib/format";
import { useFinTrack } from "./providers/provider";
import { Button } from "./ui/button";
import { ResponsiveDialog } from "./ui/responsive-dialog";
import { TransactionDialog } from "./transaction-dialog";
export function EmptyState({
  title = "Belum ada transaksi",
  description = "Mulai dengan mencatat pemasukan atau pengeluaran pertamamu.",
  children,
}) {
  return (
    <div className="empty-state">
      <Wallet size={28} strokeWidth={1.5} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function TransactionList({ transactions, editable = false }) {
  const { mutate, notify } = useFinTrack();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  function remove() {
    try {
      mutate((data) => ({
        ...data,
        transactions: data.transactions.filter((t) => t.id !== deleting.id),
      }));
      setDeleting(null);
      notify("Transaksi dihapus.");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <>
      <div className="transaction-list">
        {transactions.map((t) => {
          const Icon = t.type === "income" ? ArrowDownLeft : ArrowUpRight;
          return (
            <div className="transaction-row" key={t.id}>
              <span className={`transaction-icon ${t.type}`}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <div className="transaction-description">
                <strong>{t.note || categoryName(t.categoryId)}</strong>
                <span>
                  {categoryName(t.categoryId)} <span aria-hidden="true">·</span>{" "}
                  {dateLabel(t.date)}
                </span>
              </div>
              <div className={`transaction-amount ${t.type}`}>
                <strong>
                  {t.type === "income" ? "+" : "−"}
                  {money(t.amount)}
                </strong>
                <span>{t.type === "income" ? "Pemasukan" : "Pengeluaran"}</span>
              </div>
              {editable && (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${t.note || categoryName(t.categoryId)}`}
                    onClick={() => setEditing(t)}
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Hapus ${t.note || categoryName(t.categoryId)}`}
                    onClick={() => {
                      setDeleting(t);
                      setError("");
                    }}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <TransactionDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        transaction={editing}
      />
      <ResponsiveDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Hapus transaksi?"
        description="Transaksi akan dihapus dari catatan. Saldo dan budget ikut diperbarui."
      >
        {deleting && (
          <>
            <p className="confirm-summary">
              {deleting.note || categoryName(deleting.categoryId)}
              <strong>{money(deleting.amount)}</strong>
            </p>
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
                Hapus transaksi
              </Button>
            </div>
          </>
        )}
      </ResponsiveDialog>
    </>
  );
}
