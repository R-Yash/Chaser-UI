import { Anybody, Archivo_Narrow, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anybody = Anybody({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-anybody" });
const archivo = Archivo_Narrow({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-archivo" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${anybody.variable} ${archivo.variable} ${mono.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}