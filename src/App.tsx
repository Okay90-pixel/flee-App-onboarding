import { useState, useEffect } from "react";
import { Check, Car } from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";
import { FleeLogo, CarIllustration } from "./components/Branding";
import { Shell } from "./components/Shell";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3, { getInitialAdminData, AdminData } from "./steps/Step3";
import LoginScreen    from "./screens/LoginScreen";
import ForgotPassword from "./screens/ForgotPassword";
import WelcomeScreen  from "./screens/WelcomeScreen";
import AddVehicle     from "./screens/AddVehicle";
import AddLicense     from "./screens/AddLicense";
import AssignDriver   from "./screens/AssignDriver";
import Dashboard      from "./screens/Dashboard";

const LOTTIE_URL =
  "https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json";

/* ─── Global form state ──────────────────────────────────────────────────── */
export interface FormData {
  email:             string;
  phone:             string;
  dialCode:          string;
  phoneCountryCode:  string;
  country:           string;
  fleetSize:         string;
}

interface OnboardingData {
  vehicleName:   string;
  plateNumber:   string;
  licenseNumber: string;
  driverName:    string;
  hasData:       boolean;
  wasSkipped:    boolean;
}

type RegStep = 1 | 2 | 3;
type AppView =
  | "login"
  | "forgot"
  | "register"
  | "success"
  | "welcome"
  | "add-vehicle"
  | "dashboard";

const INITIAL_FORM: FormData = {
  email:            "",
  phone:            "",
  dialCode:         "+234",
  phoneCountryCode: "NG",
  country:          "Nigeria",
  fleetSize:        "1-10 Vehicles",
};

const INITIAL_ONBOARDING: OnboardingData = {
  vehicleName:   "",
  plateNumber:   "",
  licenseNumber: "",
  driverName:    "",
  hasData:       false,
  wasSkipped:    false,
};

function getInitialView(): AppView {
  try {
    if (localStorage.getItem("flee_remember_me") === "true") {
      return localStorage.getItem("flee_first_time") === "true"
        ? "welcome"
        : "dashboard";
    }
  } catch (_) {}
  return "login";
}

function getStoredAdminName(): string {
  try { return localStorage.getItem("flee_admin_name") || "Lawal Rahman"; } catch (_) { return "Lawal Rahman"; }
}

/* ─── Step indicator ─────────────────────────────────────────────────────── */
function StepIndicator({ current }: { current: RegStep }) {
  const done = (n: number) => n <= current;

  function CircleBadge({ n }: { n: number }) {
    const complete = done(n);
    return (
      <div
        className={[
          "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
          "transition-all duration-300 ease-in-out",
          complete ? "bg-[#10B981]" : "bg-white border-2 border-[#D1D5DB]",
        ].join(" ")}
      >
        <Check
          size={14}
          strokeWidth={3}
          className={complete ? "text-white" : "text-[#D1D5DB]"}
        />
      </div>
    );
  }

  function Connector({ toStep }: { toStep: number }) {
    return (
      <div
        className={[
          "flex-1 h-[1.5px] transition-colors duration-300 ease-in-out",
          done(toStep) ? "bg-[#111827]" : "bg-[#E5E7EB]",
        ].join(" ")}
      />
    );
  }

  const labelCls = (n: number) =>
    [
      "text-[13px] font-semibold leading-snug",
      "transition-colors duration-300 ease-in-out",
      done(n) ? "text-[#10B981]" : "text-[#9CA3AF]",
    ].join(" ");

  return (
    <div className="w-full mb-8" aria-label={`Step ${current} of 3`}>
      <div className="flex items-center w-full">
        <CircleBadge n={1} />
        <Connector toStep={2} />
        <CircleBadge n={2} />
        <Connector toStep={3} />
        <CircleBadge n={3} />
      </div>
      <div className="grid grid-cols-3 mt-3">
        <span className={`${labelCls(1)} text-left`}>Workspace</span>
        <span className={`${labelCls(2)} text-center`}>Verify Email</span>
        <span className={`${labelCls(3)} text-right`}>Company Admin</span>
      </div>
    </div>
  );
}

/* ─── Success screen ─────────────────────────────────────────────────────── */
function SuccessScreen({ onGoToLogin }: { onGoToLogin: () => void }) {
  useEffect(() => {
    try { localStorage.setItem("flee_first_time", "true"); } catch (_) {}
  }, []);

  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden flex flex-col"
      style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
    >
      <div className="fixed left-0 top-0 h-screen w-[140px] sm:w-[180px] pointer-events-none z-10" aria-hidden="true">
        <Player autoplay loop src={LOTTIE_URL} style={{ height: "100%", width: "100%" }} />
      </div>
      <div className="fixed right-0 top-0 h-screen w-[140px] sm:w-[180px] pointer-events-none z-10" aria-hidden="true">
        <Player autoplay loop src={LOTTIE_URL} style={{ height: "100%", width: "100%" }} />
      </div>

      <header className="flex justify-center pt-7 flex-shrink-0">
        <FleeLogo />
      </header>

      <div className="flex-1 flex items-center justify-center px-6 relative z-20">
        <div className="flex flex-col items-center text-center gap-4">
          <span className="text-[56px] leading-none select-none" aria-hidden="true">🚀</span>
          <h1
            className="flex items-center gap-2 text-[22px] sm:text-[24px] font-bold text-gray-900"
            style={{ letterSpacing: "-0.2px" }}
          >
            <Car size={22} className="text-gray-800 flex-shrink-0" />
            Workspace Created
          </h1>
          <p className="text-[14.5px] text-gray-500 max-w-[320px] leading-relaxed">
            Workspace created, Login again to confirm your credentials
          </p>
          <button
            type="button"
            onClick={onGoToLogin}
            className="mt-3 h-[46px] px-10 text-[14.5px] font-semibold rounded-[12px]
                       bg-[#1E3A8A] text-white select-none
                       hover:brightness-110 active:scale-[0.98]
                       transition-all duration-200 ease-in-out"
          >
            Login
          </button>
        </div>
      </div>

      <div
        className="fixed bottom-0 right-0 pointer-events-none z-0 w-[180px] sm:w-[230px] md:w-[280px]"
        aria-hidden="true"
      >
        <CarIllustration />
      </div>
    </div>
  );
}

/* ─── Root app ───────────────────────────────────────────────────────────── */
export default function App() {
  const [view,        setView]        = useState<AppView>(getInitialView);
  const [regStep,     setRegStep]     = useState<RegStep>(1);
  const [vehicleStep, setVehicleStep] = useState<1 | 2 | 3>(1);
  const [formData,    setFormData]    = useState<FormData>(INITIAL_FORM);
  const [adminData,   setAdminData]   = useState<AdminData>(getInitialAdminData(""));
  const [onboarding,  setOnboarding]  = useState<OnboardingData>(INITIAL_ONBOARDING);
  const [adminName,   setAdminName]   = useState<string>(getStoredAdminName);

  function patchForm(patch: Partial<FormData>) {
    setFormData((p) => ({ ...p, ...patch }));
  }
  function patchAdmin(patch: Partial<AdminData>) {
    setAdminData((p) => ({ ...p, ...patch }));
  }
  function resetRegister() {
    setRegStep(1);
    setFormData(INITIAL_FORM);
    setAdminData(getInitialAdminData(""));
  }

  /* ── Login ────────────────────────────────────────────────────────────── */
  if (view === "login") {
    return (
      <LoginScreen
        onLogin={(rememberMe) => {
          try {
            if (rememberMe) localStorage.setItem("flee_remember_me", "true");
            else            localStorage.removeItem("flee_remember_me");
          } catch (_) {}
          const isFirstTime = (() => {
            try { return localStorage.getItem("flee_first_time") === "true"; } catch (_) { return false; }
          })();
          setAdminName(getStoredAdminName());
          setView(isFirstTime ? "welcome" : "dashboard");
        }}
        onForgotPassword={() => setView("forgot")}
        onRegister={() => { resetRegister(); setView("register"); }}
      />
    );
  }

  /* ── Forgot password ──────────────────────────────────────────────────── */
  if (view === "forgot") {
    return (
      <ForgotPassword
        onBack={() => setView("login")}
        onDone={() => setView("login")}
      />
    );
  }

  /* ── Success screen ───────────────────────────────────────────────────── */
  if (view === "success") {
    return (
      <SuccessScreen
        onGoToLogin={() => { resetRegister(); setView("login"); }}
      />
    );
  }

  /* ── Welcome ──────────────────────────────────────────────────────────── */
  if (view === "welcome") {
    return <WelcomeScreen onGetStarted={() => setView("add-vehicle")} />;
  }

  /* ── Add vehicle flow ─────────────────────────────────────────────────── */
  if (view === "add-vehicle") {
    function goToDashboard() {
      try { localStorage.removeItem("flee_first_time"); } catch (_) {}
      setVehicleStep(1);
      setView("dashboard");
    }

    if (vehicleStep === 1) {
      return (
        <AddVehicle
          onContinue={(vName, pNum) => {
            setOnboarding((p) => ({ ...p, vehicleName: vName, plateNumber: pNum }));
            setVehicleStep(2);
          }}
          onSkip={() => {
            setOnboarding((p) => ({ ...p, wasSkipped: true, hasData: false }));
            goToDashboard();
          }}
        />
      );
    }
    if (vehicleStep === 2) {
      return (
        <AddLicense
          onContinue={(lNum) => {
            setOnboarding((p) => ({ ...p, licenseNumber: lNum }));
            setVehicleStep(3);
          }}
          onSkip={() => {
            setOnboarding((p) => ({ ...p, wasSkipped: true, hasData: false }));
            goToDashboard();
          }}
        />
      );
    }
    return (
      <AssignDriver
        onContinue={(dName) => {
          setOnboarding((p) => ({ ...p, driverName: dName, hasData: true }));
          goToDashboard();
        }}
        onSkip={() => {
          setOnboarding((p) => ({ ...p, wasSkipped: true, hasData: false }));
          goToDashboard();
        }}
      />
    );
  }

  /* ── Dashboard ────────────────────────────────────────────────────────── */
  if (view === "dashboard") {
    return (
      <Dashboard
        onLogout={() => {
          try { localStorage.removeItem("flee_remember_me"); } catch (_) {}
          setOnboarding(INITIAL_ONBOARDING);
          setView("login");
        }}
        adminName={adminName}
        adminRole="Estate Manager"
        hasData={onboarding.hasData}
        vehicleName={onboarding.vehicleName}
        plateNumber={onboarding.plateNumber}
        driverName={onboarding.driverName}
      />
    );
  }

  /* ── Registration flow ────────────────────────────────────────────────── */
  return (
    <Shell>
      <StepIndicator current={regStep} />

      {regStep === 1 && (
        <Step1
          key="step1"
          data={formData}
          onChange={patchForm}
          onContinue={() => setRegStep(2)}
        />
      )}

      {regStep === 2 && (
        <Step2
          key="step2"
          email={formData.email}
          onVerified={() => {
            setAdminData(getInitialAdminData(formData.email));
            setRegStep(3);
          }}
          onChangeEmail={() => setRegStep(1)}
        />
      )}

      {regStep === 3 && (
        <Step3
          key="step3"
          prefillEmail={formData.email}
          data={adminData}
          onChange={patchAdmin}
          onSubmit={() => {
            const name = adminData.fullName.trim() || "Lawal Rahman";
            try { localStorage.setItem("flee_admin_name", name); } catch (_) {}
            setAdminName(name);
            setView("success");
          }}
        />
      )}
    </Shell>
  );
}
