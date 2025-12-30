interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
      <div className="absolute inset-0 -z-10 h-full">
        <div
          className="absolute inset-0 bg-background dark:hidden"
          style={{
            backgroundImage: "radial-gradient(#dadde2 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
        <div
          className="absolute inset-0  hidden dark:block opacity-70"
          style={{
            backgroundImage: "radial-gradient(#393e4a 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>
      <div className="flex-1 flex flex-col px-4 pb-4">{children}</div>
    </main>
  );
};

export default Layout;
