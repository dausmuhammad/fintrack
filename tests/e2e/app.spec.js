import { test, expect } from "@playwright/test";
let consoleErrors = [];
test.beforeEach(async ({ page }) => {
  consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
});
test.afterEach(async () => {
  expect(consoleErrors).toEqual([]);
});
async function add(page, { type = "Pengeluaran", amount, category, note }) {
  await page
    .getByRole("button", { name: "Tambah Transaksi", exact: true })
    .filter({ visible: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel(type, { exact: true }).check();
  await dialog.getByLabel("Nominal", { exact: true }).fill(amount);
  await choose(page, "Kategori", category);
  await dialog.getByLabel("Catatan", { exact: false }).fill(note);
  await dialog
    .getByRole("button", { name: "Simpan Transaksi", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
}
async function choose(page, label, option) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}
function nav(page, name) {
  return page
    .getByRole("link", { name, exact: true })
    .filter({ visible: true });
}
test("alur lengkap transaksi, budget, backup, tema dan reset", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByText("Belum ada transaksi", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Tambah Transaksi", exact: true })
    .filter({ visible: true })
    .click();
  await page
    .getByRole("button", { name: "Simpan Transaksi", exact: true })
    .click();
  await expect(
    page.getByText("Isi nominal bulat", { exact: false }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await add(page, {
    type: "Pemasukan",
    amount: "5000000",
    category: "Gaji",
    note: "Gaji bulan ini",
  });
  await add(page, { amount: "50000", category: "Makan", note: "Makan siang" });
  await expect(page.locator(".balance-value")).toContainText("4.950.000");
  await page.reload();
  await expect(page.locator(".balance-value")).toContainText("4.950.000");
  await nav(page, "Budget").click();
  await page
    .getByRole("button", { name: "Tambah budget", exact: true })
    .click();
  await choose(page, "Kategori pengeluaran", "Makan");
  await page.getByLabel("Batas budget (Rp)").fill("100000");
  await page
    .getByRole("button", { name: "Simpan budget", exact: true })
    .click();
  await expect(page.getByText("50% terpakai", { exact: true })).toBeVisible();
  await nav(page, "Transaksi").click();
  await page
    .getByRole("button", { name: "Edit Makan siang", exact: true })
    .click();
  await page.getByLabel("Nominal", { exact: true }).fill("150000");
  await page
    .getByRole("button", { name: "Simpan Transaksi", exact: true })
    .click();
  await page.getByLabel("Cari transaksi").fill("makan");
  await choose(page, "Jenis", "Pengeluaran");
  await choose(page, "Kategori", "Makan");
  await expect(page.locator(".transaction-row")).toHaveCount(1);
  await page.getByRole("button", { name: "Bersihkan filter" }).click();
  await expect(page.locator(".transaction-row")).toHaveCount(2);
  await nav(page, "Budget").click();
  await expect(page.getByText("150% terpakai")).toBeVisible();
  await expect(
    page.getByText("Budget terlampaui", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit budget Makan" }).click();
  await page.getByLabel("Batas budget (Rp)").fill("200000");
  await page
    .getByRole("button", { name: "Simpan budget", exact: true })
    .click();
  await expect(page.getByText("75% terpakai")).toBeVisible();
  await page.getByRole("button", { name: "Hapus budget Makan" }).click();
  await page.getByRole("button", { name: "Batal", exact: true }).click();
  await expect(page.getByText("75% terpakai")).toBeVisible();
  await nav(page, "Pengaturan").click();
  await page.getByRole("button", { name: "Terang", exact: true }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: "Gelap", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Sistem", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Sistem", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Ekspor backup", exact: true })
    .click();
  const download = await downloadPromise;
  await download.saveAs("artifacts/backup-e2e.json");
  await page.getByRole("button", { name: "Impor backup", exact: true }).click();
  await page.locator("#backup-file").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from("{broken"),
  });
  await expect(
    page.getByRole("alert").filter({ hasText: "File bukan JSON" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset data", exact: true }).click();
  await page.getByRole("button", { name: "Batal", exact: true }).click();
  await page.getByRole("button", { name: "Reset data", exact: true }).click();
  await page
    .getByRole("button", { name: "Ya, hapus semua data", exact: true })
    .click();
  await page.locator("#backup-file").setInputFiles("artifacts/backup-e2e.json");
  await expect(page.getByRole("dialog")).toContainText(
    "2 transaksi dan 1 budget",
  );
  await page
    .getByRole("button", { name: "Ganti dengan backup", exact: true })
    .click();
  await nav(page, "Dashboard").click();
  await expect(page.locator(".balance-value")).toContainText("4.850.000");
  await page.screenshot({ path: "artifacts/desktop.png", fullPage: true });
  await nav(page, "Transaksi").click();
  await page.getByRole("button", { name: "Hapus Makan siang" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Hapus transaksi", exact: true })
    .click();
  await expect(page.locator(".transaction-row")).toHaveCount(1);
  await nav(page, "Budget").click();
  await page.getByRole("button", { name: "Hapus budget Makan" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Hapus budget", exact: true })
    .click();
  await expect(page.getByText("Belum ada budget bulan ini")).toBeVisible();
  expect(errors).toEqual([]);
});
test("mobile drawer dan seluruh halaman pada kedua tema tanpa overflow", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByText("Belum ada transaksi", { exact: true }),
  ).toBeVisible();
  await add(page, {
    amount: "999999999999",
    category: "Makan",
    note: "Catatan pengujian panjang ".repeat(7),
  });
  await expect(page.locator(".balance-value")).toContainText("999.999.999.999");
  for (const theme of ["Terang", "Gelap"]) {
    await page.goto("/pengaturan");
    await page.getByRole("button", { name: theme, exact: true }).click();
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ["/", "/transaksi", "/budget", "/pengaturan"]) {
        await page.goto(route);
        await expect(page.locator("h1")).toBeVisible();
        await expect
          .poll(() =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= window.innerWidth,
            ),
          )
          .toBe(true);
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/transaksi");
  await page.screenshot({ path: "artifacts/mobile.png", fullPage: true });
  await page
    .getByRole("button", { name: "Tambah Transaksi", exact: true })
    .filter({ visible: true })
    .click();
  await expect(page.locator(".drawer")).toBeVisible();
  await page.getByLabel("Nominal", { exact: true }).fill("-10");
  await page
    .getByRole("button", { name: "Simpan Transaksi", exact: true })
    .click();
  await expect(
    page.getByText("Isi nominal bulat", { exact: false }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(errors).toEqual([]);
});
test("data rusak dan kegagalan storage tidak menghapus atau mengklaim sukses", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem("fintrack:data:v1", "{broken"),
  );
  await page.reload();
  await expect(
    page.getByRole("alert").filter({ hasText: "Data lama tidak dihapus" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("fintrack:data:v1")),
  ).toBe("{broken");
  await page.goto("/pengaturan");
  await page.getByRole("button", { name: "Reset data", exact: true }).click();
  await page
    .getByRole("button", { name: "Ya, hapus semua data", exact: true })
    .click();
  await page.goto("/");
  await page
    .getByRole("button", { name: "Tambah Transaksi", exact: true })
    .filter({ visible: true })
    .click();
  await page.getByLabel("Nominal", { exact: true }).fill("100");
  await choose(page, "Kategori", "Makan");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Kuota penuh");
    };
  });
  await page
    .getByRole("button", { name: "Simpan Transaksi", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "Belum tersimpan",
  );
  await expect(page.getByLabel("Nominal", { exact: true })).toHaveValue("100");
});

test("aksesibilitas kedua tema, fokus dialog, dan judul setelah navigasi", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await page.goto("/pengaturan");
  await expect(page.locator("h1")).toBeVisible();
  for (const theme of ["Terang", "Gelap"]) {
    await page.getByRole("button", { name: theme, exact: true }).click();
    for (const route of ["/pengaturan", "/", "/transaksi", "/budget"]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
    await page.goto("/pengaturan");
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    const trigger = page
      .getByRole("button", { name: "Tambah Transaksi", exact: true })
      .filter({ visible: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      expect(
        await page.evaluate(
          () => !!document.activeElement.closest('[role="dialog"]'),
        ),
      ).toBe(true);
    }
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Shift+Tab");
      expect(
        await page.evaluate(
          () => !!document.activeElement.closest('[role="dialog"]'),
        ),
      ).toBe(true);
    }
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await nav(page, "Transaksi").click();
  await nav(page, "Dashboard").click();
  const heading = await page.locator("h1").boundingBox();
  const header = await page.locator(".topbar").boundingBox();
  expect(heading.y).toBeGreaterThanOrEqual(header.y + header.height);
});

test("drawer, dropdown dan kalender memakai primitives konsisten di desktop/mobile", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await page
      .getByRole("button", { name: "Tambah Transaksi", exact: true })
      .filter({ visible: true })
      .click();
    const drawer = page.locator(
      '[data-slot="drawer-content"]:not([data-picker-panel])',
    );
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute(
      "data-vaul-drawer-direction",
      width < 768 ? "bottom" : "right",
    );
    await page.getByRole("combobox", { name: "Kategori", exact: true }).click();
    await expect(page.locator('[data-slot="select-content"]')).toBeVisible();
    if (width < 768)
      await expect(page.locator("[data-picker-panel]")).toHaveAttribute(
        "data-vaul-drawer-direction",
        "bottom",
      );
    await page.keyboard.press("Escape");
    await expect(drawer).toBeVisible();
    await expect(
      page.getByRole("combobox", { name: "Kategori", exact: true }),
    ).toBeFocused();
    await choose(page, "Kategori", "Makan");
    await page.getByLabel("Tanggal", { exact: true }).click();
    await expect(page.locator('[data-slot="calendar"]')).toBeVisible();
    if (width < 768)
      await expect(page.locator("[data-picker-panel]")).toHaveAttribute(
        "data-vaul-drawer-direction",
        "bottom",
      );
    const currentYear = new Date().getFullYear();
    await choose(page, "Pilih tahun", String(currentYear - 1));
    await choose(page, "Pilih tahun", String(currentYear));
    await expect(
      page.locator('input[type="date"], input[type="month"]'),
    ).toHaveCount(0);
    const calendarAudit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      calendarAudit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.screenshot({
      path: `artifacts/calendar-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
    const date = new Date();
    const first = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
    await page
      .locator(`[data-day="${first}"]:not([data-outside]) button`)
      .click();
    await expect(page.locator('[data-slot="calendar"]')).not.toBeVisible();
    await expect(drawer).toBeVisible();
    await expect(page.getByLabel("Tanggal", { exact: true })).toBeFocused();
    await page.getByLabel("Nominal", { exact: true }).fill("1000");
    await page
      .getByRole("button", { name: "Simpan Transaksi", exact: true })
      .click();
    await expect(drawer).not.toBeVisible();
    await nav(page, "Transaksi").click();
    await expect(
      page.getByRole("heading", { name: "Transaksi", exact: true }),
    ).toBeVisible();
    await page.getByLabel("Periode", { exact: true }).click();
    await expect(page.locator(".month-grid")).toBeVisible();
    await page.getByRole("button", { name: "Tahun sebelumnya" }).click();
    await page.locator(".month-grid button").first().click();
    await expect(
      page.getByText("Tidak ada transaksi yang cocok", { exact: true }),
    ).toBeVisible();
    await page.getByLabel("Periode", { exact: true }).click();
    await page.getByRole("button", { name: "Bulan ini", exact: true }).click();
    await expect(page.locator(".transaction-row")).not.toHaveCount(0);
    await page.getByRole("combobox", { name: "Jenis", exact: true }).click();
    await page.screenshot({
      path: `artifacts/select-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
    const selectAudit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      selectAudit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page
      .getByRole("option", { name: "Pengeluaran", exact: true })
      .click();
  }
});
