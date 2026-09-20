"use client";

import React, { useState } from "react";
import {
  Skull,
  Sword,
  Shield,
  Zap,
  Flame,
  Award,
  Sparkles,
  Heart,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Crown,
  Play,
  Volume2,
  ChevronRight,
  ExternalLink,
  Gamepad2,
} from "lucide-react";
import { sounds } from "../audio/soundEffects";
import { GAME_METADATA } from "../archives/ChemistryArchives";

interface RaidQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  damage: number;
  skillName: string;
}

interface BossRaid {
  id: string;
  name: string;
  title: string;
  chapter: string;
  weightage: string;
  maxHp: number;
  threatLevel: string;
  themeGradient: string;
  borderColor: string;
  shadowColor: string;
  avatarIcon: string;
  description: string;
  questions: RaidQuestion[];
}

const RAID_BOSSES: BossRaid[] = [
  {
    id: "nernst_dragon",
    name: "The Nernst Electro-Dragon",
    title: "Overlord of Galvanic Cells & Ion Potentials",
    chapter: "Electrochemistry (Ch 2)",
    weightage: "9 Marks",
    maxHp: 4000,
    threatLevel: "S-RANK CALAMITY",
    themeGradient: "from-blue-950 via-slate-900 to-black",
    borderColor: "border-blue-400",
    shadowColor: "shadow-[0_0_40px_rgba(59,130,246,0.6)]",
    avatarIcon: "🐉⚡",
    description: "Guardians of the Standard Reduction Potential Table. Weak to precise Nernst log substitutions and Gibbs energy calculations.",
    questions: [
      {
        id: "nd_1",
        question: "For the cell reaction Mg(s) + Cu²⁺(0.001M) → Mg²⁺(0.1M) + Cu(s) [E°cell = 2.71 V], what is the expression for Ecell at 298 K?",
        options: [
          "Ecell = 2.71 - (0.0591/2) * log(0.1 / 0.001)",
          "Ecell = 2.71 - (0.0591/2) * log(0.001 / 0.1)",
          "Ecell = 2.71 + (0.0591/1) * log(0.1 / 0.001)",
          "Ecell = 2.71 - (0.0591/4) * log(0.1 * 0.001)",
        ],
        correctIndex: 0,
        explanation: "By Nernst Eq: Ecell = E°cell - (0.0591/n)*log([Mg²⁺]/[Cu²⁺]) where n=2. [Mg²⁺]=0.1M, [Cu²⁺]=0.001M.",
        damage: 1350,
        skillName: "Nernst Potential Lance",
      },
      {
        id: "nd_2",
        question: "What is the relationship between standard cell EMF (E°cell) and equilibrium constant (Kc)?",
        options: [
          "log(Kc) = (n * E°cell) / 0.0591 at 298 K",
          "log(Kc) = 0.0591 / (n * E°cell)",
          "Kc = -n * F * E°cell",
          "log(Kc) = (2.303 * R * T) / E°cell",
        ],
        correctIndex: 0,
        explanation: "ΔG° = -nFE°cell = -2.303RT log(Kc). Hence at 298K, log(Kc) = (n * E°cell) / 0.0591.",
        damage: 1400,
        skillName: "Gibbs Equilibrium Surge",
      },
      {
        id: "nd_3",
        question: "According to Kohlrausch's Law, limiting molar conductivity of acetic acid (CH3COOH) is calculated as:",
        options: [
          "Λ°m(CH3COONa) + Λ°m(HCl) - Λ°m(NaCl)",
          "Λ°m(CH3COONa) - Λ°m(HCl) + Λ°m(NaCl)",
          "Λ°m(NaCl) + Λ°m(HCl) - Λ°m(CH3COONa)",
          "Λ°m(CH3COOH) = κ * 1000 / Molarity",
        ],
        correctIndex: 0,
        explanation: "Λ°m(CH3COOH) = λ°(CH3COO⁻) + λ°(H⁺) = Λ°m(CH3COONa) + Λ°m(HCl) - Λ°m(NaCl).",
        damage: 1500,
        skillName: "Kohlrausch Independent Ion Cleave",
      },
    ],
  },
  {
    id: "raoult_titan",
    name: "The Raoult & Henry Colossus",
    title: "Monarch of Vapour Pressures & Osmotic Shielding",
    chapter: "Solutions (Ch 1)",
    weightage: "7 Marks",
    maxHp: 3500,
    threatLevel: "A-RANK THREAT",
    themeGradient: "from-cyan-950 via-slate-900 to-black",
    borderColor: "border-cyan-400",
    shadowColor: "shadow-[0_0_40px_rgba(0,240,255,0.6)]",
    avatarIcon: "🌊🗿",
    description: "Channels colligative barriers and azeotropic vortexes. Defeat with accurate Van't Hoff factor multipliers and Henry's constant conversions.",
    questions: [
      {
        id: "rt_1",
        question: "A mixture of Chloroform and Acetone shows which deviation from Raoult's Law?",
        options: [
          "Negative deviation due to intermolecular H-bonding between CHCl3 and CH3COCH3",
          "Positive deviation due to dipole-dipole repulsion",
          "Ideal behavior with ΔH_mix = 0",
          "Zero deviation because both are non-polar liquids",
        ],
        correctIndex: 0,
        explanation: "Chloroform and Acetone form intermolecular H-bonds, making A-B attractions stronger than A-A and B-B, causing negative deviation.",
        damage: 1200,
        skillName: "Azeotrope Hydrogen Pierce",
      },
      {
        id: "rt_2",
        question: "What is the Van't Hoff factor (i) for complete dissociation of K4[Fe(CN)6]?",
        options: [
          "i = 5 (4 K⁺ ions + 1 [Fe(CN)6]⁴⁻ ion)",
          "i = 6",
          "i = 1",
          "i = 11",
        ],
        correctIndex: 0,
        explanation: "K4[Fe(CN)6] dissociates into 4 K⁺ and 1 [Fe(CN)6]⁴⁻ complex ion, yielding 5 total particles (i = 5).",
        damage: 1300,
        skillName: "Colligative Multiplier Blast",
      },
      {
        id: "rt_3",
        question: "Why does aquatic life feel more comfortable in cold water than in warm water?",
        options: [
          "Henry's constant KH increases with temperature, decreasing O2 gas solubility in warm water",
          "Vapour pressure of warm water is zero",
          "Cold water has lower density than warm water",
          "Osmotic pressure of fish is lower in warm water",
        ],
        correctIndex: 0,
        explanation: "Gas solubility in liquids decreases with increasing temperature as KH increases (p = KH * x). Cold water holds more dissolved oxygen.",
        damage: 1250,
        skillName: "Henry Gas Solvation Thrust",
      },
    ],
  },
  {
    id: "aldol_monarch",
    name: "The Aldol-Cannizzaro Monarch",
    title: "Sovereign of Carbonyl Mechanisms & Grignard Synthesis",
    chapter: "Aldehydes, Ketones & Carboxylic Acids (Ch 8)",
    weightage: "8 Marks",
    maxHp: 4200,
    threatLevel: "S-RANK CALAMITY",
    themeGradient: "from-purple-950 via-slate-900 to-black",
    borderColor: "border-purple-400",
    shadowColor: "shadow-[0_0_40px_rgba(168,85,247,0.6)]",
    avatarIcon: "👑🧪",
    description: "Master of nucleophilic additions, Wolff-Kishner reductions, and Hell-Volhard-Zelinsky halogenations. Conquer with precise named reagents.",
    questions: [
      {
        id: "am_1",
        question: "Which of the following compounds gives a positive Iodoform test (yellow precipitate of CHI3)?",
        options: [
          "Propan-2-ol (CH3-CH(OH)-CH3)",
          "Propan-1-ol (CH3-CH2-CH2-OH)",
          "Benzaldehyde (C6H5-CHO)",
          "Methanol (CH3-OH)",
        ],
        correctIndex: 0,
        explanation: "The iodoform test requires a CH3-C=O or CH3-CH(OH)- group. Propan-2-ol contains the CH3-CH(OH)- group and oxidizes to acetone.",
        damage: 1400,
        skillName: "Iodoform Precipitation Cleave",
      },
      {
        id: "am_2",
        question: "Benzaldehyde undergoes Cannizzaro reaction with 50% concentrated NaOH to produce:",
        options: [
          "Benzyl alcohol (C6H5CH2OH) + Sodium benzoate (C6H5COONa)",
          "Cinnamic acid + Water",
          "Benzoic acid + Toluene",
          "Benzophenone + H2 gas",
        ],
        correctIndex: 0,
        explanation: "Aldehydes lacking α-hydrogens undergo disproportionation (self redox): 2 C6H5CHO + NaOH → C6H5CH2OH + C6H5COONa.",
        damage: 1500,
        skillName: "Cannizzaro Disproportionation Slash",
      },
      {
        id: "am_3",
        question: "What is the reagent used in Rosenmund Reduction (R-COCl → R-CHO)?",
        options: [
          "H2 in the presence of Pd/BaSO4 poisoned with Quinoline/Sulfur",
          "LiAlH4 in dry ether",
          "NaBH4 in ethanol",
          "Zn-Hg in concentrated HCl",
        ],
        correctIndex: 0,
        explanation: "Rosenmund reduction uses H2 / Pd-BaSO4 (Lindlar type poison) to prevent further reduction of aldehyde to alcohol.",
        damage: 1450,
        skillName: "Rosenmund Catalyst Strike",
      },
    ],
  },
];

export default function BossRaidArena({
  onTriggerArise,
}: {
  onTriggerArise?: () => void;
}) {
  const [selectedBossIndex, setSelectedBossIndex] = useState(0);
  const currentBoss = RAID_BOSSES[selectedBossIndex];

  const [bossHp, setBossHp] = useState(currentBoss.maxHp);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([
    `[ RAID INITIALIZED ] Confronting ${currentBoss.name}!`,
  ]);
  const [isVictorious, setIsVictorious] = useState(false);
  const [hitEffect, setHitEffect] = useState(false);

  const activeQuestion = currentBoss.questions[currentQuestionIdx];

  const handleSelectBoss = (idx: number) => {
    sounds.playClick();
    setSelectedBossIndex(idx);
    const boss = RAID_BOSSES[idx];
    setBossHp(boss.maxHp);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsVictorious(false);
    setBattleLog([`[ RAID INITIALIZED ] Confronting ${boss.name} (${boss.threatLevel})!`]);
  };

  const handleAttack = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswer === activeQuestion.correctIndex;

    if (isCorrect) {
      sounds.playStatUpgrade();
      setHitEffect(true);
      setTimeout(() => setHitEffect(false), 500);

      const newHp = Math.max(0, bossHp - activeQuestion.damage);
      setBossHp(newHp);

      setBattleLog((prev) => [
        `⚔️ CRITICAL STRIKE! You used [${activeQuestion.skillName}] for ${activeQuestion.damage} DAMAGE!`,
        ...prev,
      ]);

      if (newHp === 0) {
        sounds.playLevelUp();
        setIsVictorious(true);
        setBattleLog((prev) => [
          `🏆 [ BOSS SLAIN! ] ${currentBoss.name} has been vanquished!`,
          `👑 Shadow Extraction available! Command: "ARISE"!`,
          ...prev,
        ]);
      }
    } else {
      sounds.playAlert();
      setBattleLog((prev) => [
        `🛡️ BOSS DEFLECTED! Incorrect answer. The boss cast [Syllabus Penalty]!`,
        ...prev,
      ]);
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    if (currentQuestionIdx < currentBoss.questions.length - 1) {
      setCurrentQuestionIdx((p) => p + 1);
    } else {
      setCurrentQuestionIdx(0);
    }
  };

  const handleResetBattle = () => {
    sounds.playClick();
    setBossHp(currentBoss.maxHp);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsVictorious(false);
    setBattleLog([`[ RAID RESET ] ${currentBoss.name} has regenerated to full health!`]);
  };

  const hpPercent = Math.round((bossHp / currentBoss.maxHp) * 100);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* 1. TOP ARENA BANNER */}
      <div className="solo-window solo-bracket border-2 border-rose-500 rounded-sm overflow-hidden bg-gradient-to-r from-rose-950/80 via-black to-purple-950/80 shadow-[0_0_35px_rgba(255,40,90,0.4)]">
        <div className="solo-header-bar-danger">
          <div className="flex items-center gap-2 font-orbitron text-xs font-black text-rose-200 tracking-widest uppercase">
            <Skull className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>[ DUNGEON RAID ARENA // HIGH-YIELD PYQ BOSS SIMULATOR ]</span>
          </div>
          <span className="text-xs font-mono text-amber-300 font-bold">
            SOLVE PYQS → DEAL DAMAGE → ARISE
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-orbitron font-black text-rose-100 text-glow-red">
            CHEMISTRY BOSS RAID SANCTUM
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-rajdhani max-w-3xl leading-relaxed">
            Test your Class 12th Board Exam mastery in real-time combat against syllabus monarchs. Correctly answering CBSE Previous Year Questions unleashes high-damage formula strikes and unlocks S-Rank Shadow Extractions!
          </p>
        </div>
      </div>

      {/* 2. BOSS SELECTOR TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {RAID_BOSSES.map((boss, idx) => {
          const isSelected = idx === selectedBossIndex;
          return (
            <button
              key={boss.id}
              onClick={() => handleSelectBoss(idx)}
              className={`solo-window solo-bracket p-4 rounded-sm border-2 text-left transition-all ${
                isSelected
                  ? `${boss.borderColor} ${boss.shadowColor} bg-black/90`
                  : "border-slate-800 bg-black/60 hover:border-slate-600 opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{boss.avatarIcon}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold">
                  {boss.threatLevel}
                </span>
              </div>
              <h4 className="font-orbitron text-sm font-black text-slate-100 mt-2">
                {boss.name}
              </h4>
              <div className="text-[11px] font-mono text-cyan-300 mt-0.5">
                {boss.chapter} • {boss.weightage}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE BOSS COMBAT STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Boss Display & Health Matrix (5 Cols) */}
        <div className={`lg:col-span-5 solo-window solo-bracket rounded-sm overflow-hidden border-2 ${currentBoss.borderColor} ${currentBoss.shadowColor} bg-black/90 flex flex-col justify-between`}>
          <div className="solo-header-bar">
            <span className="font-orbitron text-xs font-bold text-slate-200">
              [ TARGET: {currentBoss.name.toUpperCase()} ]
            </span>
            <span className="text-xs font-mono text-rose-400 font-bold">
              {currentBoss.threatLevel}
            </span>
          </div>

          <div className={`p-6 text-center space-y-5 transition-transform duration-200 ${hitEffect ? "scale-95 filter brightness-150" : ""}`}>
            <div className="text-7xl sm:text-8xl py-2 animate-pulse select-none">
              {currentBoss.avatarIcon}
            </div>

            <div>
              <h3 className="text-2xl font-orbitron font-black text-slate-100">
                {currentBoss.name}
              </h3>
              <p className="text-xs font-rajdhani text-slate-300 mt-1">
                {currentBoss.title}
              </p>
            </div>

            {/* Boss HP Bar */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between font-mono text-xs font-bold">
                <span className="text-rose-400 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  BOSS HP
                </span>
                <span className="text-rose-300">
                  {bossHp} / {currentBoss.maxHp} ({hpPercent}%)
                </span>
              </div>
              <div className="w-full h-4 bg-black border border-rose-500/60 rounded-sm p-0.5 overflow-hidden shadow-[0_0_15px_rgba(255,40,90,0.4)]">
                <div
                  className="h-full bg-gradient-to-r from-rose-700 via-rose-500 to-rose-400 transition-all duration-500 rounded-sm"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 font-mono italic text-left bg-black/60 p-3 rounded border border-slate-800">
              &quot;{currentBoss.description}&quot;
            </p>

            {/* Victory / Arise Banner */}
            {isVictorious && (
              <div className="p-4 rounded bg-purple-950/90 border-2 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.8)] space-y-3 animate-fadeIn">
                <div className="text-xs font-orbitron font-black text-purple-300 tracking-widest uppercase">
                  🏆 VICTORY ACHIEVED // S-RANK CLEAR
                </div>
                <p className="text-xs text-slate-200 font-rajdhani">
                  You have defeated {currentBoss.name}! You earned +100 EXP and unlocked the Shadow Soul Extraction.
                </p>
                <button
                  onClick={() => {
                    sounds.playAriseEcho();
                    if (onTriggerArise) onTriggerArise();
                  }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-orbitron font-black text-xs uppercase tracking-widest rounded shadow-[0_0_20px_#a855f7] flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  <span>COMMAND: &ldquo;ARISE&rdquo;</span>
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-black/80 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={handleResetBattle}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs font-orbitron font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RETRY RAID</span>
            </button>

            <span className="text-[11px] font-mono text-cyan-400">
              QUESTION {currentQuestionIdx + 1} OF {currentBoss.questions.length}
            </span>
          </div>
        </div>

        {/* Right: Question Terminal & Battle Log (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Combat Question Box */}
          <div className="solo-window solo-bracket rounded-sm overflow-hidden border-2 border-cyan-400 bg-black/90">
            <div className="solo-header-bar">
              <span className="font-orbitron text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sword className="w-4 h-4 text-cyan-400" />
                [ COMBAT STRIKE QUESTION // PYQ ATTACK ]
              </span>
              <span className="text-xs font-mono text-amber-300 font-bold">
                DAMAGE: {activeQuestion.damage} HP
              </span>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  SKILL ACTIVATION: {activeQuestion.skillName.toUpperCase()}
                </span>
                <h4 className="font-orbitron text-base sm:text-lg font-bold text-slate-100 leading-snug">
                  {activeQuestion.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {activeQuestion.options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === activeQuestion.correctIndex;
                  let btnStyle = "bg-black/70 border-cyan-500/30 text-slate-200 hover:border-cyan-400";

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-950/90 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)]";
                    } else if (isSelected && !isCorrect) {
                      btnStyle = "bg-rose-950/90 border-rose-400 text-rose-200";
                    }
                  } else if (isSelected) {
                    btnStyle = "bg-cyan-950/90 border-cyan-300 text-cyan-100 font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (!isAnswerSubmitted) {
                          sounds.playClick();
                          setSelectedAnswer(i);
                        }
                      }}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-3.5 rounded text-left text-xs sm:text-sm font-rajdhani border transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="font-mono font-bold text-xs uppercase px-2 py-0.5 rounded bg-black/80 border border-slate-700">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons & Explanation */}
              <div className="space-y-3 pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleAttack}
                    disabled={selectedAnswer === null}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white font-orbitron font-black text-xs uppercase tracking-widest rounded shadow-neon-blue transition-all flex items-center justify-center gap-2"
                  >
                    <Sword className="w-4 h-4" />
                    <span>UNLEASH FORMULA ATTACK ({activeQuestion.damage} DMG)</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded bg-black/80 border border-cyan-500/40 text-xs font-rajdhani space-y-1">
                      <span className="text-cyan-300 font-bold font-orbitron block">
                        EXPLANATION & NCERT MARKING SCHEME:
                      </span>
                      <p className="text-slate-200 leading-relaxed">
                        {activeQuestion.explanation}
                      </p>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold text-xs uppercase tracking-widest rounded shadow-neon-blue transition-all flex items-center justify-center gap-2"
                    >
                      <span>NEXT COMBAT QUESTION</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Battle Log */}
          <div className="solo-window solo-bracket rounded-sm overflow-hidden border-2 border-slate-700 bg-black/90">
            <div className="solo-header-bar">
              <span className="font-orbitron text-xs font-bold text-slate-300">
                [ SYSTEM COMBAT LOG // LIVE FEED ]
              </span>
              <span className="text-[10px] font-mono text-emerald-400">STATUS: ACTIVE</span>
            </div>

            <div className="p-4 space-y-1.5 font-mono text-xs max-h-[160px] overflow-y-auto">
              {battleLog.map((log, i) => (
                <div
                  key={i}
                  className={`p-1.5 rounded bg-black/60 border border-slate-800 ${
                    log.includes("CRITICAL")
                      ? "text-cyan-300 font-bold"
                      : log.includes("SLAIN")
                      ? "text-amber-300 font-black"
                      : log.includes("DEFLECTED")
                      ? "text-rose-400"
                      : "text-slate-400"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
