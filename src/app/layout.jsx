import { Providers } from "@/components/providers/provider";
import { AppShell } from "@/components/app-shell";
import "react-day-picker/style.css";
import "./globals.css";
export const metadata = {
  title: {
    default: "FinTrack | Catatan keuangan pribadi",
    template: "%s | FinTrack",
  },
  description: "Catat pemasukan, pengeluaran, dan budget pribadi dalam rupiah.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
