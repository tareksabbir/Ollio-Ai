import Footer from "@/components/header-footer/footer";
import Navbar from "@/components/header-footer/navbar";
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
      <div className="hidden md:block ">
        <Spotlight className="sm:-top-10 sm:left-1/2 md:-top-40 md:left-1/2 lg:-top-50 lg:left-2/5 hidden dark:block" />
      </div>

      <Navbar />
      <div className="flex-1 flex flex-col px-4 pb-4">{children}</div>
      <Footer />
    </main>
  );
};

export default Layout;
