"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/client";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCReactProvider>
        {children}
        <Toaster 
          expand={true}
          richColors
          closeButton
        />
      </TRPCReactProvider>
    </ThemeProvider>
  );
}