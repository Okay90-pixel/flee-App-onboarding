import { Car } from "lucide-react";
import { Shell } from "../components/Shell";

interface Props {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: Props) {
  return (
    <Shell>
      {/* Vertically-centered panel */}
      <div
        className="flex flex-col items-center text-center gap-4"
        style={{ minHeight: "calc(100vh - 180px)", justifyContent: "center" }}
      >
        {/* Rocket */}
        <span className="text-[56px] leading-none select-none" aria-hidden="true">
          🚀
        </span>

        {/* Heading */}
        <h1
          className="flex items-center gap-2 text-[22px] sm:text-[24px] font-bold text-gray-900"
          style={{ letterSpacing: "-0.2px" }}
        >
          <Car size={22} className="text-gray-800 flex-shrink-0" />
          Welcome to Flee
        </h1>

        {/* Sub-text */}
        <p className="text-[14.5px] text-gray-500 max-w-[320px] leading-relaxed">
          Let's setup your fleet in less than 5 minutes.
        </p>

        {/* Get Started button — centered */}
        <button
          type="button"
          onClick={onGetStarted}
          className="mt-3 h-[46px] px-10 text-[14.5px] font-semibold rounded-[12px]
                     bg-[#1E3A8A] text-white select-none
                     hover:brightness-110 active:scale-[0.98]
                     transition-all duration-200 ease-in-out"
        >
          Get Started
        </button>
      </div>
    </Shell>
  );
}
