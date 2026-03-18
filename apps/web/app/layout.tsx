import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ReactNode } from "react";

import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "KaikoPOS MVP",
  description: "Cloud restaurant operations foundation for POS, kitchen, inventory, and cash management."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
