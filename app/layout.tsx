import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AuthStateProvider } from "@/components/use-auth";

export const metadata: Metadata = {
  title: "Devli's Advocated",
  description: "Premium QR photo conversion app with Google-only login."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthStateProvider>{children}</AuthStateProvider>
        </Providers>
      </body>
    </html>
  );
}
