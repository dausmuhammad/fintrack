"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ThemeProvider } from "next-themes";
import { clearData, readData, writeData } from "@/lib/storage";
import { emptyData } from "@/lib/data";
const Context = createContext(null);
function DataProvider({ children }) {
  const [data, setData] = useState(emptyData);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);
  const [loadError, setLoadError] = useState("");
  const [message, notify] = useState("");
  function reload() {
    try {
      const next = readData(window.localStorage);
      setData(next);
      setLoadError("");
      loaded.current = true;
    } catch (error) {
      setLoadError(
        `Data belum dapat dibaca. ${error instanceof Error ? error.message : "Penyimpanan browser tidak tersedia."} Data lama tidak dihapus.`,
      );
      loaded.current = false;
    } finally {
      setReady(true);
    }
  }
  useEffect(() => {
    const timer = setTimeout(reload, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => notify(""), 5000);
    return () => clearTimeout(timer);
  }, [message]);
  function replace(next) {
    try {
      const saved = writeData(window.localStorage, next);
      setData(saved);
      setLoadError("");
      loaded.current = true;
    } catch (error) {
      throw new Error(
        `Belum tersimpan. ${error instanceof Error ? error.message : "Penyimpanan browser penuh atau tidak tersedia."}`,
      );
    }
  }
  function mutate(change) {
    if (!loaded.current)
      throw new Error(
        "Pulihkan data di Pengaturan sebelum menambah atau mengubah catatan.",
      );
    // Another tab may have saved changes since this view was loaded.
    try {
      const latest = readData(window.localStorage);
      replace(change(latest));
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Data tidak dapat disimpan.");
    }
  }
  function reset() {
    try {
      const next = clearData(window.localStorage);
      setData(next);
      setLoadError("");
      loaded.current = true;
    } catch {
      throw new Error(
        "Data belum dihapus. Penyimpanan browser tidak tersedia.",
      );
    }
  }
  useEffect(() => {
    const sync = (event) => {
      if (event.key === "fintrack:data:v1" || event.key === null) reload();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return (
    <Context.Provider
      value={{
        data,
        ready,
        loadError,
        message,
        notify,
        mutate,
        replace,
        reset,
        reload,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey="fintrack:theme"
    >
      <DataProvider>{children}</DataProvider>
    </ThemeProvider>
  );
}
export function useFinTrack() {
  const store = useContext(Context);
  if (!store) throw new Error("Provider FinTrack tidak tersedia.");
  return store;
}
