"use client";
import { useState } from "react";
import { categories } from "@/lib/categories";
import { localDate } from "@/lib/format";
import { transactionErrors } from "@/lib/validation";
import { useFinTrack } from "./providers/provider";
import { ResponsiveDialog } from "./ui/responsive-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { SelectField } from "./ui/select";
import { DatePicker } from "./ui/date-picker";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
export function TransactionDialog({ open, onOpenChange, transaction }) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={transaction ? "Edit transaksi" : "Tambah transaksi"}
      description="Catat uang masuk atau keluar. Semua nominal dalam rupiah."
    >
      {open && (
        <TransactionForm
          key={transaction?.id ?? "new"}
          transaction={transaction}
          close={() => onOpenChange(false)}
        />
      )}
    </ResponsiveDialog>
  );
}
function TransactionForm({ transaction, close }) {
  const { mutate, notify } = useFinTrack();
  const [type, setType] = useState(transaction?.type ?? "expense");
  const [amount, setAmount] = useState(transaction?.amount?.toString() ?? "");
  const [categoryId, setCategory] = useState(transaction?.categoryId ?? "");
  const [date, setDate] = useState(transaction?.date ?? localDate());
  const [note, setNote] = useState(transaction?.note ?? "");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  function save(event) {
    event.preventDefault();
    setError("");
    const next = {
      type,
      amount: /^\d+$/.test(amount) ? Number(amount) : NaN,
      categoryId,
      date,
      note: note.trim(),
    };
    const invalid = transactionErrors(next);
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      document.getElementById(`tx-${Object.keys(invalid)[0]}`)?.focus();
      return;
    }
    try {
      const now = new Date().toISOString();
      mutate((data) => {
        if (
          transaction &&
          !data.transactions.some((t) => t.id === transaction.id)
        )
          throw new Error(
            "Transaksi ini sudah dihapus di tab lain. Muat ulang daftar.",
          );
        const value = {
          ...next,
          id: transaction?.id ?? crypto.randomUUID(),
          createdAt: transaction?.createdAt ?? now,
          updatedAt: now,
        };
        return {
          ...data,
          transactions: transaction
            ? data.transactions.map((t) =>
                t.id === transaction.id ? value : t,
              )
            : [...data.transactions, value],
        };
      });
      notify(
        transaction ? "Perubahan transaksi tersimpan." : "Transaksi tersimpan.",
      );
      close();
    } catch (err) {
      setError(err.message);
    }
  }
  const fieldError = (key) =>
    errors[key] ? (
      <span className="field-error" id={`tx-${key}-error`}>
        {errors[key]}
      </span>
    ) : null;
  return (
    <form onSubmit={save} noValidate className="form-stack">
      <fieldset>
        <legend>Jenis transaksi</legend>
        <RadioGroup
          className="segmented"
          value={type}
          onValueChange={(value) => {
            setType(value);
            setCategory("");
          }}
          aria-label="Jenis transaksi"
        >
          {[
            ["expense", "Pengeluaran"],
            ["income", "Pemasukan"],
          ].map(([value, label]) => (
            <Label
              key={value}
              htmlFor={`tx-type-${value}`}
              className={type === value ? "selected" : ""}
            >
              <RadioGroupItem id={`tx-type-${value}`} value={value} />
              {label}
            </Label>
          ))}
        </RadioGroup>
      </fieldset>
      <div className="field">
        <Label htmlFor="tx-amount">Nominal</Label>
        <div className="amount-input">
          <span>Rp</span>
          <Input
            id="tx-amount"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? "tx-amount-error" : undefined}
          />
        </div>
        {fieldError("amount")}
      </div>
      <div className="field">
        <Label htmlFor="tx-categoryId">Kategori</Label>
        <SelectField
          label="Pilih kategori"
          id="tx-categoryId"
          value={categoryId}
          onValueChange={setCategory}
          placeholder="Pilih kategori"
          options={categories
            .filter((c) => c.type === type)
            .map((c) => ({ value: c.id, label: c.name }))}
          aria-invalid={!!errors.categoryId}
          aria-describedby={
            errors.categoryId ? "tx-categoryId-error" : undefined
          }
        />
        {fieldError("categoryId")}
      </div>
      <div className="field">
        <Label htmlFor="tx-date">Tanggal</Label>
        <DatePicker
          id="tx-date"
          value={date}
          onValueChange={setDate}
          aria-invalid={!!errors.date}
          aria-describedby={errors.date ? "tx-date-error" : undefined}
        />
        {fieldError("date")}
      </div>
      <div className="field">
        <Label htmlFor="tx-note">
          Catatan <span className="muted">(opsional)</span>
        </Label>
        <Input
          id="tx-note"
          maxLength={200}
          placeholder="Untuk apa transaksi ini?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {fieldError("note")}
      </div>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <Button type="submit" className="full-width">
        Simpan Transaksi
      </Button>
    </form>
  );
}
