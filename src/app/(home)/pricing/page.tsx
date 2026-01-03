"use client";
import Image from "next/image";
import { dark } from "@clerk/themes";
import { PricingTable } from "@clerk/nextjs";
import { useTheme } from "next-themes";

const Page = () => {
  const { theme } = useTheme();
  return (
    <section className="flex flex-col max-w-5xl mx-auto w-full">
      <div className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="ollio"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Choose Your Plan
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          Generate stunning UIs with AI. Start free, upgrade as you grow.
        </p>
        <div className="max-w-3xl mx-auto w-full mt-10">
          <PricingTable
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              variables:
                theme === "dark"
                  ? {
                      colorBackground: "oklch(0.2679 0.0036 106.6427)",
                    }
                  : {},
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Page;
