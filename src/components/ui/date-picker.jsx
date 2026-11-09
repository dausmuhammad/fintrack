"use client";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { ResponsivePicker } from "./responsive-picker";
import { useMobile } from "@/hooks/use-mobile";
import { localDate, dateLabel, monthLabel } from "@/lib/format";
export function DatePicker({ id, value, onValueChange, ...props }) {
  const [open, setOpen] = useState(false);
  const mobile = useMobile();
  const selected = value ? new Date(`${value}T12:00:00`) : undefined;
  const today = new Date();
  return (
    <ResponsivePicker
      open={open}
      onOpenChange={setOpen}
      title="Pilih tanggal transaksi"
      description="Pilih tanggal pencatatan. Tanggal setelah hari ini tidak dapat dipilih."
      className="calendar-popover"
      trigger={
        <Button
          id={id}
          type="button"
          variant="outline"
          data-slot="date-picker-trigger"
          className="date-picker-trigger"
          {...props}
        >
          <CalendarDays size={17} aria-hidden="true" />
          <span>{value ? dateLabel(value) : "Pilih tanggal"}</span>
        </Button>
      }
    >
      <Calendar
        mode="single"
        selected={selected}
        defaultMonth={selected}
        endMonth={today}
        disabled={{ after: today }}
        autoFocus={!mobile}
        onSelect={(date) => {
          if (date) {
            onValueChange(localDate(date));
            setOpen(false);
          }
        }}
      />
      <div className="calendar-footer">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            onValueChange(localDate());
            setOpen(false);
          }}
        >
          Hari ini
        </Button>
      </div>
    </ResponsivePicker>
  );
}
export function MonthPickerControl({ id, value, onValueChange }) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(Number(value.slice(0, 4)));
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: `${String(year).padStart(4, "0")}-${String(i + 1).padStart(2, "0")}`,
    label: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(
      new Date(2024, i, 1),
    ),
  }));
  function changeOpen(next) {
    if (next) setYear(Number(value.slice(0, 4)));
    setOpen(next);
  }
  return (
    <ResponsivePicker
      open={open}
      onOpenChange={changeOpen}
      title="Pilih periode"
      description="Tentukan bulan dan tahun catatan yang ingin dilihat."
      className="month-popover"
      trigger={
        <Button
          id={id}
          type="button"
          variant="outline"
          data-slot="month-picker-trigger"
          className="date-picker-trigger"
        >
          <CalendarDays size={17} aria-hidden="true" />
          <span>{monthLabel(value)}</span>
        </Button>
      }
    >
      <div className="month-picker-heading">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Tahun sebelumnya"
          disabled={year <= 1}
          onClick={() => setYear((y) => y - 1)}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </Button>
        <strong aria-live="polite">{year}</strong>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Tahun berikutnya"
          disabled={year >= 9999}
          onClick={() => setYear((y) => y + 1)}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </Button>
      </div>
      <div className="month-grid">
        {months.map((month) => (
          <Button
            key={month.value}
            type="button"
            variant="ghost"
            aria-pressed={value === month.value}
            aria-label={monthLabel(month.value)}
            onClick={() => {
              onValueChange(month.value);
              setOpen(false);
            }}
          >
            {month.label}
          </Button>
        ))}
      </div>
      <div className="calendar-footer">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            onValueChange(localDate().slice(0, 7));
            setOpen(false);
          }}
        >
          Bulan ini
        </Button>
      </div>
    </ResponsivePicker>
  );
}
