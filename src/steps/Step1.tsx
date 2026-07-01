import { useState, useRef, useEffect } from "react";
import { Field, Dropdown, PrimaryButton, INPUT_BASE, DropdownOption } from "../components/FormControls";
import { PhoneInput } from "../components/PhoneInput";
import type { FormData } from "../App";

const COUNTRIES: DropdownOption[] = [
  { value: "Nigeria",        label: "Nigeria",        emoji: "🇳🇬" },
  { value: "United States",  label: "United States",  emoji: "🇺🇸" },
  { value: "United Kingdom", label: "United Kingdom", emoji: "🇬🇧" },
  { value: "Argentina",      label: "Argentina",      emoji: "🇦🇷" },
  { value: "Brazil",         label: "Brazil",         emoji: "🇧🇷" },
  { value: "Canada",         label: "Canada",         emoji: "🇨🇦" },
  { value: "Chile",          label: "Chile",          emoji: "🇨🇱" },
  { value: "Colombia",       label: "Colombia",       emoji: "🇨🇴" },
  { value: "Egypt",          label: "Egypt",          emoji: "🇪🇬" },
  { value: "France",         label: "France",         emoji: "🇫🇷" },
  { value: "Germany",        label: "Germany",        emoji: "🇩🇪" },
  { value: "Ghana",          label: "Ghana",          emoji: "🇬🇭" },
  { value: "India",          label: "India",          emoji: "🇮🇳" },
  { value: "Kenya",          label: "Kenya",          emoji: "🇰🇪" },
  { value: "Mexico",         label: "Mexico",         emoji: "🇲🇽" },
  { value: "South Africa",   label: "South Africa",   emoji: "🇿🇦" },
];

const FLEET_SIZES: DropdownOption[] = [
  { value: "1-10 Vehicles",    label: "1-10 Vehicles" },
  { value: "11-50 Vehicles",   label: "11-50 Vehicles" },
  { value: "51-200 Vehicles",  label: "51-200 Vehicles" },
  { value: "201-500 Vehicles", label: "201-500 Vehicles" },
  { value: "500+ Vehicles",    label: "500+ Vehicles" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onContinue: () => void;
}

export default function Step1({ data, onChange, onContinue }: Props) {
  const emailValid = EMAIL_RE.test(data.email.trim());
  const phoneValid = data.phone.length >= 7;
  const isValid    = emailValid && phoneValid;

  const [emailFlash, setEmailFlash] = useState(false);
  const emailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (emailTimer.current) clearTimeout(emailTimer.current); };
  }, []);

  function triggerEmailFlash() {
    if (data.email && !emailValid) {
      setEmailFlash(true);
      if (emailTimer.current) clearTimeout(emailTimer.current);
      emailTimer.current = setTimeout(() => setEmailFlash(false), 1000);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1
        className="text-[26px] font-bold text-gray-900 leading-tight mb-3"
        style={{ letterSpacing: "-0.3px" }}
      >
        Create Your Fleet Workspace
      </h1>

      {/* Business Email */}
      <Field label="Business Email">
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          onBlur={triggerEmailFlash}
          placeholder="____ @gmail.com"
          className={[
            INPUT_BASE,
            emailFlash ? "!border-red-500 ring-2 ring-red-300/30" : "",
          ].join(" ")}
        />
      </Field>

      {/* Phone Number */}
      <Field label="Phone Number">
        <PhoneInput
          countryCode={data.phoneCountryCode}
          phone={data.phone}
          onChange={(phone, countryCode, dialCode) =>
            onChange({ phone, phoneCountryCode: countryCode, dialCode })
          }
        />
      </Field>

      {/* Country */}
      <Field label="Country">
        <Dropdown
          value={data.country}
          options={COUNTRIES}
          onChange={(v) => onChange({ country: v })}
        />
      </Field>

      {/* Fleet Size */}
      <Field label="Fleet Size">
        <Dropdown
          value={data.fleetSize}
          options={FLEET_SIZES}
          onChange={(v) => onChange({ fleetSize: v })}
          muted
        />
      </Field>

      <div className="flex justify-end pt-2">
        <PrimaryButton disabled={!isValid} onClick={onContinue}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}
