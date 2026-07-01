import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { COUNTRY_CODES, CountryCode, DEFAULT_COUNTRY } from "../data/countryCodes";
import { INPUT_BASE } from "./FormControls";

interface Props {
  countryCode: string;  // ISO code e.g. "NG"
  phone: string;
  onChange: (phone: string, countryCode: string, dialCode: string) => void;
}

export function PhoneInput({ countryCode, phone, onChange }: Props) {
  const selected: CountryCode =
    COUNTRY_CODES.find((c) => c.code === countryCode) ?? DEFAULT_COUNTRY;

  const [open, setOpen]           = useState(false);
  const [search, setSearch]       = useState("");
  const [phoneFlash, setPhoneFlash] = useState(false);

  const flashTm   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropRef   = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* Close on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!dropRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Focus search when dropdown opens */
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 30);
    else setSearch("");
  }, [open]);

  useEffect(() => {
    return () => { if (flashTm.current) clearTimeout(flashTm.current); };
  }, []);

  function triggerFlash() {
    setPhoneFlash(true);
    if (flashTm.current) clearTimeout(flashTm.current);
    flashTm.current = setTimeout(() => setPhoneFlash(false), 1000);
  }

  function handlePhoneChange(raw: string) {
    const digits = raw.replace(/\D/g, "");

    /* Non-numeric characters attempted */
    if (raw !== digits) {
      triggerFlash();
      onChange(digits, countryCode, selected.dialCode);
      return;
    }

    /* Exceeds country max length */
    if (digits.length > selected.maxDigits) {
      triggerFlash();
      onChange(digits.slice(0, selected.maxDigits), countryCode, selected.dialCode);
      return;
    }

    onChange(digits, countryCode, selected.dialCode);
  }

  function selectCountry(c: CountryCode) {
    const trimmed = phone.slice(0, c.maxDigits);
    onChange(trimmed, c.code, c.dialCode);
    setOpen(false);
  }

  const filtered = search
    ? COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dialCode.includes(search) ||
          c.code.toLowerCase().includes(search.toLowerCase()),
      )
    : COUNTRY_CODES;

  return (
    <div className="flex gap-2">
      {/* ── Country picker ─────────────────────────────────────────────── */}
      <div ref={dropRef} className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={[
            "flex items-center gap-1.5 h-[52px] px-3 rounded-xl border bg-white",
            "transition-all duration-200 ease-in-out cursor-pointer select-none outline-none",
            open
              ? "border-[#1E3A8A] ring-2 ring-[#1E3A8A]/[0.08]"
              : "border-[#D1D5DB] hover:border-gray-400",
          ].join(" ")}
          style={{ minWidth: 112 }}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="text-[20px] leading-none">{selected.emoji}</span>
          <span className="text-[14px] text-gray-700 font-medium whitespace-nowrap">
            {selected.dialCode}
          </span>
          <ChevronDown
            size={13}
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div
            className="absolute top-[56px] left-0 z-50 bg-white border border-[#D1D5DB]
                       rounded-xl shadow-2xl overflow-hidden"
            style={{ width: 288 }}
          >
            {/* Search bar */}
            <div className="p-2 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
                <Search size={13} className="text-gray-400 flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country or code..."
                  className="flex-1 text-[13px] outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Country list */}
            <ul role="listbox" className="max-h-52 overflow-y-auto py-1">
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <li key={c.code} role="option" aria-selected={c.code === countryCode}>
                    <button
                      type="button"
                      onClick={() => selectCountry(c)}
                      className={[
                        "flex items-center gap-2.5 w-full px-3 py-2.5 text-left",
                        "transition-colors duration-100 hover:bg-blue-50",
                        c.code === countryCode ? "bg-blue-50" : "",
                      ].join(" ")}
                    >
                      <span className="text-[18px] leading-none w-7 flex-shrink-0 text-center">
                        {c.emoji}
                      </span>
                      <span className="text-[13px] font-semibold text-[#1E3A8A] w-12 flex-shrink-0">
                        {c.dialCode}
                      </span>
                      <span className="text-[13px] text-gray-700 truncate">{c.name}</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-[13px] text-gray-400 text-center">
                  No countries found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* ── Phone number input ──────────────────────────────────────────── */}
      <input
        type="tel"
        value={phone}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder="Phone number"
        className={[
          INPUT_BASE,
          "tracking-wider",
          phoneFlash ? "!border-red-500 ring-2 ring-red-300/30" : "",
        ].join(" ")}
      />
    </div>
  );
}
