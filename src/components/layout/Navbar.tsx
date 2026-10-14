"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  FlaskConical,
  Users,
  Volume2,
  VolumeX,
  Bell,
  Cpu,
  Activity,
  Flame,
  LogOut,
  Sparkles,
  Gamepad2,
  ExternalLink,
} from "lucide-react";
import { sounds } from "../audio/soundEffects";
import { StudentHunterProfile } from "../auth/GoogleAuthModal";
import { GAME_METADATA } from "../archives/ChemistryArchives";
import { Layers } from "lucide-react";

export type TabType = "status" | "arena" | "archives" | "guild" | "all";

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAlerts?: () => void;
  unreadCount?: number;
  onTriggerArise?: () => void;
  onOpenAuth?: () => void;
  userProfile?: StudentHunterProfile | null;
  onSignOut?: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenAlerts,
  unreadCount = 2,
  onTriggerArise,
  onOpenAuth,
  userProfile,
  onSignOut,
}: NavbarProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.enabled = newState;
    if (newState) {
      sounds.playClick();
    }
  };

  const handleTabClick = (tab: TabType) => {
    sounds.playClick();
    setActiveTab(tab);
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-6 py-2 sm:py-2.5 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between solo-window solo-bracket px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm pointer-events-auto shadow-neon-blue border-2 border-cyan-400">
          {/* Left: System Identification & Hunter Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff] animate-pulse" />
              <div className="flex flex-col">
                <span className="font-orbitron text-[11px] sm:text-xs tracking-widest text-cyan-300 font-black flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-none">REALMS OF CHEMISTRY</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400/90 hidden sm:inline">
                  BY AWAKENED GAMES • SOLO DEV DANIEL
                </span>
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-2 px-2.5 py-0.5 bg-cyan-950/80 border border-cyan-400/60 rounded text-xs font-orbitron">
              <span className="text-amber-300 font-bold">
                {userProfile ? userProfile.rank : "RANK: UNAWAKENED"}
              </span>
              <span className="text-cyan-500">|</span>
              <span className="text-cyan-200">
                {userProfile ? `TARGET: ${userProfile.targetPercent}` : "CBSE CLASS 12"}
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Tabs (Hidden on mobile, bottom dock used instead) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {/* Tab 1: Status */}
            <button
              onClick={() => handleTabClick("status")}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-sm font-orbitron text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-300 ${
                activeTab === "status"
                  ? "bg-cyan-500 text-black border-2 border-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.7)] font-black"
                  : "text-slate-300 hover:text-cyan-200 hover:bg-cyan-950/40 border border-transparent"
              }`}
            >
              <Shield className={`w-3.5 h-3.5 ${activeTab === "status" ? "text-black" : "text-cyan-400"}`} />
              <span>STATUS</span>
              {activeTab === "status" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-black" />
              )}
            </button>

            {/* Tab 2: Alchemy Lab */}
            <button
              onClick={() => handleTabClick("arena")}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-sm font-orbitron text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-300 ${
                activeTab === "arena"
                  ? "bg-emerald-500 text-black border-2 border-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.7)] font-black"
                  : "text-emerald-300 hover:text-emerald-100 hover:bg-emerald-950/40 border border-transparent"
              }`}
            >
              <FlaskConical className={`w-3.5 h-3.5 ${activeTab === "arena" ? "text-black" : "text-emerald-400 animate-pulse"}`} />
              <span>ALCHEMY</span>
              {activeTab === "arena" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-black" />
              )}
            </button>

            {/* Tab 3: The Archives */}
            <button
              onClick={() => handleTabClick("archives")}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-sm font-orbitron text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-300 ${
                activeTab === "archives"
                  ? "bg-cyan-500 text-black border-2 border-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.7)] font-black"
                  : "text-slate-300 hover:text-cyan-200 hover:bg-cyan-950/40 border border-transparent"
              }`}
            >
              <FlaskConical className={`w-3.5 h-3.5 ${activeTab === "archives" ? "text-black" : "text-cyan-400"}`} />
              <span>ARCHIVES</span>
              {activeTab === "archives" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-black" />
              )}
            </button>

            {/* Tab 4: Guild */}
            <button
              onClick={() => handleTabClick("guild")}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-sm font-orbitron text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-300 ${
                activeTab === "guild"
                  ? "bg-purple-500 text-white border-2 border-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.7)] font-black"
                  : "text-slate-300 hover:text-purple-200 hover:bg-purple-950/40 border border-transparent"
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${activeTab === "guild" ? "text-white" : "text-purple-400"}`} />
              <span>GUILD</span>
              {activeTab === "guild" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-white" />
              )}
            </button>

            {/* Tab 5: ALL MODES Stream */}
            <button
              onClick={() => handleTabClick("all")}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-sm font-orbitron text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-2 border-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.8)] font-black"
                  : "text-amber-300 hover:text-amber-100 hover:bg-amber-950/40 border border-amber-500/40"
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${activeTab === "all" ? "text-black" : "text-amber-400"}`} />
              <span>ALL MODES</span>
              {activeTab === "all" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-black" />
              )}
            </button>
          </nav>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Play Store APK Link (Mobile & Desktop) */}
            <a
              href={GAME_METADATA.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playLevelUp()}
              className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400 text-white text-[10px] sm:text-xs font-orbitron font-bold rounded shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
              title="Download on Google Play"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
              <span className="hidden sm:inline">PLAY STORE</span>
              <span className="sm:hidden">APK</span>
            </a>

            {/* Profile / Awaken */}
            {userProfile ? (
              <div className="flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-400/60 rounded px-2 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                <span className="text-[10px] sm:text-xs font-rajdhani font-bold text-slate-100 truncate max-w-[80px] sm:max-w-[130px]">
                  {userProfile.name}
                </span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onSignOut) onSignOut();
                  }}
                  className="text-slate-400 hover:text-rose-400 p-0.5 ml-0.5"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  sounds.playAlert();
                  if (onOpenAuth) onOpenAuth();
                }}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-gradient-to-r from-cyan-600/60 to-blue-600/60 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400 text-cyan-100 text-[10px] sm:text-xs font-orbitron font-bold rounded shadow-neon-blue transition-all"
              >
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>SIGN IN</span>
              </button>
            )}

            {/* Notifications Bell */}
            <button
              onClick={() => {
                sounds.playAlert();
                if (onOpenAlerts) onOpenAlerts();
              }}
              className="relative p-1.5 text-slate-200 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-400/60 rounded transition-colors"
              title="System Announcements"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-[9px] text-white font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_#ff285a]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Audio FX Toggle */}
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded border transition-colors ${
                soundEnabled
                  ? "text-cyan-300 bg-cyan-950/60 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                  : "text-slate-500 bg-black/60 border-slate-700"
              }`}
              title={soundEnabled ? "Mute Audio" : "Unmute Audio"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE PINNED BOTTOM NAVIGATION DOCK (Shown only on mobile screens < 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t-2 border-cyan-400 backdrop-blur-lg px-2 py-1.5 shadow-[0_-5px_25px_rgba(0,0,0,0.9)] flex items-center justify-around">
        {/* Mobile Tab 1: Status */}
        <button
          onClick={() => handleTabClick("status")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded transition-all ${
            activeTab === "status"
              ? "text-cyan-300 font-bold drop-shadow-[0_0_10px_#00f0ff]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Shield className={`w-5 h-5 ${activeTab === "status" ? "text-cyan-400 stroke-[2.5]" : "text-slate-400"}`} />
          <span className="text-[9px] font-orbitron mt-0.5">STATUS</span>
        </button>

        {/* Mobile Tab 2: Alchemy Lab */}
        <button
          onClick={() => handleTabClick("arena")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded transition-all ${
            activeTab === "arena"
              ? "text-emerald-400 font-bold drop-shadow-[0_0_10px_#10b981]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FlaskConical className={`w-5 h-5 ${activeTab === "arena" ? "text-emerald-400 stroke-[2.5]" : "text-slate-400"}`} />
          <span className="text-[9px] font-orbitron mt-0.5">LAB</span>
        </button>

        {/* Mobile Tab 3: Archives (10 Chapters) */}
        <button
          onClick={() => handleTabClick("archives")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded transition-all ${
            activeTab === "archives"
              ? "text-cyan-300 font-bold drop-shadow-[0_0_10px_#00f0ff]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FlaskConical className={`w-5 h-5 ${activeTab === "archives" ? "text-cyan-400 stroke-[2.5]" : "text-slate-400"}`} />
          <span className="text-[9px] font-orbitron mt-0.5">10-CH</span>
        </button>

        {/* Mobile Tab 4: Guild */}
        <button
          onClick={() => handleTabClick("guild")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded transition-all ${
            activeTab === "guild"
              ? "text-purple-400 font-bold drop-shadow-[0_0_10px_#c084fc]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className={`w-5 h-5 ${activeTab === "guild" ? "text-purple-400 stroke-[2.5]" : "text-slate-400"}`} />
          <span className="text-[9px] font-orbitron mt-0.5">GUILD</span>
        </button>

        {/* Mobile Tab 5: All Stream */}
        <button
          onClick={() => handleTabClick("all")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded transition-all ${
            activeTab === "all"
              ? "text-amber-300 font-bold drop-shadow-[0_0_10px_#fbbf24]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className={`w-5 h-5 ${activeTab === "all" ? "text-amber-400 stroke-[2.5]" : "text-slate-400"}`} />
          <span className="text-[9px] font-orbitron mt-0.5">ALL</span>
        </button>
      </nav>
    </>
  );
}
