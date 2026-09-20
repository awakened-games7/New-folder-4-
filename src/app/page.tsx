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
import { Terminal, Shield, Sparkles, Activity, ExternalLink, Gamepad2 } from "lucide-react";
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

  return (
    <main className="relative min-h-screen text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        unreadCount={2}
        onTriggerArise={() => setIsAriseOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        userProfile={userProfile}
        onSignOut={() => setUserProfile(null)}
      />

      {/* Fixed Vertical Social Sidebar on the Right */}
      <SocialSidebar />

      {/* Main Content Area with padding for fixed top nav */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-24">
        {/* Dynamic Hero Awakening Header Showcase */}
        <HeroAwakening
          onTriggerArise={() => setIsAriseOpen(true)}
          onNavigateTab={(tab) => setActiveTab(tab)}
          activeTab={activeTab}
          userProfile={userProfile}
        />

        {/* Active Tab View */}
        {activeTab === "status" && (
          <StatusScreen
            onTriggerArise={() => setIsAriseOpen(true)}
            userProfile={userProfile}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === "arena" && (
          <BossRaidArena
            onTriggerArise={() => setIsAriseOpen(true)}
          />
        )}
        {activeTab === "archives" && <ChemistryArchives />}
        {activeTab === "guild" && <GuildHub />}
      </div>

      {/* Floating System Status Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 px-4 py-1.5 pointer-events-none">
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
        onSelectTab={(tab) => setActiveTab(tab)}
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
