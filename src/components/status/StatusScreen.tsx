"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  Heart,
  Shield,
  Award,
  Sparkles,
  Timer,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Minus,
  Crown,
  Calendar,
  Flame,
  Radio,
  Clock,
  Skull,
  ArrowRight,
  Atom,
  Gamepad2,
  ExternalLink,
} from "lucide-react";
import { sounds } from "../audio/soundEffects";
import { StudentHunterProfile } from "../auth/GoogleAuthModal";
import { GAME_METADATA } from "../archives/ChemistryArchives";

interface BulletinNotice {
  id: string;
  title: string;
  category: "Official Circular" | "Exam Pattern" | "Sample Papers" | "Practicals";
  date: string;
  badge: string;
  summary: string;
  officialRef: string;
  badgeColor: string;
  urgent?: boolean;
}

const BULLETIN_NOTICES: BulletinNotice[] = [
  {
    id: "b1",
    title: "CBSE 2027 Class 12 Chemistry Sample Papers Released",
    category: "Sample Papers",
    date: "Aug 28, 2026",
    badge: "OFFICIAL RELEASE",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/60",
    summary: "CBSE has officially published the 2026-2027 Chemistry (Code 043) model question paper with step-wise marking scheme. 50% Competency-Based Questions (CBQs) confirmed.",
    officialRef: "CBSE/ACAD/2026/CIRC-114",
    urgent: true,
  },
  {
    id: "b2",
    title: "Organic Chemistry Weightage Confirmed at 33 Marks",
    category: "Exam Pattern",
    date: "Aug 20, 2026",
    badge: "33 MARKS ZONE",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/60",
    summary: "Haloalkanes, Alcohols, Aldehydes-Ketones, Amines, and Biomolecules constitute 33 out of 70 theory marks. Named reaction mechanisms are mandatory high-yield zones.",
    officialRef: "CBSE/DIR/CURR/CHEM-043",
    urgent: false,
  },
  {
    id: "b3",
    title: "Class 12 Board Practical Exam Schedule Announced",
    category: "Practicals",
    date: "Aug 15, 2026",
    badge: "30 MARKS PRACTICAL",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/60",
    summary: "Winter & Regular zone practical exams to commence from Jan 1, 2027. Salt analysis (8 Marks), Volumetric Analysis (8 Marks), Project & Viva (8 Marks), Experiments (6 Marks).",
    officialRef: "CBSE/EXAM/PRAC/2026-27",
    urgent: false,
  },
  {
    id: "b4",
    title: "Physical Chemistry Numerical Section Blueprint (23 Marks)",
    category: "Official Circular",
    date: "Aug 02, 2026",
    badge: "23 MARKS NUMERICAL",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/60",
    summary: "Solutions, Electrochemistry, and Chemical Kinetics carry 23 marks. Full step-marking awarded for formula statement, SI unit conversions, and log/antilog substitutions.",
    officialRef: "CBSE/EVAL/SCHEME-2027",
    urgent: false,
  },
];

export default function StatusScreen({
  onTriggerArise,
  userProfile,
  onNavigateTab,
}: {
  onTriggerArise?: () => void;
  userProfile?: StudentHunterProfile | null;
  onNavigateTab?: (tab: "status" | "archives" | "guild") => void;
}) {
  // Target: February 15, 2027 at 09:00:00 AM IST
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

  const [selectedNotice, setSelectedNotice] = useState<BulletinNotice | null>(null);

  // Subject Hunter Attributes
  const [stats, setStats] = useState({
    strength: 324, // Physical Chemistry
    agility: 340,  // Speed & Accuracy
    sense: 310,    // Conceptual Perception
    vitality: 290, // Memory Retention
    intelligence: 375, // Organic Synthesis Mechanisms
  });

  const [availablePoints, setAvailablePoints] = useState(12);

  // Daily Quests
  const [dailyQuests, setDailyQuests] = useState([
    { id: 1, text: "Solve 10 Electrochemistry PYQs [10/10] (Nernst Equation & Cell EMF)", completed: true, marksTag: "9 Marks" },
    { id: 2, text: "Revise 5 Organic Named Reactions (Aldol, Reimer-Tiemann, Cannizzaro)", completed: true, marksTag: "8 Marks" },
    { id: 3, text: "Memorize Arrhenius Equation & Activation Energy Slope Graphs", completed: false, marksTag: "7 Marks" },
    { id: 4, text: "Attempt 1 Timed Section-A Mock Raid in 'Realms of Chemistry'", completed: false, marksTag: "Boss Raid" },
  ]);

  const [questClaimed, setQuestClaimed] = useState(false);

  const handleStatChange = (key: keyof typeof stats, delta: number) => {
    if (delta > 0 && availablePoints > 0) {
      sounds.playStatUpgrade();
      setAvailablePoints((p) => p - 1);
      setStats((s) => ({ ...s, [key]: s[key] + 1 }));
    }
  };

  const handleToggleQuest = (id: number) => {
    sounds.playClick();
    setDailyQuests((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const next = !q.completed;
          if (next) sounds.playAlert();
          return { ...q, completed: next };
        }
        return q;
      })
    );
  };

  const handleClaimReward = () => {
    if (questClaimed) return;
    sounds.playLevelUp();
    setQuestClaimed(true);
    setAvailablePoints((p) => p + 5);
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. VIBRANT DUNGEON BREAK COUNTDOWN WINDOW (CRIMSON & ELECTRIC NEON) */}
      <div className="solo-window-danger solo-bracket solo-bracket-danger rounded-sm overflow-hidden border-2 border-rose-500 shadow-[0_0_45px_rgba(255,40,90,0.5)]">
        {/* Window Header Bar */}
        <div className="solo-header-bar-danger">
          <div className="flex items-center gap-2 font-orbitron text-xs font-black text-rose-200 tracking-widest uppercase">
            <Skull className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>[ SYSTEM WARNING // DUNGEON BREAK IN PROGRESS ]</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shadow-[0_0_10px_#ff285a]" />
            <span>THREAT LEVEL: CALAMITY (S-RANK)</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-rose-400 font-bold tracking-widest uppercase">
                EMERGENCE EVENT: CBSE CLASS 12 NATIONAL BOARD EXAMS (CODE 043)
              </div>
              <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-rose-100 text-glow-red mt-1 tracking-tight">
                DUNGEON BREAK IN PROGRESS
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 font-rajdhani mt-2 max-w-2xl leading-relaxed">
                Warning: The dimensional rift opens on <span className="text-rose-300 font-bold font-mono underline">February 15, 2027 (09:00:00 IST)</span>. All student hunters must achieve 100% syllabus mastery in Physical, Inorganic, and Organic Chemistry to prevent academic annihilation.
              </p>
            </div>

            <div className="flex items-center gap-2.5 font-mono text-xs text-rose-100 bg-rose-950/90 px-4 py-2.5 rounded border border-rose-400/80 shadow-[0_0_20px_rgba(255,40,90,0.5)]">
              <Calendar className="w-4 h-4 text-rose-300" />
              <span className="font-bold">TARGET DATE: 2027.02.15</span>
            </div>
          </div>

          {/* Large Glowing Color-Coded Countdown Digits */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5">
            {/* Days (Crimson Red Glow) */}
            <div className="solo-window p-4 sm:p-6 rounded-sm text-center border-2 border-rose-500 bg-gradient-to-b from-rose-950/90 via-black to-black shadow-[0_0_25px_rgba(255,40,90,0.4)]">
              <div className="text-4xl sm:text-6xl font-orbitron font-black text-rose-400 text-glow-red tracking-tight">
                {String(timeLeft.days).padStart(3, "0")}
              </div>
              <div className="text-xs sm:text-sm font-orbitron font-bold text-slate-100 uppercase tracking-widest mt-1">
                DAYS
              </div>
              <span className="text-[10px] font-mono text-rose-300/80 block mt-0.5">
                REVISION WINDOW
              </span>
            </div>

            {/* Hours (Electric Cyan Glow) */}
            <div className="solo-window p-4 sm:p-6 rounded-sm text-center border-2 border-cyan-400 bg-gradient-to-b from-cyan-950/90 via-black to-black shadow-[0_0_25px_rgba(0,240,255,0.4)]">
              <div className="text-4xl sm:text-6xl font-orbitron font-black text-cyan-300 text-glow-blue tracking-tight">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div className="text-xs sm:text-sm font-orbitron font-bold text-slate-100 uppercase tracking-widest mt-1">
                HOURS
              </div>
              <span className="text-[10px] font-mono text-cyan-300/80 block mt-0.5">
                MANA STAMINA
              </span>
            </div>

            {/* Minutes (Vibrant Purple Glow) */}
            <div className="solo-window p-4 sm:p-6 rounded-sm text-center border-2 border-purple-400 bg-gradient-to-b from-purple-950/90 via-black to-black shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              <div className="text-4xl sm:text-6xl font-orbitron font-black text-purple-300 text-glow-purple tracking-tight">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div className="text-xs sm:text-sm font-orbitron font-bold text-slate-100 uppercase tracking-widest mt-1">
                MINUTES
              </div>
              <span className="text-[10px] font-mono text-purple-300/80 block mt-0.5">
                SPEED DRILL
              </span>
            </div>

            {/* Seconds (Radiating Gold Glow) */}
            <div className="solo-window p-4 sm:p-6 rounded-sm text-center border-2 border-amber-400 bg-gradient-to-b from-amber-950/90 via-black to-black shadow-[0_0_25px_rgba(251,191,36,0.4)]">
              <div className="text-4xl sm:text-6xl font-orbitron font-black text-amber-300 text-glow-gold tracking-tight">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
              <div className="text-xs sm:text-sm font-orbitron font-bold text-slate-100 uppercase tracking-widest mt-1">
                SECONDS
              </div>
              <span className="text-[10px] font-mono text-amber-300/80 block mt-0.5">
                ACTIVE TICK
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-black/80 rounded border border-rose-500/50 text-xs font-mono text-rose-200 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>PENALTY ZONE ACTIVATION: INCOMPLETE DAILY QUESTS LEAD TO 4-HOUR SURVIVAL TRIAL</span>
            </span>
            <span className="text-rose-400 font-bold">CODE: CBSE-CHEM-043</span>
          </div>
        </div>
      </div>

      {/* 2. AUTHENTIC PLAYER STATUS WINDOW & CORE ATTRIBUTES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player Passport Window (5 Cols) */}
        <div className="lg:col-span-5 solo-window solo-bracket rounded-sm overflow-hidden space-y-0 border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.3)]">
          {/* Header Bar */}
          <div className="solo-header-bar">
            <span className="font-orbitron text-xs font-bold text-cyan-300 tracking-wider">
              [ STATUS MATRIX // PLAYER INTERFACE ]
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              S-CLASS MONARCH
            </span>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                HUNTER IDENTITY
              </span>
              <h3 className="text-2xl sm:text-3xl font-orbitron font-black text-cyan-100 text-glow-blue mt-0.5">
                {userProfile ? userProfile.name : "HUNTER"}
              </h3>
              <div className="grid grid-cols-2 gap-2.5 mt-3 text-xs font-rajdhani">
                <div className="bg-black/70 p-2.5 rounded border border-purple-500/40">
                  <span className="text-slate-400 block text-[10px] font-mono uppercase">JOB CLASS</span>
                  <span className="text-purple-300 font-bold font-orbitron">ALCHEMICAL MONARCH</span>
                </div>
                <div className="bg-black/70 p-2.5 rounded border border-cyan-500/40">
                  <span className="text-slate-400 block text-[10px] font-mono uppercase">TITLE</span>
                  <span className="text-cyan-300 font-bold font-orbitron">CLASS 12 TOPPER</span>
                </div>
              </div>
            </div>

            {/* Level & Fatigue */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/80 p-3.5 rounded border border-cyan-400/50 shadow-inner">
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">LEVEL</span>
                <div className="text-3xl font-orbitron font-black text-cyan-200 text-glow-blue">
                  142
                </div>
                <span className="text-[10px] text-slate-300 mt-1 block font-mono">EXP: 84,200 / 100,000</span>
                <div className="w-full h-2 bg-slate-950 rounded-full mt-1.5 overflow-hidden border border-slate-800">
                  <div className="h-full exp-bar-fill w-[84.2%]" />
                </div>
              </div>

              <div className="bg-black/80 p-3.5 rounded border border-emerald-400/50 shadow-inner">
                <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase">FATIGUE</span>
                <div className="text-3xl font-orbitron font-black text-emerald-400 text-glow-emerald">
                  0%
                </div>
                <span className="text-[10px] text-slate-300 mt-1 block font-mono">Status: Peak Focus</span>
                <div className="w-full h-2 bg-slate-950 rounded-full mt-1.5 overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-400 w-[0%]" />
                </div>
              </div>
            </div>

            {/* HP & MP Bars */}
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-orbitron mb-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" /> HP (HEALTH POINTS)
                  </span>
                  <span className="text-emerald-300 font-mono font-bold">98,400 / 98,400</span>
                </div>
                <div className="w-full h-3.5 bg-black border border-emerald-500/60 rounded-sm p-0.5 overflow-hidden shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  <div className="h-full hp-bar-fill rounded-sm w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-orbitron mb-1">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> MP (MANA / REVISION)
                  </span>
                  <span className="text-cyan-300 font-mono font-bold">42,600 / 42,600</span>
                </div>
                <div className="w-full h-3.5 bg-black border border-cyan-500/60 rounded-sm p-0.5 overflow-hidden shadow-[0_0_12px_rgba(0,240,255,0.3)]">
                  <div className="h-full mana-bar-fill rounded-sm w-full" />
                </div>
              </div>
            </div>

            {/* Arise Trigger Button */}
            <button
              onClick={() => {
                sounds.playAriseEcho();
                if (onTriggerArise) onTriggerArise();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 hover:from-purple-800 hover:to-blue-800 border-2 border-purple-400 text-purple-100 font-orbitron font-black text-xs tracking-widest uppercase rounded shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center gap-2 group"
            >
              <Flame className="w-4 h-4 text-purple-300 group-hover:scale-125 transition-transform" />
              <span>COMMAND: &quot;ARISE&quot; (SHADOW EXTRACTION)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Attributes & Daily Quest (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Core Attributes Matrix */}
          <div className="solo-window solo-bracket rounded-sm overflow-hidden border-2 border-cyan-400">
            <div className="solo-header-bar">
              <span className="font-orbitron text-xs font-bold text-cyan-300 tracking-wider">
                [ ATTRIBUTES MATRIX // CORE SYLLABUS STATS ]
              </span>
              <span className="text-xs font-mono text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/50">
                UNALLOCATED AP: {availablePoints}
              </span>
            </div>

            <div className="p-5 space-y-2.5">
              {[
                { key: "strength", code: "STR", name: "PHYSICAL CHEMISTRY (23M)", desc: "Solutions, Electrochem & Kinetics Numerical Power", val: stats.strength, color: "text-rose-400", border: "border-rose-500/30" },
                { key: "agility", code: "AGI", name: "EXAM VELOCITY & ACCURACY", desc: "3-Hour Time Management & Step-by-Step Writing Speed", val: stats.agility, color: "text-cyan-400", border: "border-cyan-500/30" },
                { key: "sense", code: "SEN", name: "INORGANIC PERCEPTION (14M)", desc: "d- & f-Block Trends, CFT Splitting & Exception Traps", val: stats.sense, color: "text-amber-400", border: "border-amber-500/30" },
                { key: "vitality", code: "VIT", name: "SYLLABUS RETENTION STAMINA", desc: "Formulas, Units, Graphs & Conversion Pathways Memory", val: stats.vitality, color: "text-emerald-400", border: "border-emerald-500/30" },
                { key: "intelligence", code: "INT", name: "ORGANIC SYNTHESIS (33M)", desc: "Named Mechanisms, Reagents & Carbonyl Reactions", val: stats.intelligence, color: "text-purple-400", border: "border-purple-500/30" },
              ].map((item) => (
                <div key={item.code} className={`flex items-center justify-between p-3 bg-black/70 border ${item.border} rounded hover:border-cyan-400 transition-colors`}>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center font-orbitron text-xs font-bold text-cyan-300">
                      {item.code}
                    </span>
                    <div>
                      <div className="font-orbitron text-xs sm:text-sm font-bold text-slate-100">{item.name}</div>
                      <div className="text-[11px] text-slate-300 font-rajdhani">{item.desc}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-orbitron text-lg font-black ${item.color} min-w-[50px] text-right`}>
                      {item.val}
                    </span>
                    <button
                      onClick={() => handleStatChange(item.key as keyof typeof stats, 1)}
                      disabled={availablePoints === 0}
                      className="p-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold disabled:opacity-30 disabled:pointer-events-none shadow-neon-blue transition-colors"
                      title="Allocate Point"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Quest Window */}
          <div className="solo-window solo-bracket rounded-sm overflow-hidden border-2 border-amber-400/80">
            <div className="solo-header-bar">
              <span className="font-orbitron text-xs font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                [ DAILY QUEST: PREPARATION TO BECOME S-RANK ]
              </span>
              <span className="text-[10px] font-mono text-rose-300 font-bold">
                RESET: 04:32:10
              </span>
            </div>

            <div className="p-5 space-y-3">
              {dailyQuests.map((quest) => (
                <div
                  key={quest.id}
                  onClick={() => handleToggleQuest(quest.id)}
                  className={`p-3 rounded border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    quest.completed
                      ? "bg-emerald-950/40 border-emerald-400 text-emerald-200"
                      : "bg-black/70 hover:bg-cyan-950/40 border-slate-700 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        quest.completed ? "text-emerald-400 fill-emerald-400/20" : "text-slate-600"
                      }`}
                    />
                    <span className="font-rajdhani text-sm font-semibold">{quest.text}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                      {quest.marksTag}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        quest.completed
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      }`}
                    >
                      {quest.completed ? "COMPLETE" : "INCOMPLETE"}
                    </span>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-cyan-500/20 gap-2">
                <span className="text-xs font-mono text-slate-300">
                  REWARD: +5 STAT AP • FULL FOCUS RECOVERY
                </span>
                <button
                  onClick={handleClaimReward}
                  disabled={questClaimed || !dailyQuests.every((q) => q.completed)}
                  className={`px-4 py-2 font-orbitron text-xs font-bold rounded uppercase transition-all ${
                    questClaimed
                      ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                      : dailyQuests.every((q) => q.completed)
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-neon-blue font-black"
                      : "bg-cyan-950/40 text-slate-500 border border-cyan-900/50 cursor-not-allowed"
                  }`}
                >
                  {questClaimed ? "REWARDS CLAIMED" : "CLAIM QUEST EXP"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SYSTEM BULLETIN NOTICES */}
      <div className="solo-window solo-bracket rounded-sm overflow-hidden border-2 border-cyan-400">
        <div className="solo-header-bar">
          <div className="font-orbitron text-xs font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>[ SYSTEM BULLETIN // OFFICIAL CBSE DISPATCH ]</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">STATUS: LIVE FEED</span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {BULLETIN_NOTICES.map((notice) => (
            <div
              key={notice.id}
              onClick={() => {
                sounds.playClick();
                setSelectedNotice(notice);
              }}
              className="p-4 rounded bg-black/75 border border-cyan-500/40 hover:border-cyan-400 hover:scale-[1.01] transition-all cursor-pointer space-y-2.5 group shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-orbitron font-bold px-2 py-0.5 rounded border ${notice.badgeColor}`}>
                  {notice.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">{notice.date}</span>
              </div>
              <h4 className="font-orbitron text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {notice.title}
              </h4>
              <p className="text-xs text-slate-300 font-rajdhani line-clamp-2 leading-relaxed">
                {notice.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Notice Inspection Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="solo-window solo-bracket max-w-lg w-full rounded-sm overflow-hidden space-y-0 border-2 border-cyan-400 shadow-[0_0_50px_rgba(0,240,255,0.6)]">
            <div className="solo-header-bar">
              <span className="font-orbitron text-xs font-bold text-cyan-300 uppercase">
                [ {selectedNotice.category} // {selectedNotice.officialRef} ]
              </span>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-slate-400 hover:text-cyan-300 font-mono text-xs"
              >
                [ESC]
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h4 className="text-xl font-orbitron font-bold text-cyan-200">
                {selectedNotice.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 font-rajdhani leading-relaxed bg-black/80 p-4 rounded border border-cyan-500/30">
                {selectedNotice.summary}
              </p>
              <button
                onClick={() => setSelectedNotice(null)}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron text-xs font-bold rounded uppercase tracking-wider transition-colors shadow-neon-blue"
              >
                CONFIRM & ACKNOWLEDGE DIRECTIVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
