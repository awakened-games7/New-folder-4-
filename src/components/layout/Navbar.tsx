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

export type TabType = "status" | "arena" | "archives" | "guild";

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
    if (activeTab !== tab) {
      sounds.playClick();
      setActiveTab(tab);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-2.5 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between solo-window solo-bracket px-4 py-2.5 rounded-sm pointer-events-auto shadow-neon-blue border-2 border-cyan-400">
        {/* Left: System Identification & Hunter Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff] animate-pulse" />
            <div className="flex flex-col">
              <span className="font-orbitron text-xs tracking-widest text-cyan-300 font-black flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>REALMS OF CHEMISTRY</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400/90 hidden sm:inline">
                BY AWAKENED GAMES • SOLO DEV DANIEL
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-2.5 py-0.5 bg-cyan-950/80 border border-cyan-400/60 rounded text-xs font-orbitron">
            <span className="text-amber-300 font-bold">
              {userProfile ? userProfile.rank : "RANK: S-CANDIDATE"}
            </span>
            <span className="text-cyan-500">|</span>
            <span className="text-cyan-200">
              {userProfile ? `TARGET: ${userProfile.targetPercent}` : "CLASS 12"}
            </span>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Tab 1: Status (Home) */}
          <button
            onClick={() => handleTabClick("status")}
            className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-sm font-orbitron text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-300 ${
              activeTab === "status"
                ? "bg-cyan-500 text-black border-2 border-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.7)] font-black"
                : "text-slate-300 hover:text-cyan-200 hover:bg-cyan-950/40 border border-transparent"
            }`}
          >
            <Shield className={`w-3.5 h-3.5 ${activeTab === "status" ? "text-black" : "text-cyan-400"}`} />
            <span>STATUS</span>
            {activeTab === "status" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-black" />
            )}
          </button>

          {/* Tab 2: Boss Raid Arena */}
          <button
            onClick={() => handleTabClick("arena")}
            className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-sm font-orbitron text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-300 ${
              activeTab === "arena"
                ? "bg-rose-500 text-white border-2 border-rose-300 shadow-[0_0_20px_rgba(255,40,90,0.7)] font-black"
                : "text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 border border-transparent"
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${activeTab === "arena" ? "text-white" : "text-rose-400 animate-pulse"}`} />
            <span>BOSS ARENA</span>
            {activeTab === "arena" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-white" />
            )}
          </button>

          {/* Tab 3: The Archives (Realms of Chemistry) */}
          <button
            onClick={() => handleTabClick("archives")}
            className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-sm font-orbitron text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-300 ${
              activeTab === "archives"
                ? "bg-cyan-500 text-black border-2 border-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.7)] font-black"
                : "text-slate-300 hover:text-cyan-200 hover:bg-cyan-950/40 border border-transparent"
            }`}
          >
            <FlaskConical className={`w-3.5 h-3.5 ${activeTab === "archives" ? "text-black" : "text-cyan-400"}`} />
            <span>ARCHIVES</span>
            {activeTab === "archives" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-black" />
            )}
          </button>

          {/* Tab 4: Guild (Community) */}
          <button
            onClick={() => handleTabClick("guild")}
            className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-sm font-orbitron text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-300 ${
              activeTab === "guild"
                ? "bg-cyan-500 text-black border-2 border-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.7)] font-black"
                : "text-slate-300 hover:text-cyan-200 hover:bg-cyan-950/40 border border-transparent"
            }`}
          >
            <Users className={`w-3.5 h-3.5 ${activeTab === "guild" ? "text-black" : "text-cyan-400"}`} />
            <span>GUILD</span>
            {activeTab === "guild" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-black" />
            )}
          </button>
        </nav>

        {/* Right: Awaken Button, Google Play Link, ARISE, Clock, Sound */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Direct Google Play Quick Button */}
          <a
            href={GAME_METADATA.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.playLevelUp()}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-600/80 to-teal-600/80 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400 text-white text-xs font-orbitron font-bold rounded shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
            title="Download on Google Play"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
            <span>PLAY STORE</span>
          </a>

          {/* Awaken / Sign In */}
          {userProfile ? (
            <div className="flex items-center gap-2 bg-cyan-950/80 border border-cyan-400/60 rounded px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <span className="text-xs font-rajdhani font-bold text-slate-100 truncate max-w-[110px] sm:max-w-[130px]">
                {userProfile.name}
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onSignOut) onSignOut();
                }}
                className="text-slate-400 hover:text-rose-400 p-0.5 ml-1"
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
              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-cyan-600/60 to-blue-600/60 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400 text-cyan-100 text-xs font-orbitron font-bold rounded shadow-neon-blue transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>AWAKEN</span>
            </button>
          )}

          {/* Quick ARISE Button */}
          {onTriggerArise && (
            <button
              onClick={() => {
                sounds.playAriseEcho();
                onTriggerArise();
              }}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-400 text-purple-200 text-xs font-orbitron font-bold rounded transition-all shadow-[0_0_20px_rgba(168,85,247,0.5)] group"
              title="Trigger Shadow Extraction"
            >
              <Flame className="w-3.5 h-3.5 text-purple-400 group-hover:scale-125 transition-transform" />
              <span>ARISE</span>
            </button>
          )}

          {/* System Time */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-black/80 border border-cyan-500/40 rounded font-mono text-xs text-cyan-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>{timeString || "00:00:00"}</span>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => {
              sounds.playAlert();
              if (onOpenAlerts) onOpenAlerts();
            }}
            className="relative p-1.5 text-slate-200 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-400/60 rounded transition-colors"
            title="System Announcements"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] text-white font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_#ff285a]">
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
            title={soundEnabled ? "Mute System Audio FX" : "Unmute System Audio FX"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
