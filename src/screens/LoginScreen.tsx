import { useState } from "react";
import { Shell } from "../components/Shell";
import { Field, INPUT_BASE, PasswordInput, PrimaryButton } from "../components/FormControls";

interface Props {
  onLogin:           (rememberMe: boolean) => void;
  onForgotPassword:  () => void;
  onRegister:        () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ onLogin, onForgotPassword, onRegister }: Props) {
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const isValid = EMAIL_RE.test(email.trim()) && password.length > 0;

  function handleSubmit() {
    if (!isValid) return;
    onLogin(rememberMe);
  }

  return (
    <Shell>
      <div className="flex flex-col gap-5">
        {/* Heading */}
        <div className="mb-1">
          <h1
            className="text-[26px] font-bold text-gray-900 leading-tight"
            style={{ letterSpacing: "-0.3px" }}
          >
            Welcome to flee
          </h1>
          <p className="text-[15px] text-gray-500 mt-1.5">
            Login into your flee account
          </p>
        </div>

        {/* Email Address */}
        <Field label="Email Address">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="@gmail.com"
            className={INPUT_BASE}
          />
        </Field>

        {/* Password */}
        <Field label="Password">
          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="············"
            flash={false}
          />
        </Field>

        {/* Remember Me + Forgot Password row */}
        <div className="flex items-center justify-between -mt-1">
          {/* Custom checkbox */}
          <button
            type="button"
            onClick={() => setRememberMe((v) => !v)}
            className="flex items-center gap-2.5 select-none outline-none group"
            aria-checked={rememberMe}
            role="checkbox"
          >
            <span
              className={[
                "flex-shrink-0 w-[18px] h-[18px] rounded border-2 flex items-center justify-center",
                "transition-colors duration-150",
                rememberMe
                  ? "bg-[#1E3A8A] border-[#1E3A8A]"
                  : "border-gray-300 bg-white group-hover:border-gray-400",
              ].join(" ")}
            >
              {rememberMe && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-[14px] text-gray-600">Remember Me</span>
          </button>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[14px] text-gray-600 hover:text-[#1E3A8A]
                       transition-colors duration-150 outline-none"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login button — right-aligned */}
        <div className="flex justify-end pt-1">
          <PrimaryButton disabled={!isValid} onClick={handleSubmit}>
            Login
          </PrimaryButton>
        </div>

        {/* Register link */}
        <p className="text-center text-[13.5px] text-gray-400 mt-1">
          New to FLEE?{" "}
          <button
            type="button"
            onClick={onRegister}
            className="text-[#1E3A8A] font-semibold hover:underline outline-none"
          >
            Create Workspace
          </button>
        </p>
      </div>
    </Shell>
  );
}
