"use client";

import React, { useEffect, useState } from "react";
import { X, Crown, Sparkles } from "lucide-react";
import { sounds } from "../audio/soundEffects";

interface AriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AriseModal({ isOpen, onClose }: AriseModalProps) {
  const [stage, setStage] = useState<"summoning" | "complete">("summoning");

  useEffect(() => {
    if (isOpen) {
      setStage("summoning");
      sounds.playAriseEcho();

      const timer = setTimeout(() => {
        setStage("complete");
        sounds.playLevelUp();
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fadeIn">
      {/* Background shadow aura rings & Jinwoo blue eye haze */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[700px] h-[700px] rounded-full bg-purple-900/30 blur-3xl animate-pulse" />
        <div className="w-[450px] h-[450px] rounded-full bg-cyan-500/20 blur-2xl animate-spin" style={{ animationDuration: "10s" }} />
      </div>

      <div className="relative solo-window solo-bracket max-w-lg w-full p-8 rounded-sm space-y-6 border-2 border-purple-500 shadow-[0_0_60px_rgba(168,85,247,0.7)] bg-black/95 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-purple-300 font-mono text-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {stage === "summoning" ? (
          <div className="space-y-4 py-8">
            <div className="text-5xl animate-bounce">👑🔮</div>
            <h3 className="text-4xl sm:text-5xl font-orbitron font-black text-purple-300 text-glow-purple tracking-widest uppercase">
              &ldquo;ARISE&rdquo;
            </h3>
            <div className="text-xl font-bold font-orbitron text-cyan-300 tracking-widest uppercase">
              SHADOW EXTRACTION
            </div>
            <p className="text-xs font-mono text-purple-400/90 animate-pulse">
              [ EXTRACTING SHADOW SCHOLARS FROM CBSE MONARCH SANCTUM... ]
            </p>
            <div className="w-56 h-1.5 bg-purple-950 mx-auto rounded-full overflow-hidden border border-purple-800">
              <div className="h-full bg-purple-400 animate-pulse w-full shadow-[0_0_10px_#c084fc]" />
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-3 bg-purple-950/60 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.7)]">
              <Crown className="w-8 h-8 text-purple-300" />
            </div>

            <div>
              <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                [ SYSTEM EXTRACTION SUCCESSFUL // SHADOWS AWAKENED ]
              </div>
              <h3 className="text-2xl font-orbitron font-black text-purple-200 mt-1">
                SHADOW REVISION SQUAD AWAKENED
              </h3>
              <p className="text-xs text-slate-300 font-rajdhani mt-1">
                3 Elite Shadow Scholars have been enlisted to accelerate your Class 12th Board preparation.
              </p>
            </div>

            <div className="space-y-2 bg-purple-950/40 p-4 rounded border border-purple-500/40 text-left text-xs font-mono">
              <div className="flex items-center justify-between text-purple-300">
                <span>• Shadow Commander Igris (Physical Chemistry)</span>
                <span className="text-emerald-400 font-bold">+100% Formulas</span>
              </div>
              <div className="flex items-center justify-between text-purple-300">
                <span>• Shadow General Beru (Organic Synthesis)</span>
                <span className="text-emerald-400 font-bold">+100% Mechanisms</span>
              </div>
              <div className="flex items-center justify-between text-purple-300">
                <span>• Shadow Shaman Tusk (Inorganic NCERT Memory)</span>
                <span className="text-emerald-400 font-bold">+100% Retention</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white font-orbitron text-xs font-bold uppercase tracking-widest rounded shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all"
            >
              DEPLOY TO BOARD STUDY DOMAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
