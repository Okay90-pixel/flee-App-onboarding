import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Shell } from "../components/Shell";
import { Field, INPUT_BASE, PrimaryButton } from "../components/FormControls";

const OTP_LENGTH  = 5;
const CORRECT_OTP = "12345";

interface Props {
  onBack: () => void;   // back to login
  onDone: () => void;   // after successful reset → login
}

type FPScreen = "email" | "otp" | "newpass";
type OtpFlash = "idle" | "error" | "success";

/* ── Shared back-arrow row ─────────────────────────────────────────────── */
function BackRow({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center justify-center w-9 h-9 rounded-xl border border-[#D1D5DB]
                   hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 outline-none"
        aria-label="Go back"
      >
        <ArrowLeft size={16} className="text-gray-600" />
      </button>
      <span className="text-[14px] text-gray-500">{label}</span>
    </div>
  );
}

/* ── Screen 1: Enter email or phone ────────────────────────────────────── */
function EmailStep({ onBack, onNext }: { onBack: () => void; onNext: (contact: string) => void }) {
  const [contact, setContact] = useState("");
  const isValid = contact.trim().length > 4;

  return (
    <div className="flex flex-col gap-5">
      <BackRow onBack={onBack} label="Back to Login" />

      <div className="mb-1">
        <h1 className="text-[26px] font-bold text-gray-900 leading-tight" style={{ letterSpacing: "-0.3px" }}>
          Reset Password
        </h1>
        <p className="text-[15px] text-gray-500 mt-1.5 leading-relaxed">
          Enter your email or phone number to receive a verification code.
        </p>
      </div>

      <Field label="Email or Phone Number">
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && isValid && onNext(contact.trim())}
          placeholder="Enter email or phone"
          className={INPUT_BASE}
          autoFocus
        />
      </Field>

      <div className="flex justify-end pt-1">
        <PrimaryButton disabled={!isValid} onClick={() => onNext(contact.trim())}>
          Send Code
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ── Screen 2: OTP verification ────────────────────────────────────────── */
function OtpStep({
  contact,
  onBack,
  onVerified,
}: {
  contact: string;
  onBack: () => void;
  onVerified: () => void;
}) {
  const [digits, setDigits]     = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpFlash, setOtpFlash] = useState<OtpFlash>("idle");
  const [toast, setToast]       = useState(false);
  const inputs  = useRef<(HTMLInputElement | null)[]>([]);
  const flashTm = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTm = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFilled = digits.every((d) => d !== "");

  useEffect(() => {
    inputs.current[0]?.focus();
    return () => {
      if (flashTm.current) clearTimeout(flashTm.current);
      if (toastTm.current) clearTimeout(toastTm.current);
    };
  }, []);

  function focus(i: number) { inputs.current[i]?.focus(); }

  function handleChange(i: number, val: string) {
    if (otpFlash !== "idle") return;
    const digit = val.replace(/\D/g, "").slice(-1);
    const next  = [...digits];
    next[i]     = digit;
    setDigits(next);
    if (digit && i < OTP_LENGTH - 1) focus(i + 1);
  }

  function handleKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (otpFlash !== "idle") return;
    if (e.key === "Backspace") {
      if (digits[i]) { const next = [...digits]; next[i] = ""; setDigits(next); }
      else if (i > 0) focus(i - 1);
    } else if (e.key === "ArrowLeft"  && i > 0)              focus(i - 1);
    else if   (e.key === "ArrowRight" && i < OTP_LENGTH - 1) focus(i + 1);
  }

  function handlePaste(e: ClipboardEvent) {
    if (otpFlash !== "idle") return;
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    text.split("").forEach((d, i) => { next[i] = d; });
    setDigits(next);
    focus(Math.min(text.length, OTP_LENGTH - 1));
  }

  function handleVerify() {
    if (!isFilled || otpFlash !== "idle") return;
    const otp = digits.join("");
    if (otp === CORRECT_OTP) {
      setOtpFlash("success");
      flashTm.current = setTimeout(() => { setOtpFlash("idle"); onVerified(); }, 600);
    } else {
      setOtpFlash("error");
      flashTm.current = setTimeout(() => {
        setOtpFlash("idle");
        setDigits(Array(OTP_LENGTH).fill(""));
        setTimeout(() => focus(0), 0);
      }, 1000);
    }
  }

  function handleResend() {
    setOtpFlash("idle");
    setDigits(Array(OTP_LENGTH).fill(""));
    setToast(true);
    if (toastTm.current) clearTimeout(toastTm.current);
    toastTm.current = setTimeout(() => setToast(false), 2500);
    setTimeout(() => focus(0), 0);
  }

  function boxCls(i: number) {
    const base = [
      "w-[60px] h-[60px] sm:w-[68px] sm:h-[68px]",
      "text-center text-[22px] font-bold",
      "rounded-[14px] outline-none border-2",
      "transition-all duration-200 ease-in-out",
    ];
    if      (otpFlash === "error")   base.push("border-red-500 bg-red-50 text-red-600");
    else if (otpFlash === "success") base.push("border-[#10B981] bg-emerald-50 text-emerald-700");
    else if (digits[i])              base.push("border-[#1E3A8A] bg-[#EEF2FF] text-[#1E3A8A]");
    else                             base.push("border-[#D1D5DB] bg-white hover:border-gray-400 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/[0.10]");
    return base.join(" ");
  }

  return (
    <>
      {toast && (
        <div className="fixed top-5 left-1/2 z-50 toast-enter bg-gray-900 text-white text-[13px]
                        font-medium px-5 py-2.5 rounded-full shadow-xl whitespace-nowrap">
          Code resent successfully
        </div>
      )}

      <div className="flex flex-col gap-6">
        <BackRow onBack={onBack} label="Change email / phone" />

        <div>
          <h1 className="text-[26px] font-bold text-gray-900 leading-tight" style={{ letterSpacing: "-0.3px" }}>
            Verify Code
          </h1>
          <div className="text-[15px] leading-relaxed mt-1.5">
            <p className="text-gray-500">We've sent a code to:</p>
            <p className="font-bold text-gray-900">{contact}</p>
          </div>
        </div>

        {/* OTP boxes */}
        <div className="flex gap-3 sm:gap-4 justify-center w-full">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              className={boxCls(i)}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 h-[50px] rounded-[50px] border-2 border-[#1E3A8A]
                       bg-white text-gray-900 text-[14.5px] font-semibold
                       transition-all duration-200 ease-in-out
                       hover:bg-[#EEF2FF] active:scale-[0.98]"
          >
            Change
          </button>
          <button
            type="button"
            disabled={!isFilled || otpFlash !== "idle"}
            onClick={handleVerify}
            className={[
              "flex-1 h-[50px] rounded-[50px] text-[14.5px] font-semibold",
              "transition-all duration-200 ease-in-out",
              isFilled && otpFlash === "idle"
                ? "bg-[#1E3A8A] text-white cursor-pointer hover:brightness-110 active:scale-[0.98]"
                : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed",
            ].join(" ")}
          >
            Verify
          </button>
        </div>

        <p className="text-[14px] text-gray-400 text-center">
          Didn't receive any code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="font-bold text-gray-800 hover:text-[#1E3A8A] hover:underline outline-none transition-colors duration-150"
          >
            Resend
          </button>
        </p>
      </div>
    </>
  );
}

/* ── Screen 3: Create new password ─────────────────────────────────────── */
function NewPasswordStep({ onDone }: { onDone: () => void }) {
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [showCf,    setShowCf]    = useState(false);
  const [pwFlash,   setPwFlash]   = useState(false);

  const flashTm = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (flashTm.current) clearTimeout(flashTm.current); }, []);

  const passValid    = password.length >= 8;
  const confirmMatch = confirm === password && confirm.length > 0;
  const isValid      = passValid && confirmMatch;

  function triggerFlash() {
    if (confirm.length > 0 && !confirmMatch) {
      setPwFlash(true);
      if (flashTm.current) clearTimeout(flashTm.current);
      flashTm.current = setTimeout(() => setPwFlash(false), 1000);
    }
  }

  function PasswordField({
    label, value, onChange, visible, onToggle, flash = false, onBlur, placeholder,
  }: {
    label: string; value: string; onChange: (v: string) => void;
    visible: boolean; onToggle: () => void;
    flash?: boolean; onBlur?: () => void; placeholder?: string;
  }) {
    return (
      <Field label={label}>
        <div className="relative">
          <input
            type={visible ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder ?? "Min. 8 characters"}
            className={[
              INPUT_BASE, "pr-12",
              flash ? "!border-red-500 ring-2 ring-red-300/30" : "",
            ].join(" ")}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={onToggle}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                       hover:text-gray-600 transition-colors duration-150 outline-none"
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {flash && confirm.length > 0 && (
          <p className="text-[12px] text-red-500 mt-1.5 ml-1">Passwords must match</p>
        )}
      </Field>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-1">
        <h1 className="text-[26px] font-bold text-gray-900 leading-tight" style={{ letterSpacing: "-0.3px" }}>
          Create New Password
        </h1>
        <p className="text-[15px] text-gray-500 mt-1.5">
          Your new password must be at least 8 characters.
        </p>
      </div>

      <PasswordField
        label="New Password"
        value={password}
        onChange={setPassword}
        visible={showPw}
        onToggle={() => setShowPw((v) => !v)}
        flash={pwFlash}
      />

      <PasswordField
        label="Confirm Password"
        value={confirm}
        onChange={setConfirm}
        visible={showCf}
        onToggle={() => setShowCf((v) => !v)}
        flash={pwFlash}
        onBlur={triggerFlash}
        placeholder="Re-enter password"
      />

      <div className="flex justify-end pt-1">
        <PrimaryButton disabled={!isValid} onClick={onDone}>
          Reset Password
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ── Main ForgotPassword shell ─────────────────────────────────────────── */
export default function ForgotPassword({ onBack, onDone }: Props) {
  const [screen,  setScreen]  = useState<FPScreen>("email");
  const [contact, setContact] = useState("");

  return (
    <Shell>
      {screen === "email" && (
        <EmailStep
          onBack={onBack}
          onNext={(c) => { setContact(c); setScreen("otp"); }}
        />
      )}
      {screen === "otp" && (
        <OtpStep
          contact={contact}
          onBack={() => setScreen("email")}
          onVerified={() => setScreen("newpass")}
        />
      )}
      {screen === "newpass" && (
        <NewPasswordStep onDone={onDone} />
      )}
    </Shell>
  );
}
