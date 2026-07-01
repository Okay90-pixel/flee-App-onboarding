import { Car, LogOut } from "lucide-react";
import { FleeLogo } from "../components/Branding";

interface Props {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: Props) {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <FleeLogo />
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 text-[13.5px] text-gray-500 font-medium
                     hover:text-red-500 transition-colors duration-150 outline-none"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      {/* Placeholder content */}
      <main className="flex flex-col items-center justify-center px-6 text-center"
            style={{ minHeight: "calc(100vh - 72px)" }}>
        <div className="w-20 h-20 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mb-6">
          <Car size={38} className="text-[#1E3A8A]" />
        </div>

        <h1 className="text-[26px] font-bold text-gray-900 mb-2" style={{ letterSpacing: "-0.3px" }}>
          Fleet Dashboard
        </h1>
        <p className="text-[15px] text-gray-400 max-w-[320px] leading-relaxed">
          Your fleet workspace is ready. Manage your vehicles, drivers, and routes here.
        </p>
      </main>
    </div>
  );
}
