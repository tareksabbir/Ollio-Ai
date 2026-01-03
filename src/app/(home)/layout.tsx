import Navbar from "@/modules/home/ui/components/navbar";
import { Spotlight } from "@/components/ui/spotlight";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex flex-col min-h-screen relative">
      <div className="absolute inset-0 -z-10 h-full">
        <div
          className="absolute inset-0 bg-background dark:hidden"
          style={{
            backgroundImage: "radial-gradient(#dadde2 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
        <div
          className="absolute inset-0 hidden dark:block opacity-70"
          style={{
            backgroundImage: "radial-gradient(#393e4a 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>
      
      {/* Spotlight Effect - Only in Dark Mode - Responsive positioning */}
      <Spotlight
        className="-top-20 left-1/2 -translate-x-1/2 sm:-top-32 sm:left-1/2 md:-top-40 md:left-1/2 lg:-top-48 lg:left-2/3 hidden dark:block"
        fill="white"
      />
      
      <Navbar />
      <div className="flex-1 flex flex-col px-4 pb-4">{children}</div>
    </main>
  );
};

export default Layout;