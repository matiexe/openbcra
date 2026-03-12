import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OPEN BCRA - Datos Abiertos",
  description: "Portal de Datos Abiertos del Banco Central de la República Argentina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex text-slate-100 bg-[#0F172A]`}
      >
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-8 lg:p-12">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
