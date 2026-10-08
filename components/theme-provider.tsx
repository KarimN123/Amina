"use client"

import * as React from "react"

import { ThemeProvider as NextThemesProvider } from "@wrksz/themes/next"
import type { ThemeProviderProps } from "@wrksz/themes/next" 

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}