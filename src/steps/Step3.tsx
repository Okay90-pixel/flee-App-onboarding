import { useState, useRef, useEffect } from "react";
import { Field, PrimaryButton, INPUT_BASE, PasswordInput } from "../components/FormControls";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface AdminData {
  fullName: string;
  adminEmail: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  prefillEmail: string;
  data: AdminData;
  onChange: (patch: Partial<AdminData>) => void;
  onSubmit: () => void;
}

export function getInitialAdminData(email: string): AdminData {
  return { fullName: "", adminEmail: email, password: "", confirmPassword: "" };
}

export default function Step3({ data, onChange, onSubmit }: Props) {
  const nameValid    = data.fullName.trim().length > 0;
  const emailValid   = EMAIL_RE.test(data.adminEmail.trim());
  const passValid    = data.password.length >= 8;
  const confirmValid = data.password === data.confirmPassword && data.confirmPassword.length > 0;
  const isValid      = nameValid && emailValid && passValid && confirmValid;

  const [pwFlash, setPwFlash] = useState(false);
  const flashTm = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (flashTm.current) clearTimeout(flashTm.current); };
  }, []);

  function triggerPwFlash() {
    if (data.confirmPassword.length > 0 && !confirmValid) {
      setPwFlash(true);
      if (flashTm.current) clearTimeout(flashTm.current);
      flashTm.current = setTimeout(() => setPwFlash(false), 1000);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1
        className="text-[26px] font-bold text-gray-900 leading-tight mb-2"
        style={{ letterSpacing: "-0.3px" }}
      >
        Create Company Administrator
      </h1>

      {/* Full Name */}
      <Field label="Full Name">
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="Insert Name"
          className={INPUT_BASE}
        />
      </Field>

      {/* Email – pre-filled and editable */}
      <Field label="Email">
        <input
          type="email"
          value={data.adminEmail}
          onChange={(e) => onChange({ adminEmail: e.target.value })}
          placeholder="you@company.com"
          className={INPUT_BASE}
        />
      </Field>

      {/* Password */}
      <Field label="Password">
        <PasswordInput
          value={data.password}
          onChange={(v) => onChange({ password: v })}
          placeholder="Min. 8 characters"
          flash={pwFlash}
        />
      </Field>

      {/* Confirm Password */}
      <Field label="Confirm Password">
        <PasswordInput
          value={data.confirmPassword}
          onChange={(v) => onChange({ confirmPassword: v })}
          placeholder="Re-enter password"
          flash={pwFlash}
          onBlur={triggerPwFlash}
        />
      </Field>

      <div className="flex justify-end pt-2">
        <PrimaryButton disabled={!isValid} onClick={onSubmit}>
          Create Workspace
        </PrimaryButton>
      </div>
    </div>
  );
}
