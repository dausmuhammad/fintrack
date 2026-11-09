"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  Plus,
} from "lucide-react";
import { useFinTrack } from "./providers/provider";
import { TransactionDialog } from "./transaction-dialog";
import { Button } from "./ui/button";
import { useInertWhenHidden } from "@/hooks/use-inert-when-hidden";
import { Brand } from './brand';
const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transaksi", label: "Transaksi", icon: Wallet },
  { href: "/budget", label: "Budget", icon: ChartNoAxesCombined },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];
export function AppShell({ children }) {
  const inertRef = useInertWhenHidden();
  const pathname = usePathname();
  const mainRef = useRef(null);
  const [adding, setAdding] = useState(false);
  const { ready, loadError, message, reload } = useFinTrack();
  const ErrorHeading = pathname === "/pengaturan" ? "p" : "h1";
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      mainRef.current?.scrollTo({ top: 0 }),
    );
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  const nav = links.map(({ href, label, icon: Icon }) => (
    <Link
      key={href}
      href={href}
      scroll={false}
      aria-current={pathname === href ? "page" : undefined}
      className={`nav-link ${pathname === href ? "active" : ""}`}
    >
      <Icon size={19} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  ));
  return (
    <div ref={inertRef} className="app-shell">
      <a href="#main-content" className="skip-link">
        Lewati ke konten
      </a>
      <aside className="sidebar">
        <Link
          href="/"
          scroll={false}
          className="brand"
          aria-label="FinTrack, dashboard"
        >
          <Brand />
        </Link>
        <p className="sidebar-caption">Catatan keuangan pribadi</p>
        <nav aria-label="Navigasi utama" className="side-nav">
          {nav}
        </nav>
        <div className="sidebar-bottom">
          <p>
            Uang tercatat.
            <br />
            <strong>Keputusan lebih jelas.</strong>
          </p>
          <small>Disimpan di browser ini</small>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span className="desktop-caption">
            Keuangan pribadi /{" "}
            <strong>
              {links.find((l) => l.href === pathname)?.label ?? "Halaman"}
            </strong>
          </span>
          <Link href="/" scroll={false} className="brand mobile-brand" aria-label="FinTrack, dashboard">
            <Brand />
          </Link>
          <div className="top-actions">
            <span className="local-label">Penyimpanan lokal</span>
            <Button
              className="desktop-add"
              disabled={!ready || !!loadError}
              onClick={() => setAdding(true)}
            >
              <Plus size={17} aria-hidden="true" />
              Tambah Transaksi
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="mobile-settings"
            >
              <Link
                href="/pengaturan"
                scroll={false}
                aria-label="Buka pengaturan"
              >
                <Settings size={20} aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </header>
        <main
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          className="main-content"
        >
          {!ready ? (
            <div role="status" className="loading-state">
              Memuat catatan keuangan dari browser ini…
            </div>
          ) : (
            <>
              {loadError && (
                <section className="alert" role="alert">
                  <ErrorHeading>Catatan belum dapat dimuat</ErrorHeading>
                  <p>{loadError}</p>
                  <div className="actions">
                    <Button variant="outline" onClick={reload}>
                      Coba lagi
                    </Button>
                    {pathname !== "/pengaturan" && (
                      <Button asChild variant="outline">
                        <Link href="/pengaturan" scroll={false}>
                          Pulihkan data
                        </Link>
                      </Button>
                    )}
                  </div>
                </section>
              )}
              {(!loadError || pathname === "/pengaturan") && children}
            </>
          )}
          <footer className="page-footer">
            FinTrack · Catatan milikmu, tersimpan di perangkatmu.
          </footer>
        </main>
      </div>
      <nav className="bottom-nav" aria-label="Navigasi mobile">
        {nav.slice(0, 2)}
        <Button
          className="fab"
          size="icon"
          aria-label="Tambah Transaksi"
          disabled={!ready || !!loadError}
          onClick={() => setAdding(true)}
        >
          <Plus size={24} aria-hidden="true" />
        </Button>
        {nav.slice(2)}
      </nav>
      {message && (
        <div role="status" className="toast">
          {message}
        </div>
      )}
      <TransactionDialog open={adding} onOpenChange={setAdding} />
    </div>
  );
}
