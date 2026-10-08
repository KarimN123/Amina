import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import {cn} from '@/lib/utils'
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export const metadata: Metadata = {
  title: "AminaCare",
  description: "Un système de gestion des soins de santé",
};

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode; }>)
  {
  return (
    <html lang='fr' className={cn("dark font-sans", geist.variable)} suppressHydrationWarning>
      <body className={cn('min-h-screen bg-dark-300 font-sans antialiased', geist.variable)}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
          >
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
