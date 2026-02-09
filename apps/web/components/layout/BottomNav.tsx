"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  SVG icon helpers (project uses inline SVGs, no icon library)       */
/* ------------------------------------------------------------------ */

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function FeaturesIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
      />
    </svg>
  );
}

function DemoIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
      />
    </svg>
  );
}

function DashboardIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  );
}

function PricingIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

function ReviewsIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
}

function BillingIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
      />
    </svg>
  );
}

function EditorIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  );
}

function BuilderIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function PreviewIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function DeployIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
      />
    </svg>
  );
}

function MenuDotsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function AboutIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}

function ContactIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "text-forest-green" : "text-slate-blue-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab item component                                                 */
/* ------------------------------------------------------------------ */

interface TabItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

function TabItem({ href, label, icon, active }: TabItemProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-1.5 transition-colors ${
        active ? "text-forest-green" : "text-slate-blue-400"
      }`}
    >
      {icon}
      <span className={`text-[10px] font-medium truncate ${active ? "text-forest-green" : "text-slate-blue-400"}`}>
        {label}
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Bottom sheet menu item                                             */
/* ------------------------------------------------------------------ */

interface SheetItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}

function SheetItem({ href, label, icon, active, onClick }: SheetItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        active
          ? "bg-forest-green/10 text-forest-green"
          : "text-slate-blue-600 hover:bg-cream-200"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Bottom sheet overlay                                               */
/* ------------------------------------------------------------------ */

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, handleClose]);

  if (!open && !closing) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 ${closing ? "animate-fade-out-overlay" : "animate-fade-overlay"}`}
        onClick={handleClose}
      />
      {/* Sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl pb-bottom-nav ${
          closing ? "animate-slide-down-sheet" : "animate-slide-up-sheet"
        }`}
        style={{ maxHeight: "70vh" }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-cream-300" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2">
          <h3 className="font-serif font-bold text-lg text-slate-blue">{title}</h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-blue-400 hover:bg-cream-200 transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>
        {/* Content */}
        <div className="px-4 pb-6 overflow-y-auto" style={{ maxHeight: "calc(70vh - 5rem)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Route classification                                               */
/* ------------------------------------------------------------------ */

type Section = "public" | "demo" | "dashboard" | "editor";

function getSection(pathname: string): Section {
  if (pathname.startsWith("/dashboard/editor")) return "editor";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/demo")) return "demo";
  return "public";
}

/* ------------------------------------------------------------------ */
/*  Main BottomNav component                                           */
/* ------------------------------------------------------------------ */

export function BottomNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const section = getSection(pathname);

  // Don't show on editor page (it has its own layout)
  if (section === "editor") return null;

  const renderPublicNav = () => {
    const isExact = (path: string) => pathname === path;

    return (
      <>
        <TabItem href="/" label="Home" icon={<HomeIcon active={isExact("/")} />} active={isExact("/")} />
        <TabItem href="/features" label="Features" icon={<FeaturesIcon active={isExact("/features")} />} active={isExact("/features")} />
        {/* Center FAB */}
        <div className="flex flex-col items-center justify-center flex-1">
          <Link
            href="/demo"
            className="flex items-center justify-center w-12 h-12 -mt-5 rounded-full bg-harvest-gold shadow-lg shadow-harvest-gold/30 transition-transform active:scale-95"
          >
            <DemoIcon active={false} />
          </Link>
          <span className="text-[10px] font-medium text-harvest-gold-700 mt-0.5">Demo</span>
        </div>
        <TabItem href="/pricing" label="Pricing" icon={<PricingIcon active={isExact("/pricing")} />} active={isExact("/pricing")} />
        {/* More button */}
        <button
          onClick={() => setSheetOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-1.5 text-slate-blue-400"
        >
          <MenuDotsIcon />
          <span className="text-[10px] font-medium">More</span>
        </button>

        <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Menu">
          <div className="space-y-1">
            <SheetItem href="/dashboard" label="Dashboard" icon={<DashboardIcon active={pathname.startsWith("/dashboard")} />} active={pathname.startsWith("/dashboard")} onClick={() => setSheetOpen(false)} />
            <SheetItem href="/about" label="About" icon={<AboutIcon active={isExact("/about")} />} active={isExact("/about")} onClick={() => setSheetOpen(false)} />
            <SheetItem href="/contact" label="Contact" icon={<ContactIcon active={isExact("/contact")} />} active={isExact("/contact")} onClick={() => setSheetOpen(false)} />
          </div>
          <div className="mt-4 pt-4 border-t border-cream-200">
            <Link
              href="/contact"
              onClick={() => setSheetOpen(false)}
              className="flex items-center justify-center w-full px-6 py-3 rounded-lg bg-harvest-gold text-forest-green-900 font-semibold text-sm shadow-md hover:bg-harvest-gold-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </BottomSheet>
      </>
    );
  };

  const renderDemoNav = () => {
    const isExact = (path: string) => pathname === path;

    return (
      <>
        <TabItem href="/demo" label="Start" icon={<DemoIcon active={isExact("/demo")} />} active={isExact("/demo")} />
        <TabItem href="/demo/builder" label="Builder" icon={<BuilderIcon active={isExact("/demo/builder")} />} active={isExact("/demo/builder")} />
        {/* Center FAB */}
        <div className="flex flex-col items-center justify-center flex-1">
          <Link
            href="/demo/deploy"
            className="flex items-center justify-center w-12 h-12 -mt-5 rounded-full bg-forest-green shadow-lg shadow-forest-green/30 transition-transform active:scale-95"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </Link>
          <span className="text-[10px] font-medium text-forest-green mt-0.5">Deploy</span>
        </div>
        <TabItem href="/demo/preview" label="Preview" icon={<PreviewIcon active={isExact("/demo/preview")} />} active={isExact("/demo/preview")} />
        {/* More button */}
        <button
          onClick={() => setSheetOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-1.5 text-slate-blue-400"
        >
          <MenuDotsIcon />
          <span className="text-[10px] font-medium">More</span>
        </button>

        <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Navigation">
          <div className="space-y-1">
            <SheetItem href="/" label="Home" icon={<HomeIcon active={false} />} active={false} onClick={() => setSheetOpen(false)} />
            <SheetItem href="/features" label="Features" icon={<FeaturesIcon active={false} />} active={false} onClick={() => setSheetOpen(false)} />
            <SheetItem href="/pricing" label="Pricing" icon={<PricingIcon active={false} />} active={false} onClick={() => setSheetOpen(false)} />
            <SheetItem href="/dashboard" label="Dashboard" icon={<DashboardIcon active={false} />} active={false} onClick={() => setSheetOpen(false)} />
            <SheetItem href="/contact" label="Contact" icon={<ContactIcon active={false} />} active={false} onClick={() => setSheetOpen(false)} />
          </div>
        </BottomSheet>
      </>
    );
  };

  const renderDashboardNav = () => {
    const isExact = (path: string) => pathname === path;

    return (
      <>
        <TabItem href="/dashboard" label="Overview" icon={<DashboardIcon active={isExact("/dashboard")} />} active={isExact("/dashboard")} />
        <TabItem href="/dashboard/scheduling" label="Schedule" icon={<CalendarIcon active={isExact("/dashboard/scheduling")} />} active={isExact("/dashboard/scheduling")} />
        {/* Center FAB */}
        <div className="flex flex-col items-center justify-center flex-1">
          <Link
            href="/dashboard/editor"
            className="flex items-center justify-center w-12 h-12 -mt-5 rounded-full bg-forest-green shadow-lg shadow-forest-green/30 transition-transform active:scale-95"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
              />
            </svg>
          </Link>
          <span className="text-[10px] font-medium text-forest-green mt-0.5">Editor</span>
        </div>
        <TabItem href="/dashboard/reviews" label="Reviews" icon={<ReviewsIcon active={isExact("/dashboard/reviews")} />} active={isExact("/dashboard/reviews")} />
        {/* More button */}
        <button
          onClick={() => setSheetOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-1.5 text-slate-blue-400"
        >
          <MenuDotsIcon />
          <span className="text-[10px] font-medium">More</span>
        </button>

        <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Dashboard">
          <div className="space-y-1">
            <SheetItem href="/dashboard/billing" label="Billing" icon={<BillingIcon active={isExact("/dashboard/billing")} />} active={isExact("/dashboard/billing")} onClick={() => setSheetOpen(false)} />
            <SheetItem href="/demo" label="Try Demo" icon={<DemoIcon active={false} />} active={false} onClick={() => setSheetOpen(false)} />
            <SheetItem href="/" label="Home" icon={<HomeIcon active={false} />} active={false} onClick={() => setSheetOpen(false)} />
            <SheetItem href="/contact" label="Contact" icon={<ContactIcon active={false} />} active={false} onClick={() => setSheetOpen(false)} />
          </div>
        </BottomSheet>
      </>
    );
  };

  const navContentMap: Record<Section, () => React.ReactNode> = {
    public: renderPublicNav,
    demo: renderDemoNav,
    dashboard: renderDashboardNav,
    editor: () => null,
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-sm border-t border-cream-200 pb-bottom-nav"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-end justify-around h-16 px-1">
        {navContentMap[section]()}
      </div>
    </nav>
  );
}
