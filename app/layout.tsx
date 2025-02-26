import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/app/StoreProvider";
import { Structure } from "@/components/Layout/Structure";
import { theme } from "@/lib/theme";

const dm_sans = DM_Sans({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-dm_sans",
});

export const metadata: Metadata = {
  title: "Desing-O-Tron",
  description: "Desing-O-Tron is here!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dm_sans.className} antialiased`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme} defaultMode="light">
            <StoreProvider>
              <Structure>{children}</Structure>
            </StoreProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
