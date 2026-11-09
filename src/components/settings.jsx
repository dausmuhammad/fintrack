"use client";
import { useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  Download,
  Upload,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
} from "lucide-react";
import { useFinTrack } from "./providers/provider";
import { PageHeading } from "./overview";
import { Button } from "./ui/button";
import { ResponsiveDialog } from "./ui/responsive-dialog";
import { MAX_FILE, parseBackup } from "@/lib/validation";
import { DATA_KEY } from "@/lib/storage";
import { localDate } from "@/lib/format";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
function download(content, filename) {
  const url = URL.createObjectURL(
    new Blob([content], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function SettingsPage() {
  const { data, replace, reset, notify, loadError } = useFinTrack();
  const { theme, setTheme } = useTheme();
  const [pending, setPending] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  async function selectFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    if (file.size > MAX_FILE) {
      setError("Ukuran backup maksimal 5 MB. Data lama tidak berubah.");
      return;
    }
    setBusy(true);
    try {
      setPending(parseBackup(await file.text()));
    } catch (err) {
      setError(`${err.message} Data lama tidak berubah.`);
    } finally {
      setBusy(false);
    }
  }
  function exportData() {
    setError("");
    try {
      const content = loadError
        ? window.localStorage.getItem(DATA_KEY)
        : JSON.stringify(data, null, 2);
      if (content === null)
        throw new Error("Tidak ada data mentah yang dapat diekspor.");
      download(
        content,
        `fintrack-${loadError ? "pemulihan-" : ""}${localDate()}.json`,
      );
      notify(
        loadError
          ? "Salinan data mentah diekspor untuk pemulihan."
          : "Backup berhasil diekspor. Simpan file di tempat yang aman.",
      );
    } catch (err) {
      setError(`Ekspor gagal. ${err.message}`);
    }
  }
  function importData() {
    try {
      replace(pending);
      setPending(null);
      notify("Backup diimpor. Catatan sudah diganti.");
    } catch (err) {
      setError(err.message);
    }
  }
  function resetData() {
    try {
      reset();
      setResetting(false);
      notify("Seluruh transaksi dan budget dihapus.");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <>
      <PageHeading
        title="Pengaturan"
        subtitle="Atur tampilan dan kelola salinan catatanmu."
      />
      <div className="settings-layout">
        <section className="panel settings-panel">
          <h2>Tampilan</h2>
          <p className="muted">Pilih tema yang nyaman untuk membaca angka.</p>
          <div
            className="theme-options"
            role="group"
            aria-label="Tema aplikasi"
          >
            {[
              ["light", "Terang", Sun],
              ["dark", "Gelap", Moon],
              ["system", "Sistem", Monitor],
            ].map(([value, label, Icon]) => (
              <Button
                key={value}
                variant="outline"
                aria-pressed={theme === value}
                onClick={() => setTheme(value)}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </Button>
            ))}
          </div>
        </section>
        <section className="panel settings-panel">
          <h2>Backup & pemulihan</h2>
          <p className="muted">
            Ekspor catatan sebelum berpindah browser atau perangkat. Impor akan
            mengganti seluruh transaksi dan budget.
          </p>
          <div className="actions backup-actions">
            <Button variant="outline" onClick={exportData}>
              <Download size={17} aria-hidden="true" />
              {loadError ? "Ekspor data mentah" : "Ekspor backup"}
            </Button>
            <Button
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
            >
              <Upload size={17} aria-hidden="true" />
              {busy ? "Memeriksa file…" : "Impor backup"}
            </Button>
            <Label className="sr-only" htmlFor="backup-file">
              Pilih file backup JSON
            </Label>
            <Input
              ref={fileRef}
              id="backup-file"
              className="sr-only"
              type="file"
              accept=".json,application/json"
              tabIndex={-1}
              onChange={selectFile}
            />
          </div>
          <small className="muted">Format JSON · Maksimal 5 MB</small>
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
        </section>
        <section className="privacy-note">
          <ShieldCheck size={22} aria-hidden="true" />
          <div>
            <h2>Catatan tersimpan di browser ini</h2>
            <p className="muted">
              Tidak ada akun atau sinkronisasi antarperangkat. Data dapat hilang
              ketika data situs dihapus. Ekspor backup secara berkala. Orang
              yang memakai profil browser ini juga dapat membuka catatanmu.
            </p>
          </div>
        </section>
        <section className="panel settings-panel reset-panel">
          <div>
            <h2>Hapus seluruh data</h2>
            <p className="muted">
              Menghapus transaksi dan budget di browser ini. Tindakan ini tidak
              dapat dibatalkan.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => {
              setError("");
              setResetting(true);
            }}
          >
            Reset data
          </Button>
        </section>
      </div>
      <ResponsiveDialog
        open={!!pending}
        onOpenChange={(open) => !open && setPending(null)}
        title="Ganti data dengan backup?"
        description={
          pending
            ? `Backup berisi ${pending.transactions.length} transaksi dan ${pending.budgets.length} budget. Seluruh catatan saat ini akan diganti. Ekspor backup lama sebelum melanjutkan.`
            : "Periksa backup sebelum mengimpor."
        }
      >
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <div className="actions">
          <Button variant="outline" onClick={() => setPending(null)}>
            Batal
          </Button>
          <Button onClick={importData}>Ganti dengan backup</Button>
        </div>
      </ResponsiveDialog>
      <ResponsiveDialog
        open={resetting}
        onOpenChange={setResetting}
        title="Hapus seluruh catatan?"
        description="Semua transaksi dan budget di browser ini akan dihapus. Pastikan kamu sudah mengekspor backup jika masih membutuhkannya."
      >
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <div className="actions">
          <Button variant="outline" onClick={() => setResetting(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={resetData}>
            Ya, hapus semua data
          </Button>
        </div>
      </ResponsiveDialog>
    </>
  );
}
