import { useState, useRef, useEffect, DragEvent } from "react";
import { Check, Upload, X } from "lucide-react";
import { Shell } from "../components/Shell";
import { Field, INPUT_BASE, PrimaryButton } from "../components/FormControls";

interface Props {
  onContinue: (vehicleName: string, plateNumber: string) => void;
  onSkip: () => void;
}

interface ImageFile {
  file: File;
  url:  string;
}

const PLATE_RE       = /^[A-Z0-9-]*$/;
const MAX_IMAGES     = 2;
const PLATE_MAX_LEN  = 10;
const ACCEPT_MIME    = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/* ── Vehicle creation stepper (all gray) ─────────────────────────────── */
function VehicleStepper() {
  const steps = ["Add Vehicle", "Add License", "Assign Driver"];

  return (
    <div className="w-full mb-7">
      {/* Circles + lines */}
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

      {/* Labels */}
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

export default function AddVehicle({ onContinue, onSkip }: Props) {
  const [plateNumber,  setPlateNumber]  = useState("");
  const [vehicleName,  setVehicleName]  = useState("");
  const [images,       setImages]       = useState<ImageFile[]>([]);
  const [plateFlash,   setPlateFlash]   = useState(false);
  const [isDragging,   setIsDragging]   = useState(false);

  const flashTm    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid =
    plateNumber.trim().length > 0 &&
    vehicleName.trim().length > 0 &&
    images.length > 0;

  useEffect(() => {
    return () => {
      if (flashTm.current) clearTimeout(flashTm.current);
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, []);

  /* ── Plate validation ─────────────────────────────────────────────── */
  function triggerPlateFlash() {
    setPlateFlash(true);
    if (flashTm.current) clearTimeout(flashTm.current);
    flashTm.current = setTimeout(() => setPlateFlash(false), 1000);
  }

  function handlePlateChange(raw: string) {
    const upper = raw.toUpperCase();

    /* Reject non-alphanumeric / non-hyphen characters */
    if (!PLATE_RE.test(upper)) {
      triggerPlateFlash();
      setPlateNumber(upper.replace(/[^A-Z0-9-]/g, ""));
      return;
    }

    /* Reject overflow */
    if (upper.length > PLATE_MAX_LEN) {
      triggerPlateFlash();
      setPlateNumber(upper.slice(0, PLATE_MAX_LEN));
      return;
    }

    setPlateNumber(upper);
  }

  /* ── Image handling ───────────────────────────────────────────────── */
  function processFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    const valid = arr
      .filter((f) => ACCEPT_MIME.includes(f.type))
      .slice(0, MAX_IMAGES - images.length);

    if (valid.length === 0) return;

    const newImages: ImageFile[] = valid.map((f) => ({
      file: f,
      url:  URL.createObjectURL(f),
    }));

    setImages((prev) => [...prev, ...newImages].slice(0, MAX_IMAGES));
  }

  function removeImage(idx: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  }

  /* Drag events */
  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }
  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  }
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (images.length >= MAX_IMAGES) return;
    processFiles(e.dataTransfer.files);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";   // allow re-selecting the same file
  }

  function openFilePicker() {
    if (images.length < MAX_IMAGES) fileInputRef.current?.click();
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
            Add Your First Vehicle
          </h1>
          <p className="text-[15px] text-gray-500 mt-1">Create Your Fleet Workspace</p>
        </div>

        {/* 3-step vehicle stepper */}
        <VehicleStepper />

        {/* Plate Number */}
        <Field label="Plate Number">
          <input
            type="text"
            value={plateNumber}
            onChange={(e) => handlePlateChange(e.target.value)}
            placeholder="e.g. LG123AB"
            className={[
              INPUT_BASE,
              "font-mono tracking-wider uppercase",
              plateFlash ? "!border-red-500 ring-2 ring-red-300/30" : "",
            ].join(" ")}
          />
        </Field>

        {/* Image uploader */}
        <div>
          <label className="block text-[14px] font-medium text-gray-700 mb-2">
            Add Vehicle image
          </label>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Uploaded thumbnails */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((img, i) => (
                <div key={i} className="relative flex-shrink-0">
                  <img
                    src={img.url}
                    alt={`Vehicle ${i + 1}`}
                    className="w-[88px] h-[88px] object-cover rounded-xl border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-[22px] h-[22px] rounded-full
                               bg-red-500 text-white flex items-center justify-center
                               hover:bg-red-600 transition-colors duration-150 shadow"
                    aria-label="Remove image"
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone – hide once max reached */}
          {images.length < MAX_IMAGES && (
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openFilePicker()}
              onClick={openFilePicker}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={[
                "rounded-2xl border-2 border-dashed px-6 py-8",
                "flex flex-col items-center gap-3 cursor-pointer outline-none",
                "transition-all duration-200 ease-in-out select-none",
                isDragging
                  ? "border-[#1E3A8A] bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100/60",
              ].join(" ")}
              aria-label="Upload vehicle image"
            >
              {/* Upload icon box */}
              <div className="w-11 h-11 rounded-xl bg-white border border-gray-200
                              shadow-sm flex items-center justify-center flex-shrink-0">
                <Upload size={18} className="text-gray-500" />
              </div>

              {/* "Upload" pill label */}
              <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full
                              border border-gray-300 bg-white text-[13px] text-gray-600 font-medium">
                <Upload size={12} className="text-gray-400" />
                Upload
              </div>

              <p className="text-[14px] text-gray-500 text-center leading-snug">
                Choose images or drag &amp; drop it here
              </p>
              <p className="text-[12.5px] text-gray-400 text-center">
                JPG, JPEG, PNG and WEBP .{" "}
                <span className="text-[#1E3A8A] font-medium">Max {MAX_IMAGES} pics</span>
              </p>
            </div>
          )}
        </div>

        {/* Vehicle Name */}
        <Field label="Vehicle Name">
          <input
            type="text"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
            placeholder="e.g. Toyota Corolla"
            className={INPUT_BASE}
          />
        </Field>

        {/* Actions */}
        <div className="flex items-center justify-end gap-5 pt-2">
          <button
            type="button"
            onClick={onSkip}
            className="text-[14.5px] font-semibold text-[#1E3A8A] transition-colors duration-150
                       hover:text-[#1E3A8A]/70 outline-none"
          >
            Skip
          </button>
          <PrimaryButton disabled={!isValid} onClick={() => onContinue(vehicleName, plateNumber)}>
            Continue
          </PrimaryButton>
        </div>
      </div>
    </Shell>
  );
}
