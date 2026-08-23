import { useState, useEffect, useRef, useMemo } from "react";
import {
  Briefcase, MapPin, Clock, DollarSign, Users, ArrowRight, ArrowLeft,
  CheckCircle2, Circle, ChevronRight, Upload, FileText, Linkedin, Globe,
  Bell, Settings, User, LayoutDashboard, Calendar, Video, LogOut, Moon,
  Sun, X, Check, AlertCircle, FastForward, Search, GraduationCap,
  Sparkles, Building2, Code2, Palette, Headphones, Menu, Mail, Phone,
  MapPinned, ShieldCheck, Timer, PlayCircle, XCircle, RotateCcw, Plus,
  ChevronDown, TrendingUp, HelpCircle,
} from "lucide-react";

/* ---------------- Design tokens ---------------- */
const palette = {
  light: {
    bg: "#FFF8ED", surface: "#FFFFFF", surfaceAlt: "#FFF1DC", surfaceRaised: "#FFFFFF",
    border: "#F5E3C6", borderStrong: "#EFD3A3",
    text: "#2B1D0E", textMuted: "#8A7256", textFaint: "#B8A483",
    primary: "#F2994A", primaryHover: "#E07F2A", primarySoft: "#FFEBD2", primaryText: "#C4671A",
    accent: "#FFC94A", accentSoft: "#FFF3CF", accentText: "#8A6A05",
    success: "#2FA36B", successSoft: "#E5F7EE", successText: "#1E7A4E",
    danger: "#E2574C", dangerSoft: "#FDEAE8", dangerText: "#B93F35",
    info: "#4A90D9", infoSoft: "#E9F2FC", infoText: "#2A6DAE",
    shadow: "0 1px 2px rgba(60,35,5,0.04), 0 10px 28px rgba(60,35,5,0.08)",
  },
  dark: {
    bg: "#1C130A", surface: "#26190D", surfaceAlt: "#301F0F", surfaceRaised: "#2C1D0F",
    border: "#3D2A15", borderStrong: "#503820",
    text: "#FBF0DF", textMuted: "#D3B892", textFaint: "#98805F",
    primary: "#FFA555", primaryHover: "#FFB670", primarySoft: "#3A2712", primaryText: "#FFB670",
    accent: "#FFD166", accentSoft: "#3A2F10", accentText: "#FFDD8C",
    success: "#4EC98A", successSoft: "#12301F", successText: "#7FE0AC",
    danger: "#F0847A", dangerSoft: "#3A1D19", dangerText: "#F5A199",
    info: "#7CB3E8", infoSoft: "#152436", infoText: "#A9CFF2",
    shadow: "0 1px 2px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.45)",
  },
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');`;

/* ---------------- Mock data ---------------- */
const JOBS = [
  {
    id: "accountant", title: "Senior Accountant", dept: "Finance", icon: Building2,
    location: "Riyadh, Saudi Arabia", type: "Full-time", level: "Mid-Senior",
    salary: "SAR 8,000 – 12,000", applicants: 42, posted: "5 days ago",
    description: "We're looking for a detail-oriented Senior Accountant to manage day-to-day financial operations, ensure compliance with local regulations, and support month-end close for a fast-growing regional business.",
    responsibilities: [
      "Own the monthly and quarterly close process end to end",
      "Prepare VAT filings and ensure ZATCA compliance",
      "Reconcile accounts and maintain the general ledger",
      "Partner with the finance lead on budgeting and forecasting",
    ],
    requirements: [
      "Bachelor's degree in Accounting or Finance",
      "4+ years of experience in a similar role",
      "Strong knowledge of IFRS and Saudi VAT regulations",
      "Advanced Excel skills",
    ],
    skills: ["IFRS", "VAT / ZATCA", "Excel", "ERP Systems", "Reconciliation"],
    benefits: ["Health insurance", "Annual flight ticket", "Performance bonus", "Hybrid schedule"],
    questions: [
      { id: "exp_years", label: "Years of accounting experience", type: "number" },
      { id: "erp", label: "Which ERP systems have you used?", type: "text" },
      { id: "excel", label: "Excel proficiency level", type: "select", options: ["Basic", "Intermediate", "Advanced", "Expert"] },
      { id: "vat", label: "Do you have VAT / ZATCA experience?", type: "yesno" },
      { id: "ifrs", label: "Do you have IFRS experience?", type: "yesno" },
      { id: "software", label: "Accounting software you're proficient in", type: "text" },
    ],
  },
  {
    id: "designer", title: "Product Designer", dept: "Design", icon: Palette,
    location: "Remote", type: "Full-time", level: "Mid-level",
    salary: "Competitive", applicants: 65, posted: "2 days ago",
    description: "Join our product team to design end-to-end experiences across web and mobile. You'll work closely with engineering and product to ship thoughtful, high-craft interfaces.",
    responsibilities: [
      "Design flows, wireframes, and high-fidelity UI",
      "Maintain and evolve our design system",
      "Run lightweight usability tests with real users",
      "Collaborate closely with engineers during implementation",
    ],
    requirements: [
      "3+ years of product design experience",
      "A strong portfolio showing shipped work",
      "Comfortable working in fast-moving teams",
      "Experience with design systems",
    ],
    skills: ["Figma", "Prototyping", "Design Systems", "User Research"],
    benefits: ["Remote-first", "Learning budget", "Flexible hours", "Equipment provided"],
    questions: [
      { id: "tools", label: "Design tools you use daily", type: "text" },
      { id: "portfolio_highlight", label: "Describe your strongest shipped project", type: "textarea" },
      { id: "systems", label: "Have you built or maintained a design system?", type: "yesno" },
    ],
  },
  {
    id: "engineer", title: "Backend Engineer (Node.js)", dept: "Engineering", icon: Code2,
    location: "Riyadh, Saudi Arabia · Hybrid", type: "Full-time", level: "Senior",
    salary: "SAR 14,000 – 18,000", applicants: 31, posted: "1 week ago",
    description: "We're hiring a Senior Backend Engineer to help scale our core platform. You'll design services, own reliability, and mentor junior engineers along the way.",
    responsibilities: [
      "Design and build scalable backend services",
      "Own API reliability, monitoring, and performance",
      "Review code and mentor junior engineers",
      "Collaborate with product on technical scoping",
    ],
    requirements: [
      "5+ years building production backend systems",
      "Strong experience with Node.js and PostgreSQL",
      "Comfortable with system design discussions",
      "Experience with cloud infrastructure",
    ],
    skills: ["Node.js", "PostgreSQL", "System Design", "AWS", "REST APIs"],
    benefits: ["Health insurance", "Hybrid schedule", "Relocation support", "Stock options"],
    questions: [
      { id: "stack", label: "Backend stack experience", type: "text" },
      { id: "db", label: "Databases you've worked with", type: "text" },
      { id: "sysdesign", label: "Comfortable with system design interviews?", type: "yesno" },
    ],
  },
  {
    id: "cs", title: "Customer Success Specialist", dept: "Operations", icon: Headphones,
    location: "Riyadh, Saudi Arabia", type: "Full-time", level: "Junior",
    salary: "SAR 5,500 – 7,000", applicants: 58, posted: "3 days ago",
    description: "You'll be the first point of contact for our customers — helping them onboard, resolving issues quickly, and gathering feedback that shapes the product.",
    responsibilities: [
      "Respond to customer inquiries across channels",
      "Onboard new customers and guide first use",
      "Track recurring issues and share feedback with product",
      "Maintain a high customer satisfaction score",
    ],
    requirements: [
      "1+ years in a customer-facing role",
      "Excellent written and spoken communication",
      "Comfortable with CRM tools",
      "Available for rotating shifts",
    ],
    skills: ["CRM", "Communication", "Problem Solving"],
    benefits: ["Health insurance", "Transport allowance", "Growth path"],
    questions: [
      { id: "crm", label: "CRM tools experience", type: "text" },
      { id: "languages", label: "Languages you speak fluently", type: "text" },
      { id: "shifts", label: "Available for rotating shifts?", type: "yesno" },
    ],
  },
];

const STAGES = [
  { key: "SUBMITTED", label: "Submitted" },
  { key: "RECEIVED", label: "Received" },
  { key: "CV_VIEWED", label: "CV Viewed" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
  { key: "INTERVIEW_COMPLETED", label: "Interview Completed" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "DECISION", label: "Decision" },
];

const PAST_APPLICATIONS = [
  { id: "APP-10231", job: "Marketing Coordinator", date: "12 Jun 2026", status: "REJECTED" },
  { id: "APP-10390", job: "Junior Accountant", date: "30 Jul 2026", status: "UNDER_REVIEW" },
];

/* ---------------- Small helpers ---------------- */
function cn(...a) { return a.filter(Boolean).join(" "); }

function statusColors(c, status) {
  if (status === "ACCEPTED") return { bg: c.successSoft, text: c.successText };
  if (status === "REJECTED") return { bg: c.dangerSoft, text: c.dangerText };
  if (status === "DECISION" || status === "UNDER_REVIEW") return { bg: c.infoSoft, text: c.infoText };
  if (status === "INTERVIEW_SCHEDULED" || status === "INTERVIEW_COMPLETED") return { bg: c.accentSoft, text: c.accentText };
  return { bg: c.primarySoft, text: c.primaryText };
}

function fmtHMS(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

/* ---------------- Pipeline rail (signature element) ---------------- */
function PipelineRail({ c, steps, activeIndex, orientation = "horizontal", size = "md" }) {
  const isH = orientation === "horizontal";
  return (
    <div style={{ display: "flex", flexDirection: isH ? "row" : "column", width: "100%" }}>
      {steps.map((s, i) => {
        const done = i < activeIndex;
        const current = i === activeIndex;
        const nodeColor = done ? c.success : current ? c.primary : c.borderStrong;
        const nodeBg = done ? c.successSoft : current ? c.primarySoft : "transparent";
        return (
          <div key={s.key || s} className={isH ? "flex-1 flex flex-col items-center" : "flex flex-row items-start gap-3 pb-6"}>
            <div className={isH ? "flex items-center w-full" : "flex flex-col items-center"}>
              {!isH && (
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 999, border: `2px solid ${nodeColor}`,
                    background: nodeBg, display: "flex", alignItems: "center", justifyContent: "center",
                    color: nodeColor, position: "relative", flexShrink: 0,
                  }}
                >
                  {done ? <Check size={16} /> : current ? (
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: nodeColor, display: "block" }} className={current ? "pulse-dot" : ""} />
                  ) : <Circle size={8} fill={nodeColor} color={nodeColor} />}
                </div>
              )}
              {isH && (
                <>
                  {i !== 0 && <div style={{ flex: 1, height: 2, background: done || current ? c.success : c.border }} />}
                  <div
                    style={{
                      width: 30, height: 30, borderRadius: 999, border: `2px solid ${nodeColor}`,
                      background: nodeBg, display: "flex", alignItems: "center", justifyContent: "center",
                      color: nodeColor, flexShrink: 0,
                    }}
                  >
                    {done ? <Check size={14} /> : current ? <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: 999, background: nodeColor, display: "block" }} /> : <Circle size={7} fill={nodeColor} color={nodeColor} />}
                  </div>
                  {i !== steps.length - 1 && <div style={{ flex: 1, height: 2, background: done ? c.success : c.border }} />}
                </>
              )}
            </div>
            <div className={isH ? "mt-2 text-center px-1" : ""}>
              <p style={{
                color: current ? c.text : done ? c.textMuted : c.textFaint,
                fontWeight: current ? 600 : 500, fontSize: size === "sm" ? 11 : 12.5,
                lineHeight: 1.3, maxWidth: isH ? 88 : "none",
              }}>{s.label || s}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Navbar ---------------- */
function Navbar({ c, theme, setTheme, view, setView, applied }) {
  return (
    <div style={{ borderBottom: `1px solid ${c.border}`, background: c.surface + "F2", backdropFilter: "blur(10px)" }} className="sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <button onClick={() => setView("landing")} className="flex items-center gap-2">
          <div style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.accent})` }} className="w-8 h-8 rounded-xl flex items-center justify-center">
            <Sparkles size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: "Sora", color: c.text, fontWeight: 700 }} className="text-lg">HireFlow</span>
        </button>
        <div className="hidden md:flex items-center gap-7">
          <button onClick={() => setView("landing")} style={{ color: c.textMuted }} className="text-sm font-medium hover:opacity-80">Jobs</button>
          <a href="#how" style={{ color: c.textMuted }} className="text-sm font-medium hover:opacity-80">How it works</a>
          <a href="#faq" style={{ color: c.textMuted }} className="text-sm font-medium hover:opacity-80">FAQ</a>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            style={{ border: `1px solid ${c.border}`, color: c.textMuted }}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          {applied ? (
            <button
              onClick={() => setView("dashboard")}
              style={{ background: c.primary, color: "#fff" }}
              className="text-sm font-semibold px-4 h-9 rounded-full flex items-center gap-1.5"
            >
              <LayoutDashboard size={14} /> My Applications
            </button>
          ) : (
            <button
              onClick={() => setView("auth")}
              style={{ border: `1px solid ${c.borderStrong}`, color: c.text }}
              className="text-sm font-semibold px-4 h-9 rounded-full"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Landing ---------------- */
function Landing({ c, theme, setView, openJob }) {
  const [q, setQ] = useState("");
  const filtered = JOBS.filter(j => (j.title + j.dept + j.location).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-8 pb-14 md:pt-10 md:pb-20">
        <div
          style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`, borderRadius: 40 }}
          className="relative overflow-hidden px-6 md:px-14 pt-12 pb-16 md:pt-16 md:pb-24"
        >
          {/* decorative blobs */}
          <div style={{ background: "rgba(255,255,255,0.16)" }} className="absolute -top-16 -left-16 w-64 h-64 rounded-full" />
          <div style={{ background: "rgba(255,255,255,0.14)" }} className="absolute -bottom-24 -right-10 w-80 h-80 rounded-full" />
          <div style={{ background: "rgba(255,255,255,0.12)" }} className="absolute top-10 right-24 w-24 h-24 rounded-full hidden md:block" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div style={{ background: "rgba(255,255,255,0.22)", color: "#fff" }} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                <Sparkles size={13} /> Hire smarter. Move faster.
              </div>
              <h1 style={{ fontFamily: "Sora", color: "#fff", lineHeight: 1.08 }} className="text-4xl md:text-5xl font-bold tracking-tight">
                Find your next opportunity
              </h1>
              <p style={{ color: "rgba(255,255,255,0.9)" }} className="mt-5 text-base md:text-lg leading-relaxed max-w-md">
                Browse open roles, apply in minutes, and track every stage — from submission to interview to offer — in one place.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => document.getElementById("jobs-list")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ background: "#fff", color: c.primaryText }}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 h-11 rounded-full hover:opacity-90"
                >
                  Explore open positions <ArrowRight size={16} />
                </button>
                <span style={{ color: "rgba(255,255,255,0.85)" }} className="text-sm">{JOBS.length} roles open now</span>
              </div>
            </div>

            {/* photo circle + floating glass badges */}
            <div className="relative hidden md:flex items-center justify-center h-72">
              <div style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)" }} className="w-64 h-64 rounded-full flex items-center justify-center">
                <div style={{ background: "rgba(255,255,255,0.9)" }} className="w-44 h-44 rounded-full flex items-center justify-center">
                  <Briefcase size={54} color={c.primaryText} />
                </div>
              </div>
              <div style={{ background: c.surface, boxShadow: c.shadow }} className="absolute top-2 left-0 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <div style={{ background: c.successSoft, color: c.successText }} className="w-7 h-7 rounded-full flex items-center justify-center"><CheckCircle2 size={14} /></div>
                <div>
                  <p style={{ color: c.text }} className="text-xs font-bold">Shortlisted</p>
                  <p style={{ color: c.textFaint }} className="text-[10px]">Backend Engineer</p>
                </div>
              </div>
              <div style={{ background: c.surface, boxShadow: c.shadow }} className="absolute bottom-4 right-0 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <div style={{ background: c.accentSoft, color: c.accentText }} className="w-7 h-7 rounded-full flex items-center justify-center"><Video size={14} /></div>
                <div>
                  <p style={{ color: c.text }} className="text-xs font-bold">Interview at 7:00 PM</p>
                  <p style={{ color: c.textFaint }} className="text-[10px]">Google Meet</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* quick services row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 -mt-9 relative px-2 sm:px-6">
          {[
            { t: "Explore jobs", icon: Search, action: () => document.getElementById("jobs-list")?.scrollIntoView({ behavior: "smooth" }) },
            { t: "Upload your CV", icon: Upload, action: () => setView("auth") },
            { t: "Track application", icon: TrendingUp, action: () => setView("auth") },
            { t: "Help & FAQ", icon: HelpCircle, action: () => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }) },
          ].map(s => (
            <button key={s.t} onClick={s.action} style={{ background: c.surface, boxShadow: c.shadow, border: `1px solid ${c.border}` }} className="rounded-3xl p-4 flex flex-col items-center gap-2.5 text-center hover:-translate-y-0.5 transition-transform">
              <div style={{ background: c.primarySoft, color: c.primaryText }} className="w-11 h-11 rounded-full flex items-center justify-center">
                <s.icon size={18} />
              </div>
              <span style={{ color: c.text }} className="text-xs font-semibold">{s.t}</span>
            </button>
          ))}
        </div>

        {/* signature pipeline strip */}
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: c.shadow }} className="mt-8 rounded-3xl p-5 md:p-6 hidden sm:block">
          <p style={{ color: c.textFaint }} className="text-xs font-semibold uppercase tracking-wide mb-4">Your application journey</p>
          <PipelineRail c={c} steps={["Applied", "Reviewed", "Interview", "Offer"]} activeIndex={2} orientation="horizontal" />
        </div>
      </div>

      {/* Jobs list */}
      <div id="jobs-list" className="max-w-6xl mx-auto px-5 md:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <h2 style={{ fontFamily: "Sora", color: c.text }} className="text-2xl font-bold">Open positions</h2>
            <p style={{ color: c.textMuted }} className="text-sm mt-1">Roles hiring right now across the company.</p>
          </div>
          <div style={{ border: `1px solid ${c.border}`, background: c.surface }} className="flex items-center gap-2 px-3.5 h-11 rounded-full w-full sm:w-72">
            <Search size={16} color={c.textFaint} />
            <input
              value={q} onChange={e => setQ(e.target.value)} placeholder="Search jobs, location..."
              style={{ color: c.text, background: "transparent" }} className="text-sm outline-none w-full placeholder:opacity-60"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(job => (
            <button key={job.id} onClick={() => openJob(job.id)} style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: c.shadow, borderRadius: 28 }} className="relative text-left p-5 hover:-translate-y-0.5 transition-transform">
              {job.applicants > 50 && (
                <span style={{ background: c.accent, color: c.text }} className="absolute -top-2.5 left-5 text-[10px] font-bold px-3 py-1 rounded-full">Popular</span>
              )}
              <div className="flex items-start justify-between">
                <div style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`, color: "#fff" }} className="w-11 h-11 rounded-2xl flex items-center justify-center">
                  <job.icon size={18} />
                </div>
                <span style={{ color: c.textFaint }} className="text-xs">{job.posted}</span>
              </div>
              <h3 style={{ color: c.text, fontFamily: "Sora" }} className="mt-4 text-base font-bold">{job.title}</h3>
              <p style={{ color: c.textMuted }} className="text-sm mt-1">{job.dept}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span style={{ background: c.surfaceAlt, color: c.textMuted }} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"><MapPin size={11} />{job.location}</span>
                <span style={{ background: c.surfaceAlt, color: c.textMuted }} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"><Clock size={11} />{job.type}</span>
                <span style={{ background: c.surfaceAlt, color: c.textMuted }} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"><DollarSign size={11} />{job.salary}</span>
              </div>
              <div style={{ borderTop: `1px solid ${c.border}` }} className="mt-4 pt-4 flex items-center justify-between">
                <span style={{ color: c.textFaint }} className="inline-flex items-center gap-1 text-xs"><Users size={12} />{job.applicants} applicants</span>
                <span style={{ color: "#fff", background: c.primary }} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full">Apply now <ChevronRight size={13} /></span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div id="how" style={{ background: c.surfaceAlt }} className="py-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 style={{ fontFamily: "Sora", color: c.text }} className="text-2xl font-bold mb-2">How it works</h2>
          <p style={{ color: c.textMuted }} className="text-sm mb-8">A simple, transparent recruitment process from start to finish.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { t: "Apply", d: "Pick a role and complete a short, guided application.", icon: FileText },
              { t: "Get reviewed", d: "Our team reviews your CV and application answers.", icon: Search },
              { t: "Interview", d: "Shortlisted candidates are invited to a video interview.", icon: Video },
              { t: "Hear back", d: "Track your status live and get a final decision.", icon: CheckCircle2 },
            ].map((s, i) => (
              <div key={s.t} style={{ background: c.surface, border: `1px solid ${c.border}` }} className="rounded-2xl p-5">
                <div style={{ background: c.primarySoft, color: c.primaryText }} className="w-9 h-9 rounded-lg flex items-center justify-center mb-4">
                  <s.icon size={16} />
                </div>
                <p style={{ color: c.textFaint, fontFamily: "JetBrains Mono" }} className="text-xs mb-1">0{i + 1}</p>
                <h4 style={{ color: c.text }} className="font-semibold text-sm">{s.t}</h4>
                <p style={{ color: c.textMuted }} className="text-xs mt-1.5 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why apply */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
        <h2 style={{ fontFamily: "Sora", color: c.text }} className="text-2xl font-bold mb-8">Why apply with us</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { t: "Full visibility", d: "Always know exactly where your application stands — no guessing.", icon: TrendingUp },
            { t: "Fast interviews", d: "Scheduling and reminders are built in, so nothing slips through.", icon: Timer },
            { t: "Fair process", d: "Every applicant is reviewed against the same clear criteria.", icon: ShieldCheck },
          ].map(s => (
            <div key={s.t} style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: c.shadow }} className="rounded-2xl p-5">
              <s.icon size={20} color={c.accentText} />
              <h4 style={{ color: c.text }} className="font-semibold text-sm mt-3">{s.t}</h4>
              <p style={{ color: c.textMuted }} className="text-xs mt-1.5 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" style={{ background: c.surfaceAlt }} className="py-16">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <h2 style={{ fontFamily: "Sora", color: c.text }} className="text-2xl font-bold mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {[
              { q: "How long does the review process take?", a: "Most applications are reviewed within 5–7 business days of submission." },
              { q: "Can I apply to more than one role?", a: "Yes, you can apply to as many open roles as you're a fit for." },
              { q: "How will I know if I'm shortlisted?", a: "Your dashboard updates in real time, and we'll also email you." },
              { q: "What happens if I miss my interview?", a: "You can request a reschedule from your dashboard — our team reviews each request." },
            ].map(f => <FaqItem key={f.q} c={c} f={f} />)}
          </div>
        </div>
      </div>

      <Footer c={c} />
    </div>
  );
}

function FaqItem({ c, f }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} style={{ background: c.surface, border: `1px solid ${c.border}` }} className="w-full text-left rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span style={{ color: c.text }} className="text-sm font-semibold">{f.q}</span>
        <ChevronDown size={16} color={c.textFaint} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </div>
      {open && <p style={{ color: c.textMuted }} className="text-sm mt-2.5 leading-relaxed">{f.a}</p>}
    </button>
  );
}

function Footer({ c }) {
  return (
    <div style={{ borderTop: `1px solid ${c.border}` }} className="py-10">
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.accent})` }} className="w-6 h-6 rounded-lg flex items-center justify-center">
            <Sparkles size={12} color="#fff" />
          </div>
          <span style={{ color: c.text, fontFamily: "Sora" }} className="text-sm font-bold">HireFlow</span>
        </div>
        <p style={{ color: c.textFaint }} className="text-xs">© 2026 HireFlow. Hire smarter. Move faster.</p>
      </div>
    </div>
  );
}

/* ---------------- Job details ---------------- */
function JobDetails({ c, job, setView, startApply }) {
  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-10">
      <button onClick={() => setView("landing")} style={{ color: c.textMuted }} className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-80">
        <ArrowLeft size={15} /> Back to jobs
      </button>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: c.shadow }} className="rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div style={{ background: c.primarySoft, color: c.primaryText }} className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
            <job.icon size={24} />
          </div>
          <div className="flex-1">
            <h1 style={{ fontFamily: "Sora", color: c.text }} className="text-2xl font-bold">{job.title}</h1>
            <p style={{ color: c.textMuted }} className="text-sm mt-1">{job.dept} · HireFlow Inc.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                [MapPin, job.location], [Clock, job.type], [GraduationCap, job.level], [DollarSign, job.salary],
              ].map(([Icon, label], i) => (
                <span key={i} style={{ background: c.surfaceAlt, color: c.textMuted }} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full">
                  <Icon size={12} />{label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p style={{ color: c.textMuted }} className="mt-6 text-sm leading-relaxed">{job.description}</p>

        <Section c={c} title="Responsibilities" items={job.responsibilities} />
        <Section c={c} title="Requirements" items={job.requirements} />

        <div className="mt-6">
          <h3 style={{ color: c.text }} className="text-sm font-bold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map(s => (
              <span key={s} style={{ background: c.primarySoft, color: c.primaryText }} className="text-xs font-semibold px-3 py-1.5 rounded-full">{s}</span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 style={{ color: c.text }} className="text-sm font-bold mb-3">Benefits</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {job.benefits.map(b => (
              <span key={b} style={{ color: c.textMuted }} className="inline-flex items-center gap-2 text-sm"><CheckCircle2 size={14} color={c.success} />{b}</span>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${c.border}` }} className="mt-8 pt-6 flex items-center justify-between flex-wrap gap-3">
          <span style={{ color: c.textFaint }} className="inline-flex items-center gap-1.5 text-xs"><Users size={13} />{job.applicants} people have applied</span>
          <button onClick={startApply} style={{ background: c.primary, color: "#fff" }} className="inline-flex items-center gap-2 text-sm font-semibold px-6 h-11 rounded-full hover:opacity-90">
            Apply for this position <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ c, title, items }) {
  return (
    <div className="mt-6">
      <h3 style={{ color: c.text }} className="text-sm font-bold mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} style={{ color: c.textMuted }} className="flex items-start gap-2.5 text-sm leading-relaxed">
            <span style={{ background: c.accentText }} className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Auth ---------------- */
function AuthScreen({ c, setView, onAuth }) {
  const [mode, setMode] = useState("register");
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const submit = () => {
    if (!form.email || !form.password || (mode === "register" && !form.name)) {
      setErr("Fill in all required fields to continue.");
      return;
    }
    setErr("");
    onAuth({ name: form.name || "Sara Al-Qahtani", email: form.email });
  };
  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: c.shadow }} className="rounded-2xl p-7">
        <h2 style={{ fontFamily: "Sora", color: c.text }} className="text-xl font-bold">{mode === "register" ? "Create your account" : "Welcome back"}</h2>
        <p style={{ color: c.textMuted }} className="text-sm mt-1.5">{mode === "register" ? "Set up your applicant profile to start applying." : "Sign in to track your applications."}</p>

        <div className="mt-6 space-y-3.5">
          {mode === "register" && (
            <Field c={c} label="Full name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Full name" icon={User} />
          )}
          {mode === "register" && (
            <Field c={c} label="Phone number" value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="+966 5X XXX XXXX" icon={Phone} />
          )}
          <Field c={c} label="Email address" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="you@email.com" icon={Mail} />
          <Field c={c} label="Password" type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} placeholder="••••••••" icon={ShieldCheck} />
        </div>
        {err && <p style={{ color: c.dangerText }} className="text-xs mt-3 flex items-center gap-1.5"><AlertCircle size={13} />{err}</p>}
        <button onClick={submit} style={{ background: c.primary, color: "#fff" }} className="w-full h-11 rounded-full text-sm font-semibold mt-5 hover:opacity-90">
          {mode === "register" ? "Create account" : "Sign in"}
        </button>
        <p style={{ color: c.textMuted }} className="text-xs text-center mt-4">
          {mode === "register" ? "Already have an account?" : "New here?"}{" "}
          <button onClick={() => setMode(mode === "register" ? "login" : "register")} style={{ color: c.primaryText }} className="font-semibold">
            {mode === "register" ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({ c, label, value, onChange, placeholder, type = "text", icon: Icon }) {
  return (
    <label className="block">
      <span style={{ color: c.textMuted }} className="text-xs font-semibold">{label}</span>
      <div style={{ border: `1px solid ${c.border}`, background: c.surfaceAlt }} className="mt-1.5 flex items-center gap-2 px-3.5 h-11 rounded-xl">
        {Icon && <Icon size={15} color={c.textFaint} />}
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ color: c.text, background: "transparent" }} className="text-sm outline-none w-full placeholder:opacity-50"
        />
      </div>
    </label>
  );
}

/* ---------------- Application form ---------------- */
const FORM_STEPS = ["Personal Information", "Professional Information", "Experience & Skills", "Documents", "Job Questions", "Review & Submit"];

function ApplicationForm({ c, job, setView, onSubmit }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    fullName: "", phone: "", email: "", nationality: "", city: "", dob: "",
    currentJob: "", yearsExperience: "", previousCompany: "", education: "",
    skills: "", certifications: "", expectedSalary: "", noticePeriod: "",
    cvFile: null, cvError: "", linkedin: "", portfolio: "",
    answers: {},
  });
  const [stepError, setStepError] = useState("");

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const setAnswer = (id, v) => setData(d => ({ ...d, answers: { ...d.answers, [id]: v } }));

  const validate = () => {
    if (step === 0 && (!data.fullName || !data.phone || !data.email)) return "Fill in your name, phone, and email.";
    if (step === 3 && !data.cvFile) return "Upload your CV to continue.";
    return "";
  };

  const next = () => {
    const e = validate();
    if (e) { setStepError(e); return; }
    setStepError("");
    if (step < FORM_STEPS.length - 1) setStep(step + 1);
  };
  const back = () => { setStepError(""); step > 0 ? setStep(step - 1) : setView("jobDetails"); };

  const onFile = (file) => {
    if (!file) return;
    const okType = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!okType) { set("cvError", "Please upload a PDF, DOC, or DOCX file."); return; }
    if (file.size > 5 * 1024 * 1024) { set("cvError", "File must be under 5MB."); return; }
    set("cvError", "");
    set("cvFile", { name: file.name, size: (file.size / 1024).toFixed(0) + " KB" });
  };

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-10">
      <div className="flex items-center justify-between mb-2">
        <p style={{ color: c.textMuted }} className="text-sm">Applying for</p>
        <span style={{ color: c.textFaint }} className="text-xs">Auto-saved · draft kept while you finish</span>
      </div>
      <h1 style={{ fontFamily: "Sora", color: c.text }} className="text-xl font-bold mb-6">{job.title}</h1>

      <div className="mb-8">
        <PipelineRail c={c} steps={FORM_STEPS.map((t, i) => ({ key: i, label: t }))} activeIndex={step} orientation="horizontal" size="sm" />
      </div>

      <div style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: c.shadow }} className="rounded-2xl p-6 md:p-8">
        {step === 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field c={c} label="Full name *" value={data.fullName} onChange={v => set("fullName", v)} placeholder="Full name" />
            <Field c={c} label="Phone number *" value={data.phone} onChange={v => set("phone", v)} placeholder="+966 5X XXX XXXX" />
            <Field c={c} label="Email address *" value={data.email} onChange={v => set("email", v)} placeholder="you@email.com" />
            <Field c={c} label="Nationality" value={data.nationality} onChange={v => set("nationality", v)} placeholder="Nationality" />
            <Field c={c} label="City" value={data.city} onChange={v => set("city", v)} placeholder="City" />
            <Field c={c} label="Date of birth" type="date" value={data.dob} onChange={v => set("dob", v)} />
          </div>
        )}
        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field c={c} label="Current job title" value={data.currentJob} onChange={v => set("currentJob", v)} placeholder="e.g. Accountant" />
            <Field c={c} label="Years of experience" type="number" value={data.yearsExperience} onChange={v => set("yearsExperience", v)} placeholder="e.g. 5" />
            <Field c={c} label="Previous / current company" value={data.previousCompany} onChange={v => set("previousCompany", v)} placeholder="Company name" />
            <Field c={c} label="Education" value={data.education} onChange={v => set("education", v)} placeholder="Degree, university" />
            <Field c={c} label="Expected salary" value={data.expectedSalary} onChange={v => set("expectedSalary", v)} placeholder="e.g. SAR 10,000" />
            <Field c={c} label="Notice period" value={data.noticePeriod} onChange={v => set("noticePeriod", v)} placeholder="e.g. 30 days" />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <TextAreaField c={c} label="Key skills" value={data.skills} onChange={v => set("skills", v)} placeholder="List your key skills, separated by commas" />
            <TextAreaField c={c} label="Certifications" value={data.certifications} onChange={v => set("certifications", v)} placeholder="Relevant certifications, if any" rows={2} />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <span style={{ color: c.textMuted }} className="text-xs font-semibold">CV / Resume *</span>
              <label style={{ border: `1.5px dashed ${c.borderStrong}`, background: c.surfaceAlt }} className="mt-1.5 flex flex-col items-center justify-center gap-2 rounded-xl py-8 cursor-pointer">
                <Upload size={20} color={c.textFaint} />
                <span style={{ color: c.textMuted }} className="text-sm font-medium">{data.cvFile ? data.cvFile.name : "Click to upload PDF, DOC, or DOCX"}</span>
                <span style={{ color: c.textFaint }} className="text-xs">Maximum file size 5MB{data.cvFile ? ` · ${data.cvFile.size}` : ""}</span>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => onFile(e.target.files[0])} />
              </label>
              {data.cvError && <p style={{ color: c.dangerText }} className="text-xs mt-2 flex items-center gap-1.5"><AlertCircle size={12} />{data.cvError}</p>}
            </div>
            <Field c={c} label="LinkedIn URL" value={data.linkedin} onChange={v => set("linkedin", v)} placeholder="linkedin.com/in/you" icon={Linkedin} />
            <Field c={c} label="Portfolio URL" value={data.portfolio} onChange={v => set("portfolio", v)} placeholder="yourportfolio.com" icon={Globe} />
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            {job.questions.map(q => (
              <div key={q.id}>
                <span style={{ color: c.textMuted }} className="text-xs font-semibold">{q.label}</span>
                {q.type === "text" && (
                  <input value={data.answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} style={{ border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text }} className="mt-1.5 w-full h-11 rounded-xl px-3.5 text-sm outline-none" />
                )}
                {q.type === "textarea" && (
                  <textarea value={data.answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} rows={3} style={{ border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text }} className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none" />
                )}
                {q.type === "number" && (
                  <input type="number" value={data.answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} style={{ border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text }} className="mt-1.5 w-full h-11 rounded-xl px-3.5 text-sm outline-none" />
                )}
                {q.type === "select" && (
                  <select value={data.answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} style={{ border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text }} className="mt-1.5 w-full h-11 rounded-xl px-3.5 text-sm outline-none">
                    <option value="">Select...</option>
                    {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
                {q.type === "yesno" && (
                  <div className="flex gap-2 mt-1.5">
                    {["Yes", "No"].map(opt => (
                      <button key={opt} onClick={() => setAnswer(q.id, opt)} style={{
                        border: `1px solid ${data.answers[q.id] === opt ? c.primary : c.border}`,
                        background: data.answers[q.id] === opt ? c.primarySoft : c.surfaceAlt,
                        color: data.answers[q.id] === opt ? c.primaryText : c.textMuted,
                      }} className="px-4 h-9 rounded-full text-sm font-semibold">{opt}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {step === 5 && (
          <div className="space-y-5">
            <ReviewGroup c={c} title="Personal information" rows={[["Full name", data.fullName], ["Phone", data.phone], ["Email", data.email], ["City", data.city]]} />
            <ReviewGroup c={c} title="Professional information" rows={[["Current job", data.currentJob], ["Experience", data.yearsExperience && `${data.yearsExperience} years`], ["Expected salary", data.expectedSalary]]} />
            <ReviewGroup c={c} title="Documents" rows={[["CV", data.cvFile?.name], ["LinkedIn", data.linkedin], ["Portfolio", data.portfolio]]} />
            <p style={{ color: c.textFaint }} className="text-xs">By submitting, you confirm the information above is accurate.</p>
          </div>
        )}

        {stepError && <p style={{ color: c.dangerText }} className="text-xs mt-4 flex items-center gap-1.5"><AlertCircle size={13} />{stepError}</p>}

        <div style={{ borderTop: `1px solid ${c.border}` }} className="mt-7 pt-6 flex items-center justify-between">
          <button onClick={back} style={{ color: c.textMuted }} className="inline-flex items-center gap-1.5 text-sm font-semibold"><ArrowLeft size={15} /> Back</button>
          {step < FORM_STEPS.length - 1 ? (
            <button onClick={next} style={{ background: c.primary, color: "#fff" }} className="inline-flex items-center gap-2 text-sm font-semibold px-6 h-11 rounded-full hover:opacity-90">Continue <ArrowRight size={15} /></button>
          ) : (
            <button onClick={() => onSubmit(data)} style={{ background: c.primary, color: "#fff" }} className="inline-flex items-center gap-2 text-sm font-semibold px-6 h-11 rounded-full hover:opacity-90">Submit application <Check size={15} /></button>
          )}
        </div>
      </div>
    </div>
  );
}

function TextAreaField({ c, label, value, onChange, placeholder, rows = 3 }) {
  return (
    <label className="block">
      <span style={{ color: c.textMuted }} className="text-xs font-semibold">{label}</span>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text }} className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none placeholder:opacity-50" />
    </label>
  );
}

function ReviewGroup({ c, title, rows }) {
  return (
    <div>
      <h4 style={{ color: c.text }} className="text-sm font-bold mb-2">{title}</h4>
      <div style={{ background: c.surfaceAlt, border: `1px solid ${c.border}` }} className="rounded-xl divide-y" >
        {rows.map(([k, v], i) => (
          <div key={i} style={{ borderColor: c.border }} className="flex items-center justify-between px-4 py-2.5 text-sm">
            <span style={{ color: c.textMuted }}>{k}</span>
            <span style={{ color: c.text }} className="font-medium">{v || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Success ---------------- */
function SuccessScreen({ c, applicationId, job, goDashboard }) {
  return (
    <div className="max-w-lg mx-auto px-5 py-20 text-center">
      <div style={{ background: c.successSoft }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 size={30} color={c.success} />
      </div>
      <h1 style={{ fontFamily: "Sora", color: c.text }} className="text-2xl font-bold mt-6">Application submitted successfully</h1>
      <p style={{ color: c.textMuted }} className="text-sm mt-2 leading-relaxed">
        We've received your application for <strong style={{ color: c.text }}>{job.title}</strong>. Our recruitment team will review it soon.
      </p>
      <div style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, fontFamily: "JetBrains Mono" }} className="inline-block mt-6 px-5 py-2.5 rounded-full text-sm font-semibold">
        <span style={{ color: c.textFaint }}>Application </span>
        <span style={{ color: c.primaryText }}>#{applicationId}</span>
      </div>
      <div className="mt-8">
        <button onClick={goDashboard} style={{ background: c.primary, color: "#fff" }} className="inline-flex items-center gap-2 text-sm font-semibold px-6 h-11 rounded-full hover:opacity-90">
          Track my application <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function Dashboard({ c, theme, setTheme, job, applicationId, stageIndex, tab, setTab, setView, simOffset, setSimOffset, attendance, setAttendance, interviewTime, now }) {
  const nav = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "interviews", label: "Interviews", icon: Video },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  const status = STAGES[stageIndex].key;
  const sc = statusColors(c, status);

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 flex gap-6">
      <div style={{ borderRight: `1px solid ${c.border}` }} className="hidden md:flex flex-col w-56 shrink-0 pr-5">
        {nav.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            background: tab === n.id ? c.primarySoft : "transparent",
            color: tab === n.id ? c.primaryText : c.textMuted,
          }} className="flex items-center gap-2.5 px-3.5 h-10 rounded-xl text-sm font-semibold mb-1">
            <n.icon size={16} /> {n.label}
          </button>
        ))}
        <button onClick={() => setView("landing")} style={{ color: c.textFaint }} className="flex items-center gap-2.5 px-3.5 h-10 rounded-xl text-sm font-medium mt-6">
          <LogOut size={15} /> Sign out
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex md:hidden gap-2 overflow-x-auto pb-4 mb-2">
          {nav.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              background: tab === n.id ? c.primarySoft : c.surfaceAlt, color: tab === n.id ? c.primaryText : c.textMuted,
            }} className="shrink-0 flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-semibold">
              <n.icon size={13} /> {n.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div>
            <h1 style={{ fontFamily: "Sora", color: c.text }} className="text-2xl font-bold">Welcome back</h1>
            <p style={{ color: c.textMuted }} className="text-sm mt-1">Here's where things stand with your application.</p>

            <div style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: c.shadow }} className="rounded-2xl p-6 mt-6">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <p style={{ color: c.textFaint }} className="text-xs font-semibold">Application #{applicationId}</p>
                  <h3 style={{ color: c.text, fontFamily: "Sora" }} className="text-lg font-bold mt-1">{job.title}</h3>
                </div>
                <span style={{ background: sc.bg, color: sc.text }} className="text-xs font-bold px-3 py-1.5 rounded-full">{STAGES[stageIndex].label}</span>
              </div>
              <div className="mt-8 overflow-x-auto">
                <div style={{ minWidth: 640 }}>
                  <PipelineRail c={c} steps={STAGES} activeIndex={stageIndex} orientation="horizontal" size="sm" />
                </div>
              </div>
            </div>

            {stageIndex === 4 && (
              <InterviewCard c={c} job={job} interviewTime={interviewTime} now={now} attendance={attendance} setAttendance={setAttendance} simOffset={simOffset} setSimOffset={setSimOffset} />
            )}

            <div className="grid sm:grid-cols-3 gap-3 mt-6">
              <StatMini c={c} label="CV viewed" value="Yes, 21 Aug" icon={FileText} />
              <StatMini c={c} label="Applications" value="3 total" icon={Briefcase} />
              <StatMini c={c} label="Unread updates" value="2 new" icon={Bell} />
            </div>
          </div>
        )}

        {tab === "applications" && (
          <div>
            <h1 style={{ fontFamily: "Sora", color: c.text }} className="text-2xl font-bold mb-5">My applications</h1>
            <div className="space-y-3">
              {[{ id: applicationId, job: job.title, date: "23 Aug 2026", status }, ...PAST_APPLICATIONS].map(a => {
                const asc = statusColors(c, a.status);
                return (
                  <div key={a.id} style={{ background: c.surface, border: `1px solid ${c.border}` }} className="rounded-xl p-4 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p style={{ color: c.text }} className="text-sm font-bold">{a.job}</p>
                      <p style={{ color: c.textFaint, fontFamily: "JetBrains Mono" }} className="text-xs mt-0.5">#{a.id} · Applied {a.date}</p>
                    </div>
                    <span style={{ background: asc.bg, color: asc.text }} className="text-xs font-bold px-3 py-1.5 rounded-full">{a.status.replace(/_/g, " ")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "interviews" && (
          <div>
            <h1 style={{ fontFamily: "Sora", color: c.text }} className="text-2xl font-bold mb-5">Interviews</h1>
            {stageIndex >= 4 ? (
              <InterviewCard c={c} job={job} interviewTime={interviewTime} now={now} attendance={attendance} setAttendance={setAttendance} simOffset={simOffset} setSimOffset={setSimOffset} expanded />
            ) : (
              <EmptyState c={c} icon={Video} title="No interviews scheduled" body="Once you're shortlisted, any upcoming interviews will show up here." />
            )}
          </div>
        )}

        {tab === "notifications" && (
          <div>
            <h1 style={{ fontFamily: "Sora", color: c.text }} className="text-2xl font-bold mb-5">Notifications</h1>
            <div className="space-y-2.5">
              {[
                { t: "Interview scheduled", d: `Your interview for ${job.title} is confirmed.`, time: "2h ago", icon: Video, unread: true },
                { t: "Application shortlisted", d: "You've moved to the next stage.", time: "1d ago", icon: CheckCircle2, unread: true },
                { t: "CV viewed", d: "A recruiter viewed your CV.", time: "2d ago", icon: FileText, unread: false },
                { t: "Application received", d: "We've received your application.", time: "3d ago", icon: Check, unread: false },
              ].map((n, i) => (
                <div key={i} style={{ background: n.unread ? c.primarySoft : c.surface, border: `1px solid ${c.border}` }} className="rounded-xl p-4 flex items-start gap-3">
                  <div style={{ background: c.surfaceAlt, color: c.primaryText }} className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
                    <n.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: c.text }} className="text-sm font-semibold">{n.t}</p>
                    <p style={{ color: c.textMuted }} className="text-xs mt-0.5">{n.d}</p>
                  </div>
                  <span style={{ color: c.textFaint }} className="text-xs shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div>
            <h1 style={{ fontFamily: "Sora", color: c.text }} className="text-2xl font-bold mb-5">Profile</h1>
            <div style={{ background: c.surface, border: `1px solid ${c.border}` }} className="rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
              <Field c={c} label="Full name" value="Sara Al-Qahtani" onChange={() => {}} />
              <Field c={c} label="Email" value="sara.q@email.com" onChange={() => {}} />
              <Field c={c} label="Phone" value="+966 55 123 4567" onChange={() => {}} />
              <Field c={c} label="City" value="Riyadh" onChange={() => {}} />
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div>
            <h1 style={{ fontFamily: "Sora", color: c.text }} className="text-2xl font-bold mb-5">Settings</h1>
            <div style={{ background: c.surface, border: `1px solid ${c.border}` }} className="rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p style={{ color: c.text }} className="text-sm font-semibold">Appearance</p>
                <p style={{ color: c.textMuted }} className="text-xs mt-0.5">Switch between light and dark mode.</p>
              </div>
              <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={{ border: `1px solid ${c.borderStrong}`, color: c.text }} className="inline-flex items-center gap-2 text-sm font-semibold px-4 h-9 rounded-full">
                {theme === "light" ? <Moon size={14} /> : <Sun size={14} />} {theme === "light" ? "Dark mode" : "Light mode"}
              </button>
            </div>
            <div style={{ background: c.surface, border: `1px solid ${c.border}` }} className="rounded-2xl p-5 flex items-center justify-between mt-3">
              <div>
                <p style={{ color: c.text }} className="text-sm font-semibold">Email notifications</p>
                <p style={{ color: c.textMuted }} className="text-xs mt-0.5">Status updates and interview reminders.</p>
              </div>
              <ToggleDemo c={c} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleDemo({ c }) {
  const [on, setOn] = useState(true);
  return (
    <button onClick={() => setOn(!on)} style={{ background: on ? c.primary : c.border }} className="w-11 h-6 rounded-full relative transition-colors">
      <span style={{ left: on ? 22 : 3, background: "#fff" }} className="absolute top-1 w-4 h-4 rounded-full transition-all" />
    </button>
  );
}

function StatMini({ c, label, value, icon: Icon }) {
  return (
    <div style={{ background: c.surfaceAlt, border: `1px solid ${c.border}` }} className="rounded-xl p-4">
      <div style={{ color: c.textFaint }} className="flex items-center gap-1.5 text-xs font-semibold"><Icon size={13} />{label}</div>
      <p style={{ color: c.text }} className="text-sm font-bold mt-2">{value}</p>
    </div>
  );
}

function EmptyState({ c, icon: Icon, title, body }) {
  return (
    <div style={{ background: c.surface, border: `1px dashed ${c.borderStrong}` }} className="rounded-2xl p-10 text-center">
      <Icon size={26} color={c.textFaint} className="mx-auto" />
      <p style={{ color: c.text }} className="text-sm font-semibold mt-3">{title}</p>
      <p style={{ color: c.textMuted }} className="text-xs mt-1">{body}</p>
    </div>
  );
}

/* Interview card with live countdown + demo clock for no-show logic */
function InterviewCard({ c, job, interviewTime, now, attendance, setAttendance, simOffset, setSimOffset, expanded }) {
  const diff = interviewTime - now;
  const joinWindowMs = 10 * 60 * 1000;
  const graceMs = 15 * 60 * 1000;
  const canJoin = diff <= joinWindowMs && diff > -graceMs && attendance !== "COMPLETED" && attendance !== "NO_SHOW";
  const missed = diff <= -graceMs;

  useEffect(() => {
    if (missed && attendance === "WAITING") setAttendance("NO_SHOW");
  }, [missed, attendance]);

  return (
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: c.shadow }} className="rounded-2xl p-6 mt-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div style={{ background: c.accentSoft, color: c.accentText }} className="w-9 h-9 rounded-lg flex items-center justify-center">
            <Video size={16} />
          </div>
          <div>
            <p style={{ color: c.text }} className="text-sm font-bold">Interview scheduled</p>
            <p style={{ color: c.textMuted }} className="text-xs">{job.title}</p>
          </div>
        </div>
        <AttendanceBadge c={c} attendance={attendance} />
      </div>

      <div className="grid sm:grid-cols-4 gap-3 mt-5">
        <MiniInfo c={c} label="Date" value={new Date(interviewTime).toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" })} />
        <MiniInfo c={c} label="Time" value={new Date(interviewTime).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} />
        <MiniInfo c={c} label="Duration" value="30 minutes" />
        <MiniInfo c={c} label="Type" value="Google Meet" />
      </div>

      <div style={{ background: c.surfaceAlt, border: `1px solid ${c.border}` }} className="rounded-xl p-4 mt-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p style={{ color: c.textFaint }} className="text-xs font-semibold">
            {diff > joinWindowMs ? "Interview starts in" : missed ? "Interview window" : "You can join now"}
          </p>
          <p style={{ color: c.text, fontFamily: "JetBrains Mono" }} className="text-lg font-bold mt-0.5">
            {missed ? "Closed" : diff > joinWindowMs ? fmtHMS(diff) : "Join available"}
          </p>
        </div>
        {!missed && attendance !== "COMPLETED" ? (
          <button
            disabled={!canJoin}
            onClick={() => setAttendance("JOINED")}
            style={{ background: canJoin ? c.primary : c.border, color: canJoin ? "#fff" : c.textFaint, cursor: canJoin ? "pointer" : "not-allowed" }}
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 h-10 rounded-full"
          >
            <PlayCircle size={15} /> Join interview
          </button>
        ) : missed ? (
          <button style={{ border: `1px solid ${c.borderStrong}`, color: c.text }} className="inline-flex items-center gap-2 text-sm font-semibold px-5 h-10 rounded-full">
            <RotateCcw size={14} /> Request reschedule
          </button>
        ) : null}
      </div>

      {missed && (
        <div style={{ background: c.dangerSoft, color: c.dangerText }} className="mt-4 rounded-xl p-4 text-sm flex items-start gap-2.5">
          <XCircle size={16} className="shrink-0 mt-0.5" />
          <span>Unfortunately, you missed your scheduled interview. You can request a reschedule and our team will review it.</span>
        </div>
      )}

      <div style={{ borderTop: `1px solid ${c.border}` }} className="mt-5 pt-4 flex items-center justify-between flex-wrap gap-2">
        <p style={{ color: c.textFaint }} className="text-xs flex items-center gap-1.5"><HelpCircle size={13} />Prototype: fast-forward the clock to preview the no-show logic (15-min grace period).</p>
        <div className="flex gap-2">
          <button onClick={() => setSimOffset(s => s + 5)} style={{ border: `1px solid ${c.border}`, color: c.textMuted }} className="inline-flex items-center gap-1 text-xs font-semibold px-3 h-8 rounded-full"><FastForward size={12} />+5 min</button>
          <button onClick={() => setSimOffset(s => s + 20)} style={{ border: `1px solid ${c.border}`, color: c.textMuted }} className="inline-flex items-center gap-1 text-xs font-semibold px-3 h-8 rounded-full"><FastForward size={12} />+20 min</button>
          <button onClick={() => { setSimOffset(0); setAttendance("WAITING"); }} style={{ border: `1px solid ${c.border}`, color: c.textMuted }} className="inline-flex items-center gap-1 text-xs font-semibold px-3 h-8 rounded-full"><RotateCcw size={12} />Reset</button>
        </div>
      </div>
    </div>
  );
}

function AttendanceBadge({ c, attendance }) {
  const map = {
    WAITING: { bg: c.infoSoft, text: c.infoText, label: "Waiting" },
    JOINED: { bg: c.successSoft, text: c.successText, label: "Joined" },
    COMPLETED: { bg: c.primarySoft, text: c.primaryText, label: "Completed" },
    NO_SHOW: { bg: c.dangerSoft, text: c.dangerText, label: "No show" },
  }[attendance];
  return <span style={{ background: map.bg, color: map.text }} className="text-xs font-bold px-3 py-1.5 rounded-full">{map.label}</span>;
}

function MiniInfo({ c, label, value }) {
  return (
    <div>
      <p style={{ color: c.textFaint }} className="text-xs font-semibold">{label}</p>
      <p style={{ color: c.text }} className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}

/* ---------------- Root ---------------- */
export default function HireFlowApplicant() {
  const [theme, setTheme] = useState("light");
  const c = palette[theme];
  const [view, setView] = useState("landing");
  const [jobId, setJobId] = useState(JOBS[0].id);
  const job = JOBS.find(j => j.id === jobId) || JOBS[0];
  const [applied, setApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [dashboardTab, setDashboardTab] = useState("overview");
  const [stageIndex] = useState(4);

  const baseNow = useRef(Date.now()).current;
  const interviewTime = baseNow + 8 * 60 * 1000;
  const [simOffset, setSimOffset] = useState(0);
  const [attendance, setAttendance] = useState("WAITING");
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1000); return () => clearInterval(t); }, []);
  const now = baseNow + tick * 1000 + simOffset * 60 * 1000;

  const openJob = (id) => { setJobId(id); setView("jobDetails"); };
  const startApply = () => setView(applied ? "dashboard" : "auth");

  return (
    <div style={{ background: c.bg, minHeight: "100vh" }}>
      <style>{`
        ${FONT_IMPORT}
        * { font-family: 'Inter', sans-serif; }
        .pulse-dot { animation: pulseDot 1.6s ease-in-out infinite; }
        @keyframes pulseDot { 0%,100% { opacity: 1; transform: scale(1);} 50% { opacity: .5; transform: scale(1.3);} }
        input::placeholder, textarea::placeholder { color: inherit; }
      `}</style>

      <Navbar c={c} theme={theme} setTheme={setTheme} view={view} setView={setView} applied={applied} />

      {view === "landing" && <Landing c={c} theme={theme} setView={setView} openJob={openJob} />}
      {view === "jobDetails" && <JobDetails c={c} job={job} setView={setView} startApply={startApply} />}
      {view === "auth" && <AuthScreen c={c} setView={setView} onAuth={() => setView("apply")} />}
      {view === "apply" && (
        <ApplicationForm c={c} job={job} setView={setView} onSubmit={() => {
          const id = "APP-" + (10000 + Math.floor(Math.random() * 89999));
          setApplicationId(id); setApplied(true); setView("success");
        }} />
      )}
      {view === "success" && <SuccessScreen c={c} applicationId={applicationId} job={job} goDashboard={() => setView("dashboard")} />}
      {view === "dashboard" && (
        <Dashboard
          c={c} theme={theme} setTheme={setTheme} job={job} applicationId={applicationId || "APP-10482"}
          stageIndex={stageIndex} tab={dashboardTab} setTab={setDashboardTab} setView={setView}
          simOffset={simOffset} setSimOffset={setSimOffset} attendance={attendance} setAttendance={setAttendance}
          interviewTime={interviewTime} now={now}
        />
      )}
    </div>
  );
}
