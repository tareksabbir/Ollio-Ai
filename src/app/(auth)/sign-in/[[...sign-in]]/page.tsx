"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { theme } = useTheme();

  return (
    <section className="flex flex-col max-w-3xl mx-auto w-full relative z-10">
      <div className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <SignIn
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              variables:
                theme === "dark"
                  ? {
                      colorBackground: "oklch(0.2679 0.0036 106.6427)", // dark --background
                    }
                  : {},
            }}
          />
        </div>
      </div>
    </section>
  );
}
