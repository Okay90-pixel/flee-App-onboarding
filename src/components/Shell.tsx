import { ReactNode } from "react";
import { FleeLogo, CarIllustration } from "./Branding";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden"
      style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
    >
      <header className="flex justify-center pt-7">
        <FleeLogo />
      </header>

      <main className="relative z-10 w-full max-w-[500px] mx-auto px-5 pt-10 pb-20">
        {children}
      </main>

      <div
        className="fixed bottom-0 right-0 pointer-events-none z-0
                   w-[180px] sm:w-[230px] md:w-[280px]"
        aria-hidden="true"
      >
        <CarIllustration />
      </div>
    </div>
  );
}
