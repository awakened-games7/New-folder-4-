"use client";

import React, { useState, useEffect } from "react";
import Navbar, { TabType } from "../components/layout/Navbar";
import HeroAwakening from "../components/layout/HeroAwakening";
import StatusScreen from "../components/status/StatusScreen";
import VirtualAlchemyLab from "../components/arena/VirtualAlchemyLab";
import ChemistryArchives from "../components/archives/ChemistryArchives";
import GuildHub from "../components/guild/GuildHub";
import AriseModal from "../components/layout/AriseModal";
import SystemAlertModal from "../components/layout/SystemAlertModal";
import SocialSidebar from "../components/layout/SocialSidebar";
import GoogleAuthModal, { StudentHunterProfile } from "../components/auth/GoogleAuthModal";
import {
  Terminal,
  Shield,
  Sparkles,
  Activity,
  ExternalLink,
  Gamepad2,
  Layers,
  FlaskConical,
  Users,
  ChevronDown,
} from "lucide-react";
import { sounds } from "../components/audio/soundEffects";
import { GAME_METADATA } from "../components/archives/ChemistryArchives";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("status");
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isAriseOpen, setIsAriseOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<StudentHunterProfile | null>(null);
  const [archivesSubTab, setArchivesSubTab] = useState<"syllabus" | "bosses" | "cheatsheet">("syllabus");

  // Load saved Hunter Profile from localStorage if previously signed in
  useEffect(() => {
    try {
      const saved = localStorage.getItem("realms_hunter_profile");
      if (saved && saved.trim() !== "" && saved !== "undefined" && saved !== "null") {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setUserProfile(parsed);
        }
      }
    } catch {
      try {
        localStorage.removeItem("realms_hunter_profile");
      } catch {}
    }
  }, []);

  const handleSignInSuccess = (profile: StudentHunterProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem("realms_hunter_profile", JSON.stringify(profile));
    } catch (e) {
      console.error("Error saving hunter profile:", e);
    }
  };

  const handleSignOut = () => {
    setUserProfile(null);
    try {
      localStorage.removeItem("realms_hunter_profile");
    } catch (e) {
      console.error("Error clearing hunter profile:", e);
    }
  };

  // Master Legendary Autonomous Smooth Scroll Engine
  const smoothScrollToTarget = (
    targetId?: string,
    subTab?: "syllabus" | "bosses" | "cheatsheet"
  ) => {
    // Resolve intended element ID
    let intendedId = targetId;
    if (!intendedId) {
      if (subTab === "syllabus") intendedId = "archives-grimoire";
      else if (subTab === "cheatsheet") intendedId = "archives-cheatsheet";
      else if (subTab === "bosses") intendedId = "archives-bosses";
      else intendedId = "main-tab-content";
    }

    let attempts = 0;
    const maxAttempts = 40; // check for up to ~1.2 seconds

    const executeScroll = () => {
      attempts++;

      // Look for the primary target element
      let el: HTMLElement | null = intendedId ? document.getElementById(intendedId) : null;

      // If archives-grimoire is still mounting, try archives-tabs as secondary fallback
      if (!el && intendedId === "archives-grimoire") {
        el = document.getElementById("archives-tabs");
      }

      // If still not found after 6 attempts (~180ms), fall back to main-tab-content
      if (!el && attempts > 6) {
        el = document.getElementById("main-tab-content");
      }

      if (el) {
        const yOffset = -75; // 75px clearance under fixed top navbar
        const rect = el.getBoundingClientRect();
        const currentScrollY =
          window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        const targetY = Math.max(0, rect.top + currentScrollY + yOffset);

        // 1. Native smooth scroll to exact position
        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });

        // 2. Also invoke scrollIntoView
        try {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {}

        // 3. Trigger legendary neon activation glow
        el.classList.remove("legendary-scroll-focus");
        void el.offsetWidth; // force reflow
        el.classList.add("legendary-scroll-focus");

        // 4. Verification wave 1 at 250ms (adjusts if font or layout expansion shifted position)
        setTimeout(() => {
          const verifyEl = intendedId ? document.getElementById(intendedId) : null;
          if (verifyEl) {
            const vRect = verifyEl.getBoundingClientRect();
            if (Math.abs(vRect.top - 75) > 35) {
              const vScrollY =
                window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
              window.scrollTo({
                top: Math.max(0, vRect.top + vScrollY - 75),
                behavior: "smooth",
              });
            }
          }
        }, 250);

        // 5. Verification wave 2 at 500ms (guarantees final resting position is rock-solid)
        setTimeout(() => {
          const verifyEl2 = intendedId ? document.getElementById(intendedId) : null;
          if (verifyEl2) {
            const vRect2 = verifyEl2.getBoundingClientRect();
            if (Math.abs(vRect2.top - 75) > 35) {
              const vScrollY2 =
                window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
              window.scrollTo({
                top: Math.max(0, vRect2.top + vScrollY2 - 75),
                behavior: "smooth",
              });
            }
          }
        }, 500);

        return;
      }

      if (attempts < maxAttempts) {
        setTimeout(executeScroll, 30);
      }
    };

    // Start on next animation frame
    requestAnimationFrame(executeScroll);
  };

  // Automatic smooth scroll to the selected option or tab content
  const handleTabSelect = (
    tab: TabType,
    subTab?: "syllabus" | "bosses" | "cheatsheet",
    targetSectionId?: string
  ) => {
    sounds.playClick();
    setActiveTab(tab);
    if (subTab) {
      setArchivesSubTab(subTab);
    }

    // Determine target ID
    let scrollTarget = targetSectionId;
    if (tab === "all") {
      if (targetSectionId) scrollTarget = targetSectionId;
      else scrollTarget = "main-tab-content";
    } else {
      if (!scrollTarget) {
        if (tab === "archives") {
          scrollTarget = subTab === "cheatsheet" ? "archives-cheatsheet" : "archives-grimoire";
        } else if (tab === "arena") {
          scrollTarget = "arena-raid-view";
        } else if (tab === "guild") {
          scrollTarget = "guild-hub-view";
        } else if (tab === "status") {
          scrollTarget = "status-matrix-view";
        }
      }
    }

    smoothScrollToTarget(scrollTarget, subTab);
  };

  return (
    <main className="relative min-h-screen text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => handleTabSelect(tab)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        unreadCount={2}
        onTriggerArise={() => setIsAriseOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        userProfile={userProfile}
        onSignOut={handleSignOut}
      />

      {/* Fixed Vertical Social Sidebar on the Right */}
      <SocialSidebar />

      {/* Main Content Area with responsive top and bottom padding */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 pt-16 sm:pt-24 pb-24 md:pb-20">
        {/* Dynamic Hero Awakening Header Showcase */}
        <HeroAwakening
          onTriggerArise={() => setIsAriseOpen(true)}
          onNavigateTab={handleTabSelect}
          activeTab={activeTab}
          userProfile={userProfile}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* COMFORT MODE QUICK-SWITCHER BAR (Desktop sticky pill bar) */}
        <div className="hidden md:flex sticky top-16 z-30 mb-8 py-2 -mx-2 px-3 bg-black/85 backdrop-blur-md rounded border border-cyan-500/30 shadow-[0_4px_25px_rgba(0,0,0,0.8)] items-center justify-between gap-2 overflow-x-auto">
          <span className="text-[11px] font-orbitron font-bold text-cyan-400 shrink-0 px-2">
            SYSTEM MODE SELECTOR:
          </span>

          <div className="flex items-center gap-2 flex-1 justify-start">
            {/* Mode 1: Status */}
            <button
              onClick={() => handleTabSelect("status", undefined, "status-matrix-view")}
              className={`px-3 py-1.5 rounded text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === "status"
                  ? "bg-cyan-500 text-black border-2 border-cyan-200 shadow-[0_0_15px_#00f0ff] font-black"
                  : "bg-black/80 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/40"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>1. STATUS MATRIX</span>
            </button>

            {/* Mode 2: Alchemy Lab */}
            <button
              onClick={() => handleTabSelect("arena", undefined, "arena-raid-view")}
              className={`px-3 py-1.5 rounded text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === "arena"
                  ? "bg-emerald-500 text-black border-2 border-emerald-200 shadow-[0_0_15px_#10b981] font-black"
                  : "bg-black/80 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/40"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 animate-pulse" />
              <span>2. ALCHEMY LAB</span>
            </button>

            {/* Mode 3: Archives */}
            <button
              onClick={() => handleTabSelect("archives", "syllabus", "archives-grimoire")}
              className={`px-3 py-1.5 rounded text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === "archives"
                  ? "bg-cyan-500 text-black border-2 border-cyan-200 shadow-[0_0_15px_#00f0ff] font-black"
                  : "bg-black/80 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/40"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>3. 10-CH ARCHIVES</span>
            </button>

            {/* Mode 4: Guild */}
            <button
              onClick={() => handleTabSelect("guild", undefined, "guild-hub-view")}
              className={`px-3 py-1.5 rounded text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === "guild"
                  ? "bg-purple-500 text-white border-2 border-purple-200 shadow-[0_0_15px_#c084fc] font-black"
                  : "bg-black/80 text-purple-300 border border-purple-500/40 hover:border-purple-400 hover:bg-purple-950/40"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>4. GUILD HUB</span>
            </button>

            {/* Mode 5: All Modes Continuous View */}
            <button
              onClick={() => handleTabSelect("all", undefined, "status-section")}
              className={`px-3 py-1.5 rounded text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-2 border-amber-200 shadow-[0_0_18px_#fbbf24] font-black"
                  : "bg-black/80 text-amber-300 border border-amber-500/50 hover:border-amber-400 hover:bg-amber-950/40"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>🌟 ALL MODES STREAM</span>
            </button>
          </div>
        </div>

        {/* INDIVIDUAL TAB VIEW OR ALL-MODES STREAM WITH AUTO-SCROLL TARGET ANCHOR */}
        <div id="main-tab-content" className="scroll-mt-24 sm:scroll-mt-28">
          {activeTab === "status" && (
            <div className="animate-fadeIn">
              <StatusScreen
                onTriggerArise={() => setIsAriseOpen(true)}
                userProfile={userProfile}
                onNavigateTab={(tab) => handleTabSelect(tab)}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            </div>
          )}

          {activeTab === "arena" && (
            <div className="animate-fadeIn">
              <VirtualAlchemyLab />
            </div>
          )}

          {activeTab === "archives" && (
            <div className="animate-fadeIn">
              <ChemistryArchives initialSubTab={archivesSubTab} />
            </div>
          )}

          {activeTab === "guild" && (
            <div className="animate-fadeIn">
              <GuildHub />
            </div>
          )}

          {/* ALL MODES CONTINUOUS VIEW (Comfort stream) */}
          {activeTab === "all" && (
            <div className="space-y-12 sm:space-y-16 animate-fadeIn">
              {/* Section 1: Status Screen */}
              <div id="status-section" className="space-y-4 scroll-mt-24 sm:scroll-mt-28">
                <div className="flex items-center gap-2.5 sm:gap-3 border-b-2 border-cyan-400 pb-2">
                  <span className="px-2.5 py-1 bg-cyan-500 text-black font-orbitron font-black text-[11px] sm:text-xs rounded shadow-[0_0_12px_#00f0ff]">
                    MODE 01
                  </span>
                  <h2 className="text-lg sm:text-2xl font-orbitron font-black text-cyan-200 tracking-wide flex items-center gap-2">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 shrink-0" />
                    <span>STATUS MATRIX & ATTRIBUTES</span>
                  </h2>
                </div>
                <StatusScreen
                  onTriggerArise={() => setIsAriseOpen(true)}
                  userProfile={userProfile}
                  onNavigateTab={(tab) => handleTabSelect(tab)}
                  onOpenAuth={() => setIsAuthOpen(true)}
                />
              </div>

              {/* Section 2: Virtual Alchemy Lab */}
              <div id="arena-section" className="space-y-4 scroll-mt-24 sm:scroll-mt-28">
                <div className="flex items-center gap-2.5 sm:gap-3 border-b-2 border-emerald-500 pb-2">
                  <span className="px-2.5 py-1 bg-emerald-500 text-black font-orbitron font-black text-[11px] sm:text-xs rounded shadow-[0_0_12px_#10b981]">
                    MODE 02
                  </span>
                  <h2 className="text-lg sm:text-2xl font-orbitron font-black text-emerald-200 tracking-wide flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
                    <span>VIRTUAL ALCHEMY LAB</span>
                  </h2>
                </div>
                <VirtualAlchemyLab />
              </div>

              {/* Section 3: Chemistry Archives */}
              <div id="archives-section" className="space-y-4 scroll-mt-24 sm:scroll-mt-28">
                <div className="flex items-center gap-2.5 sm:gap-3 border-b-2 border-cyan-400 pb-2">
                  <span className="px-2.5 py-1 bg-cyan-500 text-black font-orbitron font-black text-[11px] sm:text-xs rounded shadow-[0_0_12px_#00f0ff]">
                    MODE 03
                  </span>
                  <h2 className="text-lg sm:text-2xl font-orbitron font-black text-cyan-200 tracking-wide flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 shrink-0" />
                    <span>10-CHAPTER NCERT GRIMOIRE</span>
                  </h2>
                </div>
                <ChemistryArchives initialSubTab={archivesSubTab} />
              </div>

              {/* Section 4: Guild Hub */}
              <div id="guild-section" className="space-y-4 scroll-mt-24 sm:scroll-mt-28">
                <div className="flex items-center gap-2.5 sm:gap-3 border-b-2 border-purple-500 pb-2">
                  <span className="px-2.5 py-1 bg-purple-500 text-white font-orbitron font-black text-[11px] sm:text-xs rounded shadow-[0_0_12px_#c084fc]">
                    MODE 04
                  </span>
                  <h2 className="text-lg sm:text-2xl font-orbitron font-black text-purple-200 tracking-wide flex items-center gap-2">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 shrink-0" />
                    <span>GUILD & SOCIAL HOTLINES</span>
                  </h2>
                </div>
                <GuildHub />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating System Status Footer (Hidden on small mobile screens to prevent dock overlap) */}
      <footer className="hidden md:block fixed bottom-0 left-0 right-0 z-40 px-4 py-1.5 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between system-panel px-4 py-1.5 rounded-t-sm text-[11px] font-mono border-t border-cyan-500/30 bg-black/85 backdrop-blur-md pointer-events-auto gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold font-orbitron">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              SYSTEM PROTOCOL // CBSE-CHEM-043
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a
              href={GAME_METADATA.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 font-orbitron font-bold hidden sm:flex items-center gap-1 transition-colors"
            >
              <Gamepad2 className="w-3 h-3 text-amber-400" />
              <span>REALMS OF CHEMISTRY • AWAKENED GAMES</span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden md:inline text-purple-300/90 font-mono">
              SOLO DEV DANIEL • FEB 15, 2027 COUNTDOWN ACTIVE
            </span>
            <div className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span>ONLINE</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Arise Extraction Modal */}
      <AriseModal
        isOpen={isAriseOpen}
        onClose={() => setIsAriseOpen(false)}
      />

      {/* System Alerts Modal */}
      <SystemAlertModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onSelectTab={(tab) => handleTabSelect(tab)}
      />

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSignInSuccess={handleSignInSuccess}
      />
    </main>
  );
}
