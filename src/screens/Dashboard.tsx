import { useState } from "react";
import {
  LayoutDashboard,
  Car,
  Users,
  ClipboardList,
  Navigation,
  Globe,
  UserCircle,
  BarChart2,
  Settings,
  Bell,
  ScanLine,
  Search,
  SlidersHorizontal,
  Upload,
  Building2,
  CircleUser,
  Layers,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FleeLogo } from "../components/Branding";

/* ─── Types ────────────────────────────────────────────────────────────────── */
interface Props {
  onLogout: () => void;
  adminName: string;
  adminRole: string;
  hasData: boolean;
  vehicleName: string;
  plateNumber: string;
  driverName: string;
}

/* ─── Nav items ────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard"   },
  { icon: Car,             label: "Vehicles"    },
  { icon: Users,           label: "Drivers"     },
  { icon: ClipboardList,   label: "Assignments" },
  { icon: Navigation,      label: "Trips"       },
  { icon: Globe,           label: "Geofence"    },
  { icon: UserCircle,      label: "Users"       },
  { icon: BarChart2,       label: "Reports"     },
  { icon: Settings,        label: "Settings"    },
] as const;

/* ─── Initials helper ──────────────────────────────────────────────────────── */
function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ─── Metric card ──────────────────────────────────────────────────────────── */
function MetricCard({
  icon: Icon,
  label,
  count,
  growth,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  growth?: string;
}) {
  return (
    <div className="flex flex-col gap-3 p-5 border border-gray-200 rounded-2xl bg-white min-w-0">
      <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-[#1E3A8A]" />
      </div>
      <p className="text-[13px] text-gray-500 font-medium">{label}</p>
      <p className="text-[26px] font-bold text-gray-900 leading-none">{count}</p>
      {growth && (
        <p className="text-[12.5px] font-semibold text-emerald-500">{growth}</p>
      )}
    </div>
  );
}

/* ─── No-activity illustration ─────────────────────────────────────────────── */
function NoActivityIllustration() {
  return (
    <svg
      viewBox="0 0 300 230"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[260px] h-auto mx-auto select-none"
      aria-hidden="true"
    >
      <ellipse cx="150" cy="138" rx="112" ry="92" fill="#F3F4F6" />
      <rect x="62" y="168" width="166" height="20" rx="10" fill="#E5E7EB" />
      <rect x="74" y="143" width="148" height="20" rx="10" fill="#D1D5DB" />
      <circle cx="126" cy="110" r="50" fill="#FAFAFA" stroke="#C4C9D4" strokeWidth="7" />
      <line
        x1="163" y1="147" x2="196" y2="183"
        stroke="#C4C9D4" strokeWidth="9" strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Empty state body ─────────────────────────────────────────────────────── */
function EmptyStateBody() {
  return (
    <div className="border border-gray-200 rounded-2xl flex flex-col items-center py-12 px-8 gap-6">
      <p className="text-[17px] font-bold text-gray-800">No Recent Activity</p>
      <NoActivityIllustration />
    </div>
  );
}

/* ─── Status badge ─────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold
                 bg-emerald-50 text-emerald-600 border border-emerald-200"
    >
      {status}
    </span>
  );
}

/* ─── Populated state body ─────────────────────────────────────────────────── */
function PopulatedBody({
  vehicleName,
  plateNumber,
  driverName,
}: {
  vehicleName: string;
  plateNumber: string;
  driverName: string;
}) {
  const [search, setSearch] = useState("");
  const [currentPage] = useState(1);

  const allRows = [
    { id: vehicleName || "Fleet Asset", vehicle: plateNumber || "—", driver: driverName || "—", status: "Active", startTime: "10:21" },
    { id: vehicleName || "Fleet Asset", vehicle: plateNumber || "—", driver: driverName || "—", status: "Active", startTime: "10:21" },
    { id: vehicleName || "Fleet Asset", vehicle: plateNumber || "—", driver: driverName || "—", status: "Active", startTime: "10:21" },
    { id: vehicleName || "Fleet Asset", vehicle: plateNumber || "—", driver: driverName || "—", status: "Active", startTime: "10:21" },
  ];

  const filteredRows = allRows.filter(
    (r) =>
      search.trim() === "" ||
      [r.id, r.vehicle, r.driver].some((v) =>
        v.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      {/* Search + controls */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className="flex-1 relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for anything"
            className="w-full h-[42px] pl-9 pr-4 text-[13.5px] text-gray-700 bg-white
                       border border-gray-200 rounded-xl outline-none placeholder-gray-400
                       focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/[0.08]
                       transition-all duration-200"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 h-[42px] px-4 border border-gray-200 rounded-xl
                     text-[13.5px] text-gray-600 font-medium bg-white
                     hover:bg-gray-50 transition-colors duration-150 flex-shrink-0 outline-none"
        >
          <SlidersHorizontal size={15} className="text-gray-400" />
          Filter
        </button>
        <button
          type="button"
          className="flex items-center gap-2 h-[42px] px-4 border border-gray-200 rounded-xl
                     text-[13.5px] text-gray-600 font-medium bg-white
                     hover:bg-gray-50 transition-colors duration-150 flex-shrink-0 outline-none"
        >
          <Upload size={15} className="text-gray-400" />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-200">
              {["Trip ID", "Vehicle", "Driver", "Status", "Start Time", "Action"].map((col) => (
                <th
                  key={col}
                  className="px-5 py-3.5 text-left text-[13px] font-medium text-gray-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 last:border-b-0
                           hover:bg-gray-50/60 transition-colors duration-100"
              >
                <td className="px-5 py-4 text-[14px] text-gray-700">{row.id}</td>
                <td className="px-5 py-4 text-[14px] text-gray-700">{row.vehicle}</td>
                <td className="px-5 py-4 text-[14px] text-gray-700">{row.driver}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-5 py-4 text-[14px] text-gray-700">{row.startTime}</td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    className="px-4 py-1.5 border border-gray-200 rounded-lg text-[13px]
                               text-gray-700 font-medium hover:bg-gray-50
                               transition-colors duration-150 outline-none"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 text-[13px] text-gray-300
                     font-medium cursor-not-allowed select-none"
        >
          <ChevronLeft size={15} />
          Previous
        </button>

        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              type="button"
              className={[
                "w-8 h-8 rounded-lg text-[13px] font-medium transition-colors duration-150 outline-none",
                currentPage === p
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
          <span className="w-8 h-8 flex items-center justify-center text-[13px] text-gray-400">
            ...
          </span>
          {[8, 9, 10].map((p) => (
            <button
              key={p}
              type="button"
              className="w-8 h-8 rounded-lg text-[13px] font-medium text-gray-500
                         hover:bg-gray-100 transition-colors duration-150 outline-none"
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 h-[34px] px-4 border border-gray-200 rounded-lg
                     text-[13px] text-gray-700 font-medium hover:bg-gray-50
                     transition-colors duration-150 outline-none"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ─── Dashboard root ───────────────────────────────────────────────────────── */
export default function Dashboard({
  onLogout,
  adminName,
  adminRole,
  hasData,
  vehicleName,
  plateNumber,
  driverName,
}: Props) {
  const [activeNav, setActiveNav] = useState("Dashboard");

  const vehicleCount    = vehicleName ? 1 : 0;
  const driverCount     = driverName  ? 1 : 0;
  const assignmentCount = vehicleName && driverName ? 1 : 0;

  const METRICS = [
    { icon: Building2,  label: "Active Trips",  count: 0,              growth: undefined },
    { icon: Car,        label: "Vehicles",      count: vehicleCount,   growth: hasData && vehicleCount > 0 ? `+${vehicleCount} added` : undefined },
    { icon: CircleUser, label: "Drivers",       count: driverCount,    growth: hasData && driverCount > 0 ? `+${driverCount} added` : undefined },
    { icon: Layers,     label: "Assignments",   count: assignmentCount, growth: hasData && assignmentCount > 0 ? `+${assignmentCount} added` : undefined },
  ];

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
    >
      {/* ── Top header ────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 h-[68px] bg-white border-b border-gray-100 z-30
                   flex items-center px-8 gap-4"
      >
        <FleeLogo />

        <div className="flex-1" />

        <button
          type="button"
          aria-label="Scan"
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center
                     text-gray-400 hover:bg-gray-50 transition-colors duration-150 outline-none"
        >
          <ScanLine size={18} />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center
                     text-gray-400 hover:bg-gray-50 transition-colors duration-150 outline-none"
        >
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-3 ml-1">
          <div
            className="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center
                       text-white text-[13px] font-bold select-none flex-shrink-0"
          >
            {getInitials(adminName)}
          </div>
          <div className="leading-tight">
            <p className="text-[14px] font-bold text-gray-900 whitespace-nowrap">{adminName}</p>
            <p className="text-[12px] text-gray-400 whitespace-nowrap">{adminRole}</p>
          </div>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex pt-[68px] min-h-screen">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside
          className="fixed top-[68px] left-0 bottom-0 w-[220px] bg-white border-r border-gray-100
                     flex flex-col py-5 px-3 gap-1 z-20 overflow-y-auto"
        >
          {NAV_ITEMS.map(({ icon: Icon, label }) => {
            const isActive = activeNav === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveNav(label)}
                className={[
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-left w-full",
                  "text-[14px] font-medium transition-colors duration-150 outline-none select-none",
                  isActive
                    ? "bg-[#EFF6FF] text-[#1E3A8A]"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600",
                ].join(" ")}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.75} />
                {label}
              </button>
            );
          })}

          <div className="flex-1" />

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full mt-2
                       text-[14px] font-medium text-gray-400 outline-none select-none
                       hover:bg-red-50 hover:text-red-500 transition-colors duration-150"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Logout
          </button>
        </aside>

        {/* ── Main content ────────────────────────────────────────────────── */}
        <main className="ml-[220px] flex-1 p-8 flex flex-col gap-6 min-w-0">

          {/* Title row */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1
                className="text-[24px] font-bold text-gray-900 leading-tight"
                style={{ letterSpacing: "-0.3px" }}
              >
                Fleet OverView
              </h1>
              <p className="text-[14px] text-gray-400 mt-1">
                Real-time operational control center
              </p>
            </div>
            <button
              type="button"
              className="flex-shrink-0 h-[48px] px-8 bg-[#1E3A8A] text-white
                         text-[14.5px] font-semibold rounded-[12px] select-none
                         hover:brightness-110 active:scale-[0.98]
                         transition-all duration-200 ease-in-out"
            >
              Create Trip
            </button>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-4 gap-4">
            {METRICS.map((m) => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>

          {/* Content area */}
          {hasData ? (
            <PopulatedBody
              vehicleName={vehicleName}
              plateNumber={plateNumber}
              driverName={driverName}
            />
          ) : (
            <EmptyStateBody />
          )}
        </main>
      </div>
    </div>
  );
}
