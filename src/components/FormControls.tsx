/* Reusable form primitives: Field wrapper, Dropdown, PasswordInput */
import { useState, useRef, ReactNode } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { ArgentinaFlag } from "./Branding";

/* ─── Design tokens ──────────────────────────────────────────────────────── */
export const INPUT_BASE =
  "w-full h-[52px] px-4 text-[14.5px] text-gray-800 bg-white outline-none " +
  "border border-[#D1D5DB] rounded-xl " +
  "transition-all duration-200 ease-in-out " +
  "hover:border-gray-400 " +
  "focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/[0.08] " +
  "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed " +
  "placeholder-gray-400";

/* ─── Field wrapper ──────────────────────────────────────────────────────── */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="w-full">
      <label className="block text-[14px] font-medium text-gray-700 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ─── Primary button ─────────────────────────────────────────────────────── */
export function PrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "h-[48px] px-8 text-[14.5px] font-semibold tracking-wide select-none",
        "transition-all duration-200 ease-in-out",
        "rounded-[50px]",                           // pill shape per spec
        disabled
          ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
          : "bg-[#1E3A8A] text-white cursor-pointer hover:brightness-110 active:scale-[0.98]",
      ].join(" ")}
      style={{ minWidth: 130 }}
    >
      {children}
    </button>
  );
}

/* ─── Dropdown ───────────────────────────────────────────────────────────── */
export interface DropdownOption {
  value: string;
  label: string;
  flag?: boolean;      // show ArgentinaFlag before label
  emoji?: string;      // optional emoji flag
}

export function Dropdown({
  value,
  options,
  onChange,
  muted = false,
}: {
  value: string;
  options: DropdownOption[];
  onChange: (v: string) => void;
  muted?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const ringCls =
    open || focused
      ? "border-[#1E3A8A] ring-2 ring-[#1E3A8A]/[0.08]"
      : "border-[#D1D5DB] hover:border-gray-400";

  return (
    <div
      ref={ref}
      className="relative"
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) {
          setOpen(false);
          setFocused(false);
        }
      }}
    >
      <button
        type="button"
        tabIndex={0}
        onFocus={() => setFocused(true)}
        onBlur={() => { if (!open) setFocused(false); }}
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex items-center w-full h-[52px] px-4 bg-white rounded-xl border",
          "transition-all duration-200 ease-in-out cursor-pointer select-none outline-none",
          ringCls,
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected?.flag && <ArgentinaFlag size={22} />}
        {selected?.emoji && (
          <span className="text-lg leading-none mr-0.5">{selected.emoji}</span>
        )}
        <span
          className={[
            "ml-2 flex-1 text-left text-[14.5px]",
            muted ? "text-gray-400" : "text-gray-700",
          ].join(" ")}
        >
          {selected?.label ?? value}
        </span>
        <ChevronDown
          size={17}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-[56px] left-0 right-0 z-50 bg-white border border-[#D1D5DB]
                     rounded-xl shadow-lg overflow-hidden py-1 max-h-52 overflow-y-auto"
        >
          {options.map((opt) => (
            <li key={opt.value} role="option" aria-selected={opt.value === value}>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => { onChange(opt.value); setOpen(false); setFocused(false); }}
                className={[
                  "flex items-center gap-2 w-full px-4 py-2.5 text-[14px] text-left",
                  "transition-colors duration-150 hover:bg-blue-50",
                  opt.value === value ? "text-[#1E3A8A] font-semibold" : "text-gray-700",
                ].join(" ")}
              >
                {opt.flag && <ArgentinaFlag size={18} />}
                {opt.emoji && <span className="text-base">{opt.emoji}</span>}
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Password input ─────────────────────────────────────────────────────── */
export function PasswordInput({
  value,
  onChange,
  placeholder,
  flash = false,
  onBlur,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  flash?: boolean;
  onBlur?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={[
          INPUT_BASE,
          "pr-12",
          flash ? "!border-red-500 ring-2 ring-red-300/30" : "",
        ].join(" ")}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                   hover:text-gray-600 transition-colors duration-150 outline-none"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}
