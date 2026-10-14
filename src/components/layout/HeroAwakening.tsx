"use client";

import React, { useState, useEffect } from "react";
import {
  Skull,
  Flame,
  Gamepad2,
  ExternalLink,
  MessageCircle,
  Instagram,
  Sparkles,
  Zap,
  Clock,
  Shield,
  Trophy,
  Crown,
  ChevronRight,
  Radio,
  Atom,
  BookOpen,
  Sword,
  Scroll,
  Users,
  Download,
  CheckCircle2,
} from "lucide-react";
import { sounds } from "../audio/soundEffects";
import { GAME_METADATA } from "../archives/ChemistryArchives";
import { StudentHunterProfile } from "../auth/GoogleAuthModal";
import { TabType } from "./Navbar";

interface HeroAwakeningProps {
  onTriggerArise: () => void;
  onNavigateTab: (tab: TabType, subTab?: "syllabus" | "bosses" | "cheatsheet", targetSectionId?: string) => void;
  activeTab: TabType;
  userProfile: StudentHunterProfile | null;
  onOpenAuth?: () => void;
}

export default function HeroAwakening({
  onTriggerArise,
  onNavigateTab,
  activeTab,
  userProfile,
  onOpenAuth,
}: HeroAwakeningProps) {
  const targetDate = new Date("2027-02-15T09:00:00+05:30").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="space-y-6 mb-8 animate-fadeIn">
      {/* 1. TOP SYSTEM NOTIFICATION & GAME SHOWCASE BANNER */}
      <div className="solo-window solo-bracket border-2 border-cyan-400 p-5 sm:p-7 rounded-sm bg-gradient-to-r from-blue-950/90 via-black to-purple-950/90 shadow-[0_0_40px_rgba(0,240,255,0.45)] relative overflow-hidden">
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 animate-pulse" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: System Title & Lore */}
          <div className="space-y-3.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>OFFICIAL GAME SYSTEM // VER. 2.7</span>
              </span>
              <span className="px-3 py-1 rounded bg-purple-950 border border-purple-400 text-purple-300 font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <Crown className="w-3.5 h-3.5 text-purple-400" />
                <span>MONARCH REVISION ENGINE</span>
              </span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold font-mono">
                CBSE CODE 043 • 70 MARKS
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-100 to-purple-300 tracking-tight leading-tight drop-shadow-[0_0_25px_rgba(0,240,255,0.5)] break-words">
                REALMS OF CHEMISTRY
              </h1>
              <div className="text-xs sm:text-sm font-orbitron font-bold text-cyan-400 tracking-widest flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span>SOLO LEVELING SYSTEM INTERFACE</span>
                <span className="text-purple-400">•</span>
                <span className="text-purple-300">CBSE CLASS 12</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-rajdhani font-medium leading-relaxed max-w-2xl">
              Conquer CBSE Class 12 Chemistry with interactive 10-chapter NCERT checklists, PYQ boss combat raids, high-yield formula matrix, and live hunter attributes. Developed by <span className="text-amber-300 font-bold font-orbitron">Solo Developer Daniel</span> for <span className="text-cyan-300 font-bold font-orbitron">Awakened Games</span>.
            </p>

            {/* Quick Action Buttons - Mobile Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 sm:gap-3 pt-2">
              {/* Play Store APK Download */}
              <a
                href={GAME_METADATA.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                className="py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 border-2 border-emerald-300 text-white font-orbitron font-black text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.7)] transition-all hover:scale-105 active:scale-95 min-h-[44px]"
              >
                <Gamepad2 className="w-4 h-4 shrink-0" />
                <span>GET ON GOOGLE PLAY</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-100 shrink-0" />
              </a>

              {/* Arise Trigger */}
              <button
                onClick={() => {
                  sounds.playAriseEcho();
                  onTriggerArise();
                }}
                className="py-3 px-4 bg-gradient-to-r from-purple-900 via-purple-700 to-blue-900 hover:from-purple-800 hover:to-blue-800 border-2 border-purple-400 text-purple-100 font-orbitron font-black text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all hover:scale-105 active:scale-95 min-h-[44px]"
              >
                <Flame className="w-4 h-4 text-purple-300 animate-pulse shrink-0" />
                <span>COMMAND: &ldquo;ARISE&rdquo;</span>
              </button>

              {/* WhatsApp Hotline */}
              <a
                href={GAME_METADATA.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                className="py-2.5 px-3.5 bg-emerald-950/90 hover:bg-emerald-900 border-2 border-emerald-400 text-emerald-200 font-orbitron font-bold text-xs uppercase rounded flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all hover:scale-105 min-h-[44px]"
                title="WhatsApp Direct Hotline +91 7904873647"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 7904873647</span>
              </a>

              {/* Instagram */}
              <a
                href={GAME_METADATA.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                className="py-2.5 px-3.5 bg-pink-950/90 hover:bg-pink-900 border-2 border-pink-400 text-pink-200 font-orbitron font-bold text-xs uppercase rounded flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(244,114,182,0.4)] transition-all hover:scale-105 min-h-[44px]"
                title="Follow @king_daniel_dev"
              >
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <span>@king_daniel_dev</span>
              </a>
            </div>
          </div>

          {/* Right: Quick Monarch Stats Passport */}
          <div className="solo-window p-4 sm:p-5 rounded-sm border-2 border-cyan-400 bg-black/95 shadow-[0_0_30px_rgba(0,240,255,0.35)] flex flex-col justify-between w-full lg:w-auto lg:min-w-[280px]">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/40">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="font-orbitron text-xs font-bold text-cyan-300">
                  PLAYER STATUS CARD
                </span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  userProfile
                    ? "text-amber-300 bg-amber-950 border border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                    : "text-slate-300 bg-slate-900 border border-slate-600"
                }`}
              >
                {userProfile ? userProfile.rank : "NOT SIGNED IN"}
              </span>
            </div>

            <div className="py-3 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">HUNTER:</span>
                {userProfile ? (
                  <span className="text-cyan-200 font-bold font-orbitron">
                    {userProfile.name}
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      sounds.playAlert();
                      onOpenAuth?.();
                    }}
                    className="px-2.5 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-orbitron font-black text-[11px] rounded shadow-[0_0_12px_#00f0ff] transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                    title="Click to Sign In and Awaken"
                  >
                    <Sparkles className="w-3 h-3 text-black animate-pulse" />
                    <span>SIGN IN</span>
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">CLASS:</span>
                <span className="text-purple-300 font-bold">
                  {userProfile ? "ALCHEMICAL MONARCH" : "UNAWAKENED"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">LEVEL:</span>
                <span className="text-cyan-300 font-black font-orbitron text-sm">
                  {userProfile ? `LV. ${userProfile.level}` : "LV. --"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">TARGET:</span>
                {userProfile ? (
                  <span className="text-emerald-300 font-bold">{userProfile.targetPercent}</span>
                ) : (
                  <button
                    onClick={() => onOpenAuth?.()}
                    className="text-emerald-400 hover:text-emerald-300 font-bold underline decoration-dotted text-[11px]"
                  >
                    95%+ (SET ON SIGN IN)
                  </button>
                )}
              </div>
            </div>

            {/* Quick Mode Navigation Chips */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyan-500/40 font-orbitron text-[10px]">
              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigateTab("status", undefined, "status-matrix-view");
                }}
                className={`p-2.5 rounded text-center border font-bold transition-all min-h-[38px] flex items-center justify-center ${
                  activeTab === "status"
                    ? "bg-cyan-500 text-black border-cyan-200 font-black shadow-[0_0_15px_#00f0ff]"
                    : "bg-black/80 text-cyan-200 border-cyan-500/50 hover:border-cyan-300 hover:bg-cyan-950/40"
                }`}
              >
                STATUS MATRIX
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigateTab("arena", undefined, "arena-raid-view");
                }}
                className={`p-2.5 rounded text-center border font-bold transition-all min-h-[38px] flex items-center justify-center ${
                  activeTab === "arena"
                    ? "bg-rose-500 text-white border-rose-200 font-black shadow-[0_0_15px_#ff285a]"
                    : "bg-black/80 text-rose-300 border-rose-500/50 hover:border-rose-300 hover:bg-rose-950/40"
                }`}
              >
                ⚔️ BOSS ARENA
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigateTab("archives", "syllabus", "archives-grimoire");
                }}
                className={`p-2.5 rounded text-center border font-bold transition-all min-h-[38px] flex items-center justify-center ${
                  activeTab === "archives"
                    ? "bg-cyan-500 text-black border-cyan-200 font-black shadow-[0_0_15px_#00f0ff]"
                    : "bg-black/80 text-cyan-200 border-cyan-500/50 hover:border-cyan-300 hover:bg-cyan-950/40"
                }`}
              >
                📜 ARCHIVES
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigateTab("guild", undefined, "guild-hub-view");
                }}
                className={`p-2.5 rounded text-center border font-bold transition-all min-h-[38px] flex items-center justify-center ${
                  activeTab === "guild"
                    ? "bg-purple-500 text-white border-purple-200 font-black shadow-[0_0_15px_#c084fc]"
                    : "bg-black/80 text-purple-200 border-purple-500/50 hover:border-purple-300 hover:bg-purple-950/40"
                }`}
              >
                🏰 GUILD HUB
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FOUR VIBRANT INTERACTIVE FEATURE GATEWAY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Feature 1: NCERT Checklist */}
        <div
          onClick={() => {
            sounds.playClick();
            onNavigateTab("archives", "syllabus", "archives-grimoire");
          }}
          className="solo-window solo-bracket p-4 rounded-sm border-2 border-cyan-400 bg-gradient-to-b from-cyan-950/80 to-black hover:border-cyan-300 cursor-pointer transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(0,240,255,0.25)] group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 group-hover:shadow-[0_0_15px_#00f0ff]">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold">
              10 CHAPTERS
            </span>
          </div>
          <h3 className="font-orbitron font-bold text-sm text-cyan-200 group-hover:text-cyan-100">
            10-CHAPTER GRIMOIRE
          </h3>
          <p className="text-xs text-slate-300 font-rajdhani mt-1 line-clamp-2">
            Complete CBSE 12th syllabus checklist with high-yield tags across Physical (23M), Inorganic (14M) & Organic (33M).
          </p>
          <div className="mt-3 pt-2 border-t border-cyan-500/30 flex items-center justify-between text-[11px] font-orbitron font-bold text-cyan-400">
            <span>OPEN CHECKLIST</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Feature 2: Boss Raid Arena */}
        <div
          onClick={() => {
            sounds.playClick();
            onNavigateTab("arena", undefined, "arena-raid-view");
          }}
          className="solo-window-danger solo-bracket solo-bracket-danger p-4 rounded-sm border-2 border-rose-500 bg-gradient-to-b from-rose-950/80 to-black hover:border-rose-400 cursor-pointer transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,40,90,0.3)] group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-300 group-hover:shadow-[0_0_15px_#ff285a]">
              <Sword className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-400 text-rose-300 font-bold">
              PYQ COMBAT
            </span>
          </div>
          <h3 className="font-orbitron font-bold text-sm text-rose-200 group-hover:text-rose-100">
            PYQ BOSS RAID ARENA
          </h3>
          <p className="text-xs text-slate-300 font-rajdhani mt-1 line-clamp-2">
            Battle 4 CBSE Calamity Bosses using real 10-year board questions, formula attacks, combo multipliers & sound FX.
          </p>
          <div className="mt-3 pt-2 border-t border-rose-500/30 flex items-center justify-between text-[11px] font-orbitron font-bold text-rose-400">
            <span>ENTER ARENA</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Feature 3: Formula Matrix */}
        <div
          onClick={() => {
            sounds.playClick();
            onNavigateTab("archives", "cheatsheet", "archives-cheatsheet");
          }}
          className="solo-window-amber solo-bracket p-4 rounded-sm border-2 border-amber-400 bg-gradient-to-b from-amber-950/80 to-black hover:border-amber-300 cursor-pointer transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(251,191,36,0.25)] group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 group-hover:shadow-[0_0_15px_#fbbf24]">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-400 text-amber-300 font-bold">
              CHEAT MATRIX
            </span>
          </div>
          <h3 className="font-orbitron font-bold text-sm text-amber-200 group-hover:text-amber-100">
            FORMULA CODEX
          </h3>
          <p className="text-xs text-slate-300 font-rajdhani mt-1 line-clamp-2">
            Instant 1-click copy for Nernst equations, Raoult&apos;s law, Arrhenius activation slope & all named organic mechanisms.
          </p>
          <div className="mt-3 pt-2 border-t border-amber-500/30 flex items-center justify-between text-[11px] font-orbitron font-bold text-amber-400">
            <span>VIEW FORMULAS</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Feature 4: Guild & Dev Channels */}
        <div
          onClick={() => {
            sounds.playClick();
            onNavigateTab("guild", undefined, "guild-hub-view");
          }}
          className="solo-window-purple solo-bracket solo-bracket-purple p-4 rounded-sm border-2 border-purple-400 bg-gradient-to-b from-purple-950/80 to-black hover:border-purple-300 cursor-pointer transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(168,85,247,0.25)] group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 group-hover:shadow-[0_0_15px_#c084fc]">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-400 text-purple-300 font-bold">
              COMMUNITY
            </span>
          </div>
          <h3 className="font-orbitron font-bold text-sm text-purple-200 group-hover:text-purple-100">
            GUILD HUB & SOCIALS
          </h3>
          <p className="text-xs text-slate-300 font-rajdhani mt-1 line-clamp-2">
            WhatsApp hotline (+91 7904873647), Instagram (@king_daniel_dev), YouTube masterclasses & study halls.
          </p>
          <div className="mt-3 pt-2 border-t border-purple-500/30 flex items-center justify-between text-[11px] font-orbitron font-bold text-purple-400">
            <span>ENTER GUILD</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
