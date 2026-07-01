import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";

const OTP_LENGTH  = 5;
const CORRECT_OTP = "12345";

type OtpFlash = "idle" | "error" | "success";

interface Props {
  email: string;
  onVerified: () => void;
  onChangeEmail: () => void;
}

export default function Step2({ email, onVerified, onChangeEmail }: Props) {
  const [digits, setDigits]     = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpFlash, setOtpFlash] = useState<OtpFlash>("idle");
  const [toast, setToast]       = useState(false);
  const inputs  = useRef<(HTMLInputElement | null)[]>([]);
  const flashTm = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTm = useRef<ReturnType<typeof setTimeout> | null>(null);

  const otp      = digits.join("");
  const isFilled = digits.every((d) => d !== "");

  useEffect(() => {
    return () => {
      if (flashTm.current) clearTimeout(flashTm.current);
      if (toastTm.current) clearTimeout(toastTm.current);
    };
  }, []);

  function focus(i: number) {
    inputs.current[i]?.focus();
  }

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
      if (digits[i]) {
        const next = [...digits]; next[i] = ""; setDigits(next);
      } else if (i > 0) {
        focus(i - 1);
      }
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

    if (otp === CORRECT_OTP) {
      /* green flash → advance */
      setOtpFlash("success");
      flashTm.current = setTimeout(() => {
        setOtpFlash("idle");
        onVerified();
      }, 600);
    } else {
      /* red flash → clear → refocus */
      setOtpFlash("error");
      flashTm.current = setTimeout(() => {
        setOtpFlash("idle");
        setDigits(Array(OTP_LENGTH).fill(""));
        setTimeout(() => focus(0), 0);
      }, 1000);
    }
  }

  function handleResend() {
    if (flashTm.current) clearTimeout(flashTm.current);
    if (toastTm.current) clearTimeout(toastTm.current);
    setOtpFlash("idle");
    setDigits(Array(OTP_LENGTH).fill(""));
    setToast(true);
    toastTm.current = setTimeout(() => setToast(false), 2500);
    setTimeout(() => focus(0), 0);
  }

  /* Per-box className based on flash state */
  function boxCls(i: number) {
    const base = [
      "w-[60px] h-[60px] sm:w-[68px] sm:h-[68px]",
      "text-center text-[22px] font-bold",
      "rounded-[14px] outline-none border-2",
      "transition-all duration-200 ease-in-out",
    ];

    if (otpFlash === "error") {
      base.push("border-red-500 bg-red-50 text-red-600");
    } else if (otpFlash === "success") {
      base.push("border-[#10B981] bg-emerald-50 text-emerald-700");
    } else if (digits[i]) {
      base.push("border-[#1E3A8A] bg-[#EEF2FF] text-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/[0.10]");
    } else {
      base.push("border-[#D1D5DB] bg-white text-gray-800 hover:border-gray-400 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/[0.10]");
    }

    return base.join(" ");
  }

  return (
    <>
      {/* Resend toast — fixed, centered at top */}
      {toast && (
        <div
          className="fixed top-5 left-1/2 z-50 toast-enter
                     bg-gray-900 text-white text-[13px] font-medium
                     px-5 py-2.5 rounded-full shadow-xl whitespace-nowrap"
        >
          Code resent successfully
        </div>
      )}

      <div className="flex flex-col items-center text-center gap-8">
        {/* Heading */}
        <div className="flex flex-col gap-3">
          <h1
            className="text-[28px] sm:text-[30px] font-bold text-gray-900"
            style={{ letterSpacing: "-0.4px" }}
          >
            Verify Your Email
          </h1>
          <div className="text-[15px] leading-relaxed">
            <p className="text-gray-500">We've sent a code to:</p>
            <p className="font-bold text-gray-900">{email}</p>
          </div>
        </div>

        {/* OTP grid */}
        <div className="flex gap-3 sm:gap-4 w-full justify-center">
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

        {/* Action buttons */}
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onChangeEmail}
            className="flex-1 h-[50px] rounded-[50px] border-2 border-[#1E3A8A]
                       bg-white text-gray-900 text-[14.5px] font-semibold
                       transition-all duration-200 ease-in-out
                       hover:bg-[#EEF2FF] active:scale-[0.98]"
          >
            Change Email
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

        {/* Resend link */}
        <p className="text-[14px] text-gray-400 -mt-2">
          Didn't receive any code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="font-bold text-gray-800 transition-all duration-150 outline-none
                       hover:text-[#1E3A8A] hover:underline focus-visible:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </>
  );
}
