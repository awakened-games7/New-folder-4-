"use client";

import React, { useState } from "react";
import Navbar, { TabType } from "../components/layout/Navbar";
import HeroAwakening from "../components/layout/HeroAwakening";
import StatusScreen from "../components/status/StatusScreen";
import BossRaidArena from "../components/arena/BossRaidArena";
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
  Flame,
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
  const [userProfile, setUserProfile] = useState<StudentHunterProfile | null>({
    name: "Hunter Daniel",
    email: "hunter@student.cbse.edu",
    targetPercent: "95%+ (S-Rank)",
    stream: "Science (PCM)",
    rank: "S-RANK CANDIDATE",
    level: 142,
  });

  const handleTabSelect = (tab: TabType) => {
    sounds.playClick();
    setActiveTab(tab);
  };

  return (
    <main className="relative min-h-screen text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabSelect}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        unreadCount={2}
        onTriggerArise={() => setIsAriseOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        userProfile={userProfile}
        onSignOut={() => setUserProfile(null)}
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
        />

        {/* COMFORT MODE QUICK-SWITCHER BAR (Desktop sticky pill bar) */}
        <div className="hidden md:flex sticky top-16 z-30 mb-8 py-2 -mx-2 px-3 bg-black/85 backdrop-blur-md rounded border border-cyan-500/30 shadow-[0_4px_25px_rgba(0,0,0,0.8)] items-center justify-between gap-2 overflow-x-auto">
          <span className="text-[11px] font-orbitron font-bold text-cyan-400 shrink-0 px-2">
            SYSTEM MODE SELECTOR:
          </span>

          <div className="flex items-center gap-2 flex-1 justify-start">
            {/* Mode 1: Status */}
            <button
              onClick={() => handleTabSelect("status")}
              className={`px-3 py-1.5 rounded text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === "status"
                  ? "bg-cyan-500 text-black border-2 border-cyan-200 shadow-[0_0_15px_#00f0ff] font-black"
                  : "bg-black/80 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/40"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>1. STATUS MATRIX</span>
            </button>

            {/* Mode 2: Boss Arena */}
            <button
              onClick={() => handleTabSelect("arena")}
              className={`px-3 py-1.5 rounded text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === "arena"
                  ? "bg-rose-500 text-white border-2 border-rose-200 shadow-[0_0_15px_#ff285a] font-black"
                  : "bg-black/80 text-rose-300 border border-rose-500/40 hover:border-rose-400 hover:bg-rose-950/40"
              }`}
            >
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>2. BOSS ARENA</span>
            </button>

            {/* Mode 3: Archives */}
            <button
              onClick={() => handleTabSelect("archives")}
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
              onClick={() => handleTabSelect("guild")}
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
              onClick={() => handleTabSelect("all")}
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

        {/* INDIVIDUAL TAB VIEW OR ALL-MODES STREAM */}
        {activeTab === "status" && (
          <div className="animate-fadeIn">
            <StatusScreen
              onTriggerArise={() => setIsAriseOpen(true)}
              userProfile={userProfile}
              onNavigateTab={(tab) => handleTabSelect(tab)}
            />
          </div>
        )}

        {activeTab === "arena" && (
          <div className="animate-fadeIn">
            <BossRaidArena onTriggerArise={() => setIsAriseOpen(true)} />
          </div>
        )}

        {activeTab === "archives" && (
          <div className="animate-fadeIn">
            <ChemistryArchives />
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
            <div id="status-section" className="space-y-4">
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
              />
            </div>

            {/* Section 2: Boss Arena */}
            <div id="arena-section" className="space-y-4">
              <div className="flex items-center gap-2.5 sm:gap-3 border-b-2 border-rose-500 pb-2">
                <span className="px-2.5 py-1 bg-rose-500 text-white font-orbitron font-black text-[11px] sm:text-xs rounded shadow-[0_0_12px_#ff285a]">
                  MODE 02
                </span>
                <h2 className="text-lg sm:text-2xl font-orbitron font-black text-rose-200 tracking-wide flex items-center gap-2">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 animate-pulse shrink-0" />
                  <span>PYQ BOSS RAID ARENA</span>
                </h2>
              </div>
              <BossRaidArena onTriggerArise={() => setIsAriseOpen(true)} />
            </div>

            {/* Section 3: Chemistry Archives */}
            <div id="archives-section" className="space-y-4">
              <div className="flex items-center gap-2.5 sm:gap-3 border-b-2 border-cyan-400 pb-2">
                <span className="px-2.5 py-1 bg-cyan-500 text-black font-orbitron font-black text-[11px] sm:text-xs rounded shadow-[0_0_12px_#00f0ff]">
                  MODE 03
                </span>
                <h2 className="text-lg sm:text-2xl font-orbitron font-black text-cyan-200 tracking-wide flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 shrink-0" />
                  <span>10-CHAPTER NCERT GRIMOIRE</span>
                </h2>
              </div>
              <ChemistryArchives />
            </div>

            {/* Section 4: Guild Hub */}
            <div id="guild-section" className="space-y-4">
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
        onSignInSuccess={(profile) => setUserProfile(profile)}
      />
    </main>
  );
}
