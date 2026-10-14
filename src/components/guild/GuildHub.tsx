"use client";

import React, { useState } from "react";
import {
  Users,
  Trophy,
  ExternalLink,
  MessageSquare,
  MessageCircle,
  Youtube,
  Instagram,
  Radio,
  Send,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import { sounds } from "../audio/soundEffects";

interface SocialGuildPortal {
  id: string;
  name: string;
  badge: string;
  platform: string;
  tagline: string;
  icon: typeof Instagram;
  joinUrl: string;
  members: string;
  perks: string[];
  themeColor: string;
  borderColor: string;
  actionText: string;
}

const GUILD_PORTALS: SocialGuildPortal[] = [
  {
    id: "whatsapp",
    name: "WHATSAPP DOUBT & BROADCAST GUILD",
    badge: "INSTANT BROADCAST & MENTOR DIRECT",
    platform: "WhatsApp Direct Hotline",
    tagline: "Direct emergency doubt hotline, PDF formula sheets, daily quiz alerts, and 1-on-1 mentor guidance with 7904873647.",
    icon: MessageCircle,
    joinUrl: "https://wa.me/917904873647",
    members: "+91 7904873647 (ONLINE)",
    perks: [
      "Instant 1-on-1 Doubt Clarification for CBSE Numericals",
      "Daily Morning Chemistry High-Yield Formula Flashcards",
      "Official Broadcast Alerts for Board Exam Notifications",
      "Direct Line to Subject Toppers & Alchemical Mentors",
    ],
    themeColor: "from-[#25D366]/25 to-black",
    borderColor: "border-[#25D366]/70",
    actionText: "CHAT ON WHATSAPP",
  },
  {
    id: "instagram",
    name: "DAILY FORMULA REELS & BOARD HACKS",
    badge: "@king_daniel_dev GUILD",
    platform: "Instagram Official",
    tagline: "Follow @king_daniel_dev for 60-second reaction cheatsheets, memory mnemonics, NCERT diagram hacks, and exam circular reels.",
    icon: Instagram,
    joinUrl: "https://www.instagram.com/king_daniel_dev?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
    members: "DAILY REELS ACTIVE",
    perks: [
      "Daily 60s Reel: '1 Formula = 1 Confirmed Board Mark'",
      "NCERT Exception & Graph Mnemonics Infographics",
      "Daily Story Quizzes & Interactive Poll Battles",
      "CBSE Exam Circular Summaries in 3 Bullet Points",
    ],
    themeColor: "from-[#E1306C]/25 to-black",
    borderColor: "border-[#E1306C]/70",
    actionText: "OPEN INSTAGRAM",
  },
  {
    id: "youtube",
    name: "REALMS OF CHEMISTRY MASTERCLASSES",
    badge: "OFFICIAL MASTERCLASS CHANNEL",
    platform: "YouTube Channel",
    tagline: "High-yield 1-Shot chapter marathons, 3D animated reaction mechanisms, and CBSE PYQ speed-solving video streams.",
    icon: Youtube,
    joinUrl: "https://www.youtube.com/channel/UCdE2eZoDmtrWmg4Ks4SNhmQ",
    members: "UCdE2eZoDmtrWmg4Ks4SNhmQ",
    perks: [
      "Full Chapter 1-Shots (Solutions, Kinetics, Electrochemistry)",
      "3D Animated Organic Reaction Mechanism Breakdowns",
      "Official Game Trailers & Boss Raid Walkthroughs",
      "10-Year CBSE Chemistry PYQ Speed-Solving Marathons",
    ],
    themeColor: "from-[#FF0000]/25 to-black",
    borderColor: "border-[#FF0000]/70",
    actionText: "SUBSCRIBE ON YOUTUBE",
  },
  {
    id: "discord",
    name: "24/7 STUDY DUNGEON & VOICE HALLS",
    badge: "COMMUNITY STUDY SANCTUM",
    platform: "Discord Community",
    tagline: "Live co-studying with 15,000+ Class 12th aspirants, instant doubt resolution by 99%ile mentors, and game beta drops.",
    icon: MessageSquare,
    joinUrl: "https://discord.com",
    members: "15,420 HUNTERS ACTIVE",
    perks: [
      "24/7 Pomodoro Voice Halls with lofi study mana",
      "Instant Doubt Resolution by S-Rank Subject Mentors",
      "Exclusive Beta APK drops for 'Realms of Chemistry'",
      "Weekly Mock Test Raids & State Rank Leaderboards",
    ],
    themeColor: "from-[#5865F2]/25 to-black",
    borderColor: "border-[#5865F2]/70",
    actionText: "ENTER DISCORD DUNGEON",
  },
];

interface ScholarLeader {
  rank: string;
  name: string;
  badge: string;
  streak: string;
  score: string;
}

const SCHOLAR_LEADERS: ScholarLeader[] = [
  { rank: "01", name: "Aarav Mehta", badge: "National Level Hunter", streak: "48 Days 🔥", score: "69 / 70 (98.5%)" },
  { rank: "02", name: "Diya Patel", badge: "S-Rank Monarch Master", streak: "42 Days 🔥", score: "68 / 70 (97.1%)" },
  { rank: "03", name: "Rohan Verma", badge: "Physical Chemistry Specialist", streak: "39 Days 🔥", score: "67 / 70 (95.7%)" },
  { rank: "04", name: "Ananya Roy", badge: "Organic Chemistry Monarch", streak: "35 Days 🔥", score: "66 / 70 (94.2%)" },
];

export default function GuildHub() {
  const [messages, setMessages] = useState([
    { id: "1", sender: "Aarav Mehta [S-RANK]", content: "Starting a 2-hour Electrochemistry numericals sprint in Voice Room 3!", time: "13:05" },
    { id: "2", sender: "Diya Patel [MENTOR]", content: "Uploaded the handwritten summary for Kohlrausch Law & Molar Conductivity in resources!", time: "13:12" },
    { id: "3", sender: "Coach Daniel [GUILD MASTER]", content: "Remember to review Arrhenius plot slope = -Ea / 2.303R for today's mock raid.", time: "13:18" },
  ]);
  const [newMsg, setNewMsg] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    sounds.playClick();
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), sender: "You [STUDENT HUNTER]", content: newMsg.trim(), time: timeStr },
    ]);
    setNewMsg("");
  };

  return (
    <div id="guild-hub-view" className="space-y-6 pb-12 animate-fadeIn scroll-mt-24 sm:scroll-mt-28">
      {/* 1. TOP GUILD HEADER WINDOW */}
      <div className="solo-window solo-bracket rounded-sm overflow-hidden border-2 border-cyan-400">
        <div className="solo-header-bar">
          <div className="flex items-center gap-2 font-orbitron text-xs font-black text-cyan-300 tracking-widest uppercase">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>[ HUNTER ASSOCIATION // SCHOLAR GUILD NETWORK ]</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">GUILD ROSTER: 96,700+ HUNTERS</span>
        </div>

        <div className="p-6 sm:p-8 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-orbitron font-black text-cyan-200 text-glow-blue">
            THE SCHOLAR GUILD PORTAL
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-rajdhani max-w-3xl leading-relaxed">
            Connect directly with fellow awakened Class 12th science students. Reach out via WhatsApp at <span className="text-emerald-400 font-mono font-bold">+91 7904873647</span>, follow Instagram <span className="text-pink-400 font-mono font-bold">@king_daniel_dev</span>, watch masterclasses on YouTube, and pre-register for <span className="text-amber-300 font-orbitron font-bold">Realms of Chemistry</span> by Awakened Games (Solo Developer Daniel).
          </p>
        </div>
      </div>

      {/* 2. DIMENSIONAL SOCIAL GUILD GATES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {GUILD_PORTALS.map((portal) => {
          const IconComp = portal.icon;
          return (
            <div
              key={portal.id}
              className={`solo-window solo-bracket rounded-sm overflow-hidden border ${portal.borderColor} bg-gradient-to-b ${portal.themeColor} flex flex-col justify-between space-y-0 transition-all hover:scale-[1.02] shadow-lg`}
            >
              <div className="solo-header-bar">
                <span className="font-orbitron text-[11px] font-bold text-slate-100">{portal.platform}</span>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">{portal.members}</span>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-black/80 rounded border border-slate-700">
                      <IconComp className="w-6 h-6 text-slate-100" />
                    </div>
                    <div>
                      <h4 className="font-orbitron text-sm font-bold text-slate-100 leading-tight">
                        {portal.name}
                      </h4>
                      <span className="text-[11px] font-mono text-cyan-300 uppercase block mt-0.5">
                        {portal.badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-rajdhani leading-relaxed">
                    {portal.tagline}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs font-rajdhani">
                    <span className="text-[10px] font-orbitron font-bold text-cyan-400 uppercase">
                      GUILD PERKS:
                    </span>
                    {portal.perks.map((p, i) => (
                      <div key={i} className="text-slate-300 flex items-start gap-2 text-[11px]">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3">
                  <a
                    href={portal.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sounds.playAlert()}
                    className="w-full py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron text-[11px] font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-neon-blue transition-all"
                  >
                    <span>{portal.actionText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. S-RANK SCHOLAR LEADERBOARD & LIVE COMMS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaderboard (6 Cols) */}
        <div className="lg:col-span-6 solo-window solo-bracket rounded-sm overflow-hidden">
          <div className="solo-header-bar">
            <span className="font-orbitron text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              [ S-RANK SCHOLAR LEADERBOARD // WEEKLY RANKINGS ]
            </span>
            <span className="text-xs font-mono text-cyan-400">WEEKLY CYCLE</span>
          </div>

          <div className="p-5 space-y-2.5">
            {SCHOLAR_LEADERS.map((s) => (
              <div key={s.rank} className="p-3 rounded bg-black/70 border border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded bg-amber-950/60 border border-amber-500/40 flex items-center justify-center font-orbitron text-xs font-bold text-amber-300">
                    #{s.rank}
                  </span>
                  <div>
                    <div className="font-orbitron text-xs font-bold text-slate-100">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.badge} • {s.streak}</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-500 block">SCORE</span>
                  <span className="text-xs font-bold text-cyan-300 font-orbitron">{s.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Comms Terminal (6 Cols) */}
        <div className="lg:col-span-6 solo-window solo-bracket rounded-sm overflow-hidden">
          <div className="solo-header-bar">
            <span className="font-orbitron text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              [ LIVE STUDY COMMS FREQUENCY // DIRECT TRANSMISSION ]
            </span>
            <span className="text-xs font-mono text-emerald-400">ENCRYPTED</span>
          </div>

          <div className="p-5 space-y-3">
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {messages.map((m) => (
                <div key={m.id} className="p-2 rounded bg-black/60 border border-cyan-500/20 text-xs font-rajdhani">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-orbitron text-[10px] font-bold text-cyan-300">{m.sender}</span>
                    <span className="text-[9px] font-mono text-slate-500">{m.time}</span>
                  </div>
                  <p className="text-slate-200">{m.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-cyan-500/20">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Ask questions or coordinate study raids..."
                className="flex-1 bg-black/70 border border-cyan-500/30 rounded px-3 py-2 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400 font-rajdhani"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron text-xs font-bold rounded uppercase transition-colors flex items-center gap-1 shadow-neon-blue"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
