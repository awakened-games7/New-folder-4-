"use client";

import React from "react";
import { Bell, X, AlertTriangle, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { sounds } from "../audio/soundEffects";

interface SystemAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: "status" | "archives" | "guild") => void;
}

export default function SystemAlertModal({
  isOpen,
  onClose,
  onSelectTab,
}: SystemAlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="system-panel system-bracket max-w-lg w-full p-6 rounded-sm space-y-4 border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.4)]">
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-orbitron font-bold text-cyan-200">
              [ SYSTEM TRANSMISSION LOGS ]
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-cyan-300 font-mono text-sm p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 text-xs font-rajdhani">
          {/* Notification 1 */}
          <div className="p-3 bg-amber-950/20 border border-amber-500/40 rounded space-y-1">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-amber-400 font-bold uppercase flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> DAILY QUEST ALERT
              </span>
              <span className="text-slate-500">10m ago</span>
            </div>
            <p className="text-slate-200 font-semibold">
              Daily Training: &apos;Elemental Reaction Kinetics Analysis&apos; is ready for review.
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                onSelectTab("status");
                onClose();
              }}
              className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px]"
            >
              Go to Status Quests →
            </button>
          </div>

          {/* Notification 2 */}
          <div className="p-3 bg-cyan-950/20 border border-cyan-500/40 rounded space-y-1">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-cyan-400 font-bold uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> ALCHEMY GRIMOIRE UPDATE
              </span>
              <span className="text-slate-500">25m ago</span>
            </div>
            <p className="text-slate-200 font-semibold">
              New Mana-Infused Element dossier: &apos;Mana-Cobalt (Mc #121)&apos; unlocked in Archives.
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                onSelectTab("archives");
                onClose();
              }}
              className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px]"
            >
              Open Archives Grimoire →
            </button>
          </div>

          {/* Notification 3 */}
          <div className="p-3 bg-purple-950/20 border border-purple-500/40 rounded space-y-1">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-purple-400 font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> GUILD RAID GATE OPEN
              </span>
              <span className="text-slate-500">1h ago</span>
            </div>
            <p className="text-slate-200 font-semibold">
              Red Gate in Bukhansan has opened. 2 party slots remaining for S-Rank and A-Rank hunters.
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                onSelectTab("guild");
                onClose();
              }}
              className="text-purple-300 hover:text-purple-200 underline font-mono text-[11px]"
            >
              View Active Gates →
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-orbitron text-xs font-bold rounded uppercase transition-colors"
          >
            DISMISS NOTIFICATIONS
          </button>
        </div>
      </div>
    </div>
  );
}
