import { useState } from "react";
import { Check } from "lucide-react";
import { Shell } from "../components/Shell";
import { Field, INPUT_BASE, PrimaryButton } from "../components/FormControls";

interface Props {
  onContinue: (licenseNumber: string) => void;
  onSkip: () => void;
}

function VehicleStepper() {
  const steps = ["Add Vehicle", "Add License", "Assign Driver"];

  return (
    <div className="w-full mb-7">
      <div className="flex items-center w-full">
        {steps.map((_, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex-shrink-0 w-[26px] h-[26px] rounded-full border-2 border-gray-300
                            bg-white flex items-center justify-center">
              <Check size={11} strokeWidth={2.5} className="text-gray-300" />
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-[1.5px] bg-gray-200 mx-1" />
            )}
          </div>
        ))}
      </div>

      <div className="grid mt-2" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
        {steps.map((label, i) => (
          <span
            key={i}
            className={[
              "text-[12px] text-gray-400 font-medium",
              i === 0 ? "text-left" : i === steps.length - 1 ? "text-right" : "text-center",
            ].join(" ")}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AddLicense({ onContinue, onSkip }: Props) {
  const [licenseNumber, setLicenseNumber] = useState("");

  const isValid = licenseNumber.trim().length > 0;

  return (
    <Shell>
      <div className="flex flex-col gap-5">
        <div className="mb-1">
          <h1
            className="text-[26px] font-bold text-gray-900 leading-tight"
            style={{ letterSpacing: "-0.3px" }}
          >
            Add License
          </h1>
          <p className="text-[15px] text-gray-500 mt-1">Create Your Fleet Workspace</p>
        </div>

        <VehicleStepper />

        <Field label="License Number">
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="e.g. DL-1234567890"
            className={INPUT_BASE}
          />
        </Field>

        <div className="flex items-center justify-end gap-5 pt-2">
          <button
            type="button"
            onClick={onSkip}
            className="text-[14.5px] font-semibold text-[#1E3A8A] transition-colors duration-150
                       hover:text-[#1E3A8A]/70 outline-none"
          >
            Skip
          </button>
          <PrimaryButton disabled={!isValid} onClick={() => onContinue(licenseNumber)}>
            Continue
          </PrimaryButton>
        </div>
      </div>
    </Shell>
  );
}
