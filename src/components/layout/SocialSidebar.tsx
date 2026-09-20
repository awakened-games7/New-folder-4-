"use client";

import React from "react";
import { Instagram, Youtube, MessageSquare, MessageCircle, Gamepad2, ExternalLink, Sparkles } from "lucide-react";
import { sounds } from "../audio/soundEffects";
import { GAME_METADATA } from "../archives/ChemistryArchives";

export default function SocialSidebar() {
  const socials = [
    {
      name: "Google Play",
      subtitle: "Realms of Chemistry APK",
      label: "Official Game on Play Store",
      icon: Gamepad2,
      url: GAME_METADATA.appUrl,
      color: "hover:text-[#10B981] hover:border-[#10B981] hover:shadow-[0_0_25px_rgba(16,185,129,0.9)]",
      bgColor: "hover:bg-[#10B981]/20",
    },
    {
      name: "WhatsApp",
      subtitle: "+91 7904873647",
      label: "Instant Doubts & Broadcast",
      icon: MessageCircle,
      url: GAME_METADATA.whatsappUrl,
      color: "hover:text-[#25D366] hover:border-[#25D366] hover:shadow-[0_0_25px_rgba(37,211,102,0.9)]",
      bgColor: "hover:bg-[#25D366]/20",
    },
    {
      name: "Instagram",
      subtitle: "@king_daniel_dev",
      label: "Daily Hacks & Reels",
      icon: Instagram,
      url: GAME_METADATA.instagramUrl,
      color: "hover:text-[#E1306C] hover:border-[#E1306C] hover:shadow-[0_0_25px_rgba(225,48,108,0.9)]",
      bgColor: "hover:bg-[#E1306C]/20",
    },
    {
      name: "YouTube",
      subtitle: "Masterclasses & PYQs",
      label: "Official YouTube Channel",
      icon: Youtube,
      url: GAME_METADATA.youtubeUrl,
      color: "hover:text-[#FF0000] hover:border-[#FF0000] hover:shadow-[0_0_25px_rgba(255,0,0,0.9)]",
      bgColor: "hover:bg-[#FF0000]/20",
    },
    {
      name: "Discord",
      subtitle: "24/7 Study Dungeon",
      label: "Live Co-Study & Mentors",
      icon: MessageSquare,
      url: "https://discord.com",
      color: "hover:text-[#5865F2] hover:border-[#5865F2] hover:shadow-[0_0_25px_rgba(88,101,242,0.9)]",
      bgColor: "hover:bg-[#5865F2]/20",
    },
  ];

  return (
    <aside className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3 pointer-events-auto">
      <div className="solo-window p-2 rounded-lg border-2 border-cyan-400 bg-black/95 shadow-neon-blue flex flex-col items-center gap-3">
        <div className="text-[9px] font-orbitron font-bold text-cyan-300 [writing-mode:vertical-rl] rotate-180 tracking-widest uppercase py-1 select-none flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-300 rotate-90 animate-pulse" />
          <span>GUILD PORTALS // COMMS</span>
        </div>

        <div className="w-full h-[1px] bg-cyan-400/50" />

        {socials.map((s) => {
          const IconComp = s.icon;
          return (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className={`group relative p-2.5 rounded border border-cyan-500/50 bg-black/85 text-slate-200 transition-all duration-300 ${s.color} ${s.bgColor}`}
              title={`${s.name} - ${s.subtitle || s.label}`}
            >
              <IconComp className="w-5 h-5 group-hover:scale-125 transition-transform" />

              {/* Floating Tooltip */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 pointer-events-none whitespace-nowrap solo-window px-3.5 py-2 rounded text-xs font-rajdhani border-2 border-cyan-400 bg-black/95 shadow-[0_0_25px_rgba(0,240,255,0.7)] animate-fadeIn">
                <div>
                  <span className="font-orbitron font-bold text-slate-100 block text-xs">
                    {s.name}
                  </span>
                  <span className="text-[11px] text-cyan-300 font-mono font-semibold">
                    {s.subtitle || s.label}
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </a>
          );
        })}
      </div>
    </aside>
  );
}
