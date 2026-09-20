"use client";

import React, { useState } from "react";
import { X, Shield, Award, CheckCircle2, User, Sparkles, BookOpen } from "lucide-react";
import { sounds } from "../audio/soundEffects";

export interface StudentHunterProfile {
  name: string;
  email: string;
  targetPercent: string;
  stream: string;
  rank: string;
  level: number;
}

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (profile: StudentHunterProfile) => void;
}

export default function GoogleAuthModal({
  isOpen,
  onClose,
  onSignInSuccess,
}: GoogleAuthModalProps) {
  const [step, setStep] = useState<"auth" | "customize">("auth");
  const [name, setName] = useState("Hunter");
  const [stream, setStream] = useState("Science (PCM)");
  const [targetPercent, setTargetPercent] = useState("95%+");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSimulateGoogleAuth = () => {
    setIsLoading(true);
    sounds.playClick();
    setTimeout(() => {
      setIsLoading(false);
      setStep("customize");
      sounds.playAlert();
    }, 1000);
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playLevelUp();
    const profile: StudentHunterProfile = {
      name: name || "Hunter",
      email: `${(name || "hunter").toLowerCase().replace(/\s+/g, ".")}@student.cbse.edu`,
      targetPercent,
      stream,
      rank: "S-RANK CANDIDATE",
      level: 12,
    };
    onSignInSuccess(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="system-panel system-bracket max-w-md w-full p-6 sm:p-8 rounded-sm space-y-5 border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.4)]">
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-orbitron font-bold text-cyan-200">
              [ HUNTER AUTHENTICATION // AWAKENING ]
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-cyan-300 font-mono text-sm p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === "auth" ? (
          <div className="space-y-5 text-center py-2">
            <div className="p-3 bg-cyan-950/40 rounded-full w-14 h-14 mx-auto flex items-center justify-center border border-cyan-400 shadow-neon-blue">
              <Sparkles className="w-7 h-7 text-cyan-300 animate-pulse" />
            </div>

            <div>
              <h4 className="text-xl font-orbitron font-black text-slate-100">
                AWAKEN YOUR HUNTER PASSPORT
              </h4>
              <p className="text-xs text-slate-300 font-rajdhani mt-1 max-w-xs mx-auto">
                Sign in with Google to synchronize your CBSE Class 12 preparation stats, PYQ raid scores, and guild progress.
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={handleSimulateGoogleAuth}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-rajdhani font-bold text-sm rounded flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
            >
              {/* Google SVG Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isLoading ? "AUTHENTICATING WITH GOOGLE..." : "CONTINUE WITH GOOGLE"}</span>
            </button>

            <div className="text-[10px] font-mono text-slate-400">
              🔒 Encrypted with System OAuth v2.0 • Zero Spam
            </div>
          </div>
        ) : (
          <form onSubmit={handleCompleteRegistration} className="space-y-4">
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded text-xs font-mono text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Google Account Connected: Verified Student</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">HUNTER / STUDENT NAME:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/60 border border-cyan-500/30 rounded px-3 py-2 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400 font-rajdhani"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">STREAM:</label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="w-full bg-black/60 border border-cyan-500/30 rounded px-2.5 py-2 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400 font-rajdhani"
                >
                  <option value="Science (PCM)">Science (PCM)</option>
                  <option value="Science (PCB)">Science (PCB)</option>
                  <option value="Science (PCMB)">Science (PCMB)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">TARGET SCORE:</label>
                <select
                  value={targetPercent}
                  onChange={(e) => setTargetPercent(e.target.value)}
                  className="w-full bg-black/60 border border-cyan-500/30 rounded px-2.5 py-2 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400 font-rajdhani"
                >
                  <option value="98%+ (State Rank)">98%+ (State Rank)</option>
                  <option value="95%+ (S-Rank)">95%+ (S-Rank)</option>
                  <option value="90%+ (A-Rank)">90%+ (A-Rank)</option>
                  <option value="85%+ (B-Rank)">85%+ (B-Rank)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron text-xs font-bold rounded uppercase tracking-widest transition-all shadow-neon-blue"
            >
              INITIALIZE HUNTER PASSPORT
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
