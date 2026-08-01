import { useState } from "react";
import {
  Car,
  Bell,
  Moon,
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
import { LiveActivitySection } from "../components/LiveActivitySection";

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

/* ─── Custom SVG nav icons ─────────────────────────────────────────────────── */

/* Dashboard: 4-dot 2×2 grid */
function IconDashboard({ active }: { active: boolean }) {
  const fill = active ? "#1E3A8A" : "#9CA3AF";
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4.5"  cy="4.5"  r="2.5" fill={fill} />
      <circle cx="13.5" cy="4.5"  r="2.5" fill={fill} />
      <circle cx="4.5"  cy="13.5" r="2.5" fill={fill} />
      <circle cx="13.5" cy="13.5" r="2.5" fill={fill} />
    </svg>
  );
}

/* Vehicles: car frame silhouette */
function IconVehicles({ active }: { active: boolean }) {
  const s = active ? "#1E3A8A" : "#9CA3AF";
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
         stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M5 11L6.8 6.5a1 1 0 0 1 .93-.63h4.54a1 1 0 0 1 .93.63L15 11" />
      <rect x="2" y="11" width="16" height="4.5" rx="1.5" />
      <circle cx="6"  cy="15.5" r="1.2" fill={s} stroke="none" />
      <circle cx="14" cy="15.5" r="1.2" fill={s} stroke="none" />
      <path d="M2 13h1.5M16.5 13H18" />
    </svg>
  );
}

/* Drivers: steering wheel */
function IconDrivers({ active }: { active: boolean }) {
  const s = active ? "#1E3A8A" : "#9CA3AF";
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
         stroke={s} strokeWidth="1.5" strokeLinecap="round"
         xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring */}
      <circle cx="10" cy="10" r="8.25" />
      {/* Center hub */}
      <circle cx="10" cy="10" r="2.2" fill={s} strokeWidth="0" />
      {/* Three spokes at 90°, 210°, 330° */}
      <line x1="10"   y1="7.8"   x2="10"   y2="1.75" />
      <line x1="8.09" y1="11.1"  x2="2.76" y2="14.37" />
      <line x1="11.91" y1="11.1" x2="17.24" y2="14.37" />
    </svg>
  );
}

/* Assignments: document with person silhouette */
function IconAssignments({ active }: { active: boolean }) {
  const s = active ? "#1E3A8A" : "#9CA3AF";
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
         stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
         xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="14" height="16" rx="2" />
      {/* Person head */}
      <circle cx="10" cy="8" r="2.5" />
      {/* Person shoulders arc */}
      <path d="M6 15.5c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    </svg>
  );
}

/* Trips: car with route path */
function IconTrips({ active }: { active: boolean }) {
  const s = active ? "#1E3A8A" : "#9CA3AF";
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
         stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 9.5L5.9 5.8a1 1 0 0 1 .94-.63h4.32a1 1 0 0 1 .94.63l1.4 3.7" />
      <rect x="2" y="9.5" width="16" height="4" rx="1.5" />
      <circle cx="6"  cy="13.5" r="1.1" fill={s} stroke="none" />
      <circle cx="14" cy="13.5" r="1.1" fill={s} stroke="none" />
      {/* Path/route dots */}
      <circle cx="6"  cy="3.5" r="0.7" fill={s} stroke="none" />
      <line x1="6" y1="4.2" x2="6" y2="5.6" strokeDasharray="1 1" />
    </svg>
  );
}

/* Geofence: globe divided by lines */
function IconGeofence({ active }: { active: boolean }) {
  const s = active ? "#1E3A8A" : "#9CA3AF";
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
         stroke={s} strokeWidth="1.5" strokeLinecap="round"
         xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8.25" />
      {/* Equator */}
      <line x1="1.75" y1="10" x2="18.25" y2="10" />
      {/* Top arc (latitude) */}
      <path d="M2.5 6.5 Q10 4 17.5 6.5" />
      {/* Bottom arc */}
      <path d="M2.5 13.5 Q10 16 17.5 13.5" />
      {/* Central meridian */}
      <line x1="10" y1="1.75" x2="10" y2="18.25" />
    </svg>
  );
}

/* Users: person profile outline */
function IconUsers({ active }: { active: boolean }) {
  const s = active ? "#1E3A8A" : "#9CA3AF";
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
         stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
         xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="7" r="3.5" />
      <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" />
    </svg>
  );
}

/* Reports: rising bar chart with trendline */
function IconReports({ active }: { active: boolean }) {
  const s = active ? "#1E3A8A" : "#9CA3AF";
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
         stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
         xmlns="http://www.w3.org/2000/svg">
      <rect x="2"  y="12" width="3.5" height="6" rx="0.75" />
      <rect x="8.25" y="8" width="3.5" height="10" rx="0.75" />
      <rect x="14.5" y="4" width="3.5" height="14" rx="0.75" />
      <path d="M3.75 11.5 L10 7.5 L16.25 3.5" strokeDasharray="0" />
    </svg>
  );
}

/* Settings: cog wheel */
function IconSettings({ active }: { active: boolean }) {
  const s = active ? "#1E3A8A" : "#9CA3AF";
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
         stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
         xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2
               M4.22 4.22l1.41 1.41M14.37 14.37l1.41 1.41
               M4.22 15.78l1.41-1.41M14.37 5.63l1.41-1.41" />
    </svg>
  );
}

/* ─── Nav items config ────────────────────────────────────────────────────── */
const NAV_CONFIG = [
  { id: "Dashboard",   renderIcon: (a: boolean) => <IconDashboard   active={a} /> },
  { id: "Vehicles",    renderIcon: (a: boolean) => <IconVehicles    active={a} /> },
  { id: "Drivers",     renderIcon: (a: boolean) => <IconDrivers     active={a} /> },
  { id: "Assignments", renderIcon: (a: boolean) => <IconAssignments active={a} /> },
  { id: "Trips",       renderIcon: (a: boolean) => <IconTrips       active={a} /> },
  { id: "Geofence",    renderIcon: (a: boolean) => <IconGeofence    active={a} /> },
  { id: "Users",       renderIcon: (a: boolean) => <IconUsers       active={a} /> },
  { id: "Reports",     renderIcon: (a: boolean) => <IconReports     active={a} /> },
  { id: "Settings",    renderIcon: (a: boolean) => <IconSettings    active={a} /> },
];

/* ─── Initials helper ──────────────────────────────────────────────────────── */
function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
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
    <div className="flex flex-col gap-4 py-4 px-1.5 rounded-2xl bg-white min-w-0">
      <div className="w-[30px] h-[30px] rounded-[4px] bg-[#EFF6FF] border-[0.5px] border-[#BFDBFE] flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-[#1E3A8A]" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-normal leading-[150%]" style={{ color: "rgba(11,11,11,0.45)" }}>{label}</p>
        <p
          className="text-[22px] font-semibold leading-[130%]"
          style={{ color: "rgba(11,11,11,0.7)", letterSpacing: "-0.002em" }}
        >
          {count}
        </p>
        {growth && <p className="text-[12.5px] font-semibold text-emerald-500">{growth}</p>}
      </div>
    </div>
  );
}

/* ─── Empty state ──────────────────────────────────────────────────────────── */
function EmptyStateBody() {
  return (
    <div className="border border-gray-200 rounded-2xl flex flex-col items-center py-12 px-8 gap-6">
      <p className="text-[17px] font-bold text-gray-800">No Recent Activity</p>
      <img
        src="/image copy copy copy copy.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="w-[280px] h-auto select-none"
      />
    </div>
  );
}

/* ─── Status badge ─────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="inline-flex items-center px-3 py-[5px] rounded-[6px] text-[14px] font-normal leading-[150%]"
      style={{
        background: "#CCEEDD",
        color: "#106900",
        border: "0.8px solid rgba(16,105,0,0.4)",
        letterSpacing: "0.0025em",
      }}
    >
      {status}
    </span>
  );
}

/* ─── Populated table body ─────────────────────────────────────────────────── */
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
    <div className="flex flex-col gap-6">
      <LiveActivitySection />

      <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className="flex-1 relative">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for anything"
            className="w-full h-[39px] pl-11 pr-4 text-[18px] font-normal leading-[150%] text-gray-700 bg-white
                       border border-[#DFE3EA] rounded-[8px] outline-none placeholder-[#A1A5AA]
                       focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/[0.08]
                       transition-all duration-200"
          />
        </div>
        <button type="button"
          className="flex items-center gap-1 h-[39px] px-3 rounded-[7px]
                     text-[14px] font-normal bg-white
                     hover:bg-gray-50 transition-colors duration-150 flex-shrink-0 outline-none"
          style={{ border: "0.7px solid rgba(148,163,184,0.3)", color: "rgba(129,130,134,0.9)", letterSpacing: "0.0025em" }}>
          <SlidersHorizontal size={15} style={{ color: "rgba(129,130,134,0.9)" }} />
          Filter
        </button>
        <button type="button"
          className="flex items-center gap-1 h-[39px] px-3 rounded-[7px]
                     text-[14px] font-normal bg-white
                     hover:bg-gray-50 transition-colors duration-150 flex-shrink-0 outline-none"
          style={{ border: "0.7px solid rgba(148,163,184,0.3)", color: "rgba(129,130,134,0.9)", letterSpacing: "0.0025em" }}>
          <Upload size={15} style={{ color: "rgba(129,130,134,0.9)" }} />
          Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr style={{ background: "rgba(246,248,250,0.2)", borderTop: "1px solid rgba(58,58,58,0.2)", borderBottom: "1px solid rgba(58,58,58,0.2)" }}>
              {["Trip ID", "Vehicle", "Driver", "Status", "Start Time", "Action"].map((col) => (
                <th key={col} className="px-5 py-3.5 text-left text-[20px] font-normal leading-[150%] text-[#3A3A3A]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, i) => (
              <tr key={i} className="border-b border-[#E2E8F0] last:border-b-0
                                     hover:bg-gray-50/60 transition-colors duration-100">
                <td className="px-2.5 py-5 text-[18px] font-normal leading-[150%] text-[#4B4F55]">{row.id}</td>
                <td className="px-2.5 py-5 text-[18px] font-normal leading-[150%]" style={{ color: "rgba(11,11,11,0.7)" }}>{row.vehicle}</td>
                <td className="px-2.5 py-5 text-[18px] font-normal leading-[150%] text-[#4B4F55]">{row.driver}</td>
                <td className="px-2.5 py-5"><StatusBadge status={row.status} /></td>
                <td className="px-2.5 py-5 text-[18px] font-normal leading-[150%]" style={{ color: "rgba(11,11,11,0.6)" }}>{row.startTime}</td>
                <td className="px-2.5 py-5">
                  <button type="button"
                    className="px-3 py-1.5 rounded-[7px] text-[14px] font-normal leading-[150%]
                               hover:bg-blue-50/50 transition-colors duration-150 outline-none"
                    style={{ border: "0.8px solid #1F6FEB", color: "#2563EB", letterSpacing: "0.0025em" }}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
        <button type="button" disabled
          className="flex items-center gap-1.5 text-[14px] font-medium leading-[20px] cursor-not-allowed select-none opacity-40"
          style={{ fontFamily: "Inter, sans-serif", color: "#818286" }}>
          <ChevronLeft size={15} />
          Previous
        </button>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <button key={p} type="button"
              className="w-10 h-10 rounded-[8px] text-[14px] font-medium leading-[20px] transition-colors duration-150 outline-none"
              style={{
                fontFamily: "Inter, sans-serif",
                background: currentPage === p ? "#EFF6FF" : "transparent",
                color: currentPage === p ? "#1E3A8A" : "#667085",
              }}>
              {p}
            </button>
          ))}
          <span className="w-10 h-10 flex items-center justify-center text-[14px]" style={{ fontFamily: "Inter, sans-serif", color: "#667085" }}>...</span>
          {[8, 9, 10].map((p) => (
            <button key={p} type="button"
              className="w-10 h-10 rounded-[8px] text-[14px] font-medium leading-[20px] hover:bg-gray-100 transition-colors duration-150 outline-none"
              style={{ fontFamily: "Inter, sans-serif", color: "#667085" }}>
              {p}
            </button>
          ))}
        </div>
        <button type="button"
          className="flex items-center gap-2 h-[43px] px-3.5 rounded-[8px] shadow-sm
                     text-[18px] font-normal leading-[150%] hover:bg-gray-50 transition-colors duration-150 outline-none"
          style={{ border: "1px solid #D0D5DD", color: "#344054" }}>
          Next <ChevronRight size={15} />
        </button>
      </div>
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
    { icon: CircleUser, label: "Drivers",       count: driverCount,    growth: hasData && driverCount > 0  ? `+${driverCount} added`  : undefined },
    { icon: Layers,     label: "Assignments",   count: assignmentCount, growth: hasData && assignmentCount > 0 ? `+${assignmentCount} added` : undefined },
  ];

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
    >
      {/* ── Top header ─────────────────────────────────────────────────────── */}
      {/*
          Left-side content (FLEE logo) starts at exactly 124px from the
          viewport's left edge, matching the sidebar nav items' left origin.
      */}
      <header
        className="fixed top-0 left-0 right-0 h-[68px] bg-white border-b border-gray-100 z-30
                   flex items-center gap-6 pr-10"
        style={{ paddingLeft: 124 }}
      >
        <FleeLogo />

        <div className="flex items-center justify-between gap-2.5 w-[441px] h-[46px] px-2.5 py-1.5
                        bg-[#F8FAFC] border-[0.8px] border-[#E2E8F0] rounded-[8px] flex-shrink-0">
          <span className="text-[18px] font-normal leading-[150%] text-[#94A3B8]">Search</span>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center px-1.5 h-[21px] rounded-[4px] text-[14px]
                             text-[#C2C2C2]" style={{ background: "rgba(156,163,175,0.07)" }}>
              ctrl
            </span>
            <span className="text-[12px] text-[#475569]">or</span>
            <span className="text-[14px] text-[#1A1D21] font-normal">⌘K</span>
          </div>
        </div>

        <div className="flex-1" />

        <button type="button" aria-label="Toggle theme"
          className="w-[41px] h-[41px] rounded-full bg-[#E5E7EB] flex items-center justify-center
                     text-[#141B34] hover:brightness-95 transition-all duration-150 outline-none">
          <Moon size={16} />
        </button>
        <button type="button" aria-label="Notifications"
          className="ml-3 w-[41px] h-[41px] rounded-full bg-[#E5E7EB] flex items-center justify-center
                     text-[#141B34] hover:brightness-95 transition-all duration-150 outline-none">
          <Bell size={16} />
        </button>

        <div className="flex items-center gap-3 ml-4">
          <div className="relative w-10 h-10 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#1E3A8A] flex items-center justify-center
                            text-white text-[13px] font-bold select-none">
              {getInitials(adminName)}
            </div>
            <span className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full bg-[#3DA172]
                             border-2 border-white" />
          </div>
          <div className="leading-tight">
            <p className="text-[18px] font-normal text-[#0B0B0B] leading-[150%] whitespace-nowrap">{adminName}</p>
            <p className="text-[16px] font-normal leading-[150%] whitespace-nowrap" style={{ color: "rgba(11,11,11,0.45)" }}>{adminRole}</p>
          </div>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex pt-[68px] min-h-screen">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        {/*
            Fixed left sidebar. Total width = 310px.
            paddingLeft: 124px positions all nav item content at exactly
            124px from the viewport's left edge as annotated in the spec.
        */}
        <aside
          className="fixed top-[68px] left-0 bottom-0 w-[310px] bg-white
                     flex flex-col py-5 gap-0.5 z-20 overflow-y-auto"
          style={{ paddingLeft: 124 }}
        >
          {NAV_CONFIG.map(({ id, renderIcon }) => {
            const isActive = activeNav === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveNav(id)}
                className={[
                  "flex items-center gap-3 pl-3 pr-4 py-2.5 text-left",
                  "text-[16px] font-normal leading-[150%] transition-all duration-150 outline-none select-none",
                  isActive
                    ? "bg-[#DBEAFE] text-[#1E3A8A] border-[0.5px] border-[#2563EB] rounded-[6px]"
                    : "hover:bg-gray-50 rounded-[10px] border border-transparent",
                ].join(" ")}
                style={!isActive ? { color: "rgba(11,11,11,0.25)" } : undefined}
              >
                {renderIcon(isActive)}
                {id}
              </button>
            );
          })}

          <div className="flex-1" />

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-xl mt-2
                       text-[14px] font-medium text-[#9CA3AF] outline-none select-none
                       hover:bg-red-50 hover:text-red-500 transition-colors duration-150"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Logout
          </button>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="ml-[310px] flex-1 p-8 flex flex-col gap-6 min-w-0">

          {/* Title + CTA row */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1
                className="text-[24px] font-semibold text-[#1A1D21] leading-[130%]"
                style={{ letterSpacing: "-0.002em" }}
              >
                Fleet OverView
              </h1>
              <p className="text-[18px] font-normal text-[#6E7277] leading-[150%] mt-1">
                Real-time operational control center
              </p>
            </div>
            <button
              type="button"
              className="flex-shrink-0 h-[50px] px-6 bg-[#1E3A8A] text-white border-[0.5px] border-[#E5E7EB]
                         text-[20px] font-semibold leading-[130%] rounded-[12px] select-none
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

          {/* Content state */}
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