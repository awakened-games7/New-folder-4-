"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  FlaskConical,
  Beaker,
  Atom,
  Zap,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Droplets,
  Wind,
  Thermometer,
  Eye,
  Scroll,
  Crown,
  Flame,
  Sparkles,
  Play,
  Volume2,
  Layers,
  Search,
  Activity,
  Gauge,
  Timer,
  Sliders,
  Filter,
} from "lucide-react";
import { sounds } from "../audio/soundEffects";

// ─────────────────────────────────────────────────────────────
// DATA TYPES & INTERFACES
// ─────────────────────────────────────────────────────────────

type LabMode = "sandbox" | "flame_test" | "titration" | "salt_detective" | "periodic_matrix";
type ReagentCategory = "all" | "salt" | "acid" | "base" | "organic" | "indicator";

interface Reagent {
  id: string;
  name: string;
  formula: string;
  category: "salt" | "acid" | "base" | "organic" | "indicator" | "water";
  color: string; // Hex color for solution
  bgGradient: string;
  borderColor: string;
  description: string;
  state: "liquid" | "solid" | "aqueous";
  phDefault: number;
}

interface ReactionResult {
  id: string;
  reactants: string[];
  equation: string;
  balancedEquation: string;
  observation: string;
  resultColor: string;
  precipitate?: string;
  precipitateColor?: string;
  gasEvolved?: string;
  combustibleGas?: boolean;
  reactionType: string;
  deltaH: "Exothermic (ΔH < 0)" | "Endothermic (ΔH > 0)" | "Athermal (ΔH ≈ 0)";
  tempShift: number;
  phResult: number;
  cbseNote: string;
  chapter: string;
  bubbles: boolean;
  minTempRequired?: number;
}

interface FlameTestElement {
  id: string;
  element: string;
  symbol: string;
  saltName: string;
  flameColorName: string;
  flameColorHex: string;
  wavelength: string;
  description: string;
  cobaltGlassEffect?: string;
}

interface PeriodicElement {
  number: number;
  symbol: string;
  name: string;
  mass: string;
  category: string;
  config: string;
  oxidationStates: string;
  electronegativity: string;
  cbseImportance: string;
}

// ─────────────────────────────────────────────────────────────
// REAGENT VAULT (24 Chemicals inspired by Unreal Chemist & CBSE Class 12)
// ─────────────────────────────────────────────────────────────
const REAGENTS: Reagent[] = [
  // SALTS
  { id: "nacl", name: "Sodium Chloride", formula: "0.9% NaCl (aq)", category: "salt", color: "#e0f2fe", bgGradient: "from-sky-950/70 to-slate-900", borderColor: "border-sky-400/60", description: "Physiological saline, common halide test", state: "aqueous", phDefault: 7.0 },
  { id: "agno3", name: "Silver Nitrate", formula: "AgNO₃ (aq)", category: "salt", color: "#e2e8f0", bgGradient: "from-purple-950/70 to-slate-900", borderColor: "border-purple-400/60", description: "Potent halide precipitation reagent", state: "aqueous", phDefault: 6.0 },
  { id: "bacl2", name: "Barium Chloride", formula: "BaCl₂ (aq)", category: "salt", color: "#fef9c3", bgGradient: "from-yellow-950/70 to-slate-900", borderColor: "border-yellow-400/60", description: "Specific reagent for sulfate ion detection", state: "aqueous", phDefault: 6.5 },
  { id: "cuso4", name: "Copper(II) Sulfate", formula: "CuSO₄ (aq)", category: "salt", color: "#38bdf8", bgGradient: "from-blue-950/70 to-slate-900", borderColor: "border-blue-400/60", description: "Blue vitriol solution, d-block transition ion", state: "aqueous", phDefault: 4.5 },
  { id: "fecl3", name: "Ferric Chloride", formula: "Neutral FeCl₃ (aq)", category: "salt", color: "#f59e0b", bgGradient: "from-amber-950/70 to-slate-900", borderColor: "border-amber-400/60", description: "Key diagnostic for phenolic -OH group", state: "aqueous", phDefault: 3.0 },
  { id: "pbno32", name: "Lead(II) Nitrate", formula: "Pb(NO₃)₂ (aq)", category: "salt", color: "#f1f5f9", bgGradient: "from-slate-900 to-slate-950", borderColor: "border-slate-400/60", description: "Soluble lead salt for iodide & sulfate tests", state: "aqueous", phDefault: 5.0 },
  { id: "ki", name: "Potassium Iodide", formula: "KI (aq)", category: "salt", color: "#fef08a", bgGradient: "from-yellow-950/70 to-slate-900", borderColor: "border-yellow-500/60", description: "Potent nucleophile and iodide source", state: "aqueous", phDefault: 7.0 },
  { id: "kmno4", name: "Potassium Permanganate", formula: "KMnO₄ (aq)", category: "salt", color: "#9333ea", bgGradient: "from-fuchsia-950/70 to-slate-900", borderColor: "border-fuchsia-400/60", description: "Intense violet oxidizer, Baeyer's reagent", state: "aqueous", phDefault: 7.0 },
  { id: "k2cr2o7", name: "Potassium Dichromate", formula: "K₂Cr₂O₇ (aq)", category: "salt", color: "#ea580c", bgGradient: "from-orange-950/70 to-slate-900", borderColor: "border-orange-400/60", description: "Orange d-block oxidizer, chromyl chloride test", state: "aqueous", phDefault: 4.0 },

  // ACIDS
  { id: "hcl", name: "Hydrochloric Acid", formula: "dil. HCl (aq)", category: "acid", color: "#fed7aa", bgGradient: "from-orange-950/70 to-slate-900", borderColor: "border-orange-400/60", description: "Strong monoprotic mineral acid", state: "aqueous", phDefault: 1.0 },
  { id: "h2so4", name: "Sulfuric Acid", formula: "dil. H₂SO₄ (aq)", category: "acid", color: "#fecaca", bgGradient: "from-red-950/70 to-slate-900", borderColor: "border-red-400/60", description: "Strong diprotic dehydrating acid", state: "aqueous", phDefault: 0.8 },
  { id: "hno3", name: "Nitric Acid", formula: "conc. HNO₃ (aq)", category: "acid", color: "#ffe4e6", bgGradient: "from-rose-950/70 to-slate-900", borderColor: "border-rose-400/60", description: "Strong oxidizing acid, xanthoproteic test", state: "aqueous", phDefault: 0.5 },
  { id: "ch3cooh", name: "Acetic Acid", formula: "CH₃COOH (aq)", category: "acid", color: "#fef9c3", bgGradient: "from-amber-950/70 to-slate-900", borderColor: "border-amber-300/60", description: "Weak organic acid, vinegar aroma", state: "aqueous", phDefault: 2.9 },

  // BASES
  { id: "naoh", name: "Sodium Hydroxide", formula: "NaOH (aq)", category: "base", color: "#a5f3fc", bgGradient: "from-cyan-950/70 to-slate-900", borderColor: "border-cyan-400/60", description: "Caustic soda, strong alkali (0.1M - 1.0M)", state: "aqueous", phDefault: 13.0 },
  { id: "nh4oh", name: "Ammonium Hydroxide", formula: "NH₄OH (aq)", category: "base", color: "#bae6fd", bgGradient: "from-sky-950/70 to-slate-900", borderColor: "border-sky-300/60", description: "Volatile alkaline solution, group separation", state: "aqueous", phDefault: 11.2 },
  { id: "na2co3", name: "Sodium Carbonate", formula: "Na₂CO₃ (aq)", category: "base", color: "#ccfbf1", bgGradient: "from-teal-950/70 to-slate-900", borderColor: "border-teal-400/60", description: "Washing soda, generates CO₂ gas with acids", state: "aqueous", phDefault: 11.5 },

  // ORGANICS
  { id: "phenol", name: "Phenol", formula: "C₆H₅OH (l)", category: "organic", color: "#fecdd3", bgGradient: "from-rose-950/70 to-slate-900", borderColor: "border-rose-400/60", description: "Carbolic acid, aromatic alcohol", state: "liquid", phDefault: 5.5 },
  { id: "ethanol", name: "Ethanol", formula: "C₂H₅OH (l)", category: "organic", color: "#d1fae5", bgGradient: "from-emerald-950/70 to-slate-900", borderColor: "border-emerald-400/60", description: "Absolute ethyl alcohol, positive iodoform", state: "liquid", phDefault: 7.0 },
  { id: "acetone", name: "Acetone", formula: "CH₃COCH₃ (l)", category: "organic", color: "#e9d5ff", bgGradient: "from-purple-950/70 to-slate-900", borderColor: "border-purple-400/60", description: "Volatile methyl ketone, polar aprotic", state: "liquid", phDefault: 7.0 },
  { id: "chloroform", name: "Chloroform", formula: "CHCl₃ (l)", category: "organic", color: "#cffafe", bgGradient: "from-teal-950/70 to-slate-900", borderColor: "border-teal-300/60", description: "Trichloromethane, hydrogen-bonding solvent", state: "liquid", phDefault: 7.0 },

  // INDICATORS & SOLVENT
  { id: "water", name: "Distilled Water", formula: "H₂O (l)", category: "water", color: "#bfdbfe", bgGradient: "from-blue-950/70 to-slate-900", borderColor: "border-blue-300/60", description: "Deionized pure universal solvent", state: "liquid", phDefault: 7.0 },
  { id: "phenolphthalein", name: "Phenolphthalein", formula: "Indicator Sol.", category: "indicator", color: "#fdf4ff", bgGradient: "from-fuchsia-950/70 to-slate-900", borderColor: "border-pink-400/60", description: "Colorless in acid/neutral, sharp pink in base", state: "aqueous", phDefault: 7.0 },
  { id: "methyl_orange", name: "Methyl Orange", formula: "Indicator Sol.", category: "indicator", color: "#ffedd5", bgGradient: "from-orange-950/70 to-slate-900", borderColor: "border-orange-500/60", description: "Red in strong acid (pH < 3.1), yellow in alkali", state: "aqueous", phDefault: 7.0 },
  { id: "iodine", name: "Iodine Tincture", formula: "I₂ / KI (aq)", category: "organic", color: "#78350f", bgGradient: "from-amber-950/90 to-slate-900", borderColor: "border-amber-600/60", description: "Deep brown iodine solution for starch/haloform", state: "aqueous", phDefault: 6.5 },
];

// ─────────────────────────────────────────────────────────────
// REACTION ENGINE DATABASE
// ─────────────────────────────────────────────────────────────
const REACTIONS: ReactionResult[] = [
  {
    id: "nacl_agno3",
    reactants: ["nacl", "agno3"],
    equation: "NaCl + AgNO₃ → AgCl↓ + NaNO₃",
    balancedEquation: "NaCl(aq) + AgNO₃(aq) → AgCl(s)↓ + NaNO₃(aq)",
    observation: "Instant formation of a thick, curdy white precipitate of Silver Chloride (AgCl). The flask turns turbid and milky.",
    resultColor: "#f8fafc",
    precipitate: "AgCl (s) - Curdy White Precipitate",
    precipitateColor: "#ffffff",
    reactionType: "Double Displacement / Halide Precipitation",
    deltaH: "Athermal (ΔH ≈ 0)",
    tempShift: 0,
    phResult: 6.5,
    cbseNote: "CBSE Class 12 Halogen Test: AgCl is soluble in dilute NH₄OH forming the diamminesilver(I) complex [Ag(NH₃)₂]⁺.",
    chapter: "Solutions & Haloalkanes",
    bubbles: false,
  },
  {
    id: "bacl2_h2so4",
    reactants: ["bacl2", "h2so4"],
    equation: "BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl",
    balancedEquation: "BaCl₂(aq) + H₂SO₄(aq) → BaSO₄(s)↓ + 2HCl(aq)",
    observation: "Immediate dense white precipitate of Barium Sulfate (BaSO₄) that rapidly settles to the flask base.",
    resultColor: "#f1f5f9",
    precipitate: "BaSO₄ (s) - Heavy White Precipitate",
    precipitateColor: "#f8fafc",
    reactionType: "Precipitation / Anion Confirmatory",
    deltaH: "Exothermic (ΔH < 0)",
    tempShift: 2.5,
    phResult: 1.2,
    cbseNote: "Confirmatory test for SO₄²⁻ anion. BaSO₄ is completely insoluble even in boiling concentrated mineral acids.",
    chapter: "Qualitative Salt Analysis",
    bubbles: false,
  },
  {
    id: "pbno32_ki",
    reactants: ["pbno32", "ki"],
    equation: "Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃",
    balancedEquation: "Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s)↓ + 2KNO₃(aq)",
    observation: "Spectacular flash of brilliant golden-yellow crystalline precipitate (Lead(II) Iodide) settles in the chamber.",
    resultColor: "#fef08a",
    precipitate: "PbI₂ (s) - Golden Yellow Crystalline",
    precipitateColor: "#eab308",
    reactionType: "Double Displacement / Golden Rain Precursor",
    deltaH: "Athermal (ΔH ≈ 0)",
    tempShift: 0,
    phResult: 6.0,
    cbseNote: "The 'Golden Rain' reaction: PbI₂ dissolves in hot water and crystallizes as gleaming gold spangles upon slow cooling.",
    chapter: "Chemical Kinetics & d-Block",
    bubbles: false,
  },
  {
    id: "fecl3_phenol",
    reactants: ["fecl3", "phenol"],
    equation: "6C₆H₅OH + FeCl₃ → [Fe(OC₆H₅)₆]³⁻ + 3H⁺ + 3HCl",
    balancedEquation: "6C₆H₅OH + FeCl₃ → H₃[Fe(OC₆H₅)₆] (deep violet) + 3HCl",
    observation: "Chamber flashes from amber to an intense, royal violet-purple coordination complex.",
    resultColor: "#581c87",
    reactionType: "Coordination Complexation / Functional Group Test",
    deltaH: "Exothermic (ΔH < 0)",
    tempShift: 1.8,
    phResult: 2.8,
    cbseNote: "Primary diagnostic test for Phenols (CBSE Ch 7): Neutral FeCl₃ reacts with enols and phenols to yield violet/blue complexes.",
    chapter: "Alcohols, Phenols & Ethers",
    bubbles: false,
  },
  {
    id: "na2co3_hcl",
    reactants: ["na2co3", "hcl"],
    equation: "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑",
    balancedEquation: "Na₂CO₃(aq) + 2HCl(aq) → 2NaCl(aq) + H₂O(l) + CO₂(g)↑",
    observation: "Vigorous brisk effervescence! Dense streams of colorless Carbon Dioxide (CO₂) bubbles surge up the beaker.",
    resultColor: "#f0fdf4",
    gasEvolved: "CO₂ (Carbon Dioxide gas - non-flammable)",
    combustibleGas: false,
    reactionType: "Acid-Carbonate Gas Evolution",
    deltaH: "Exothermic (ΔH < 0)",
    tempShift: 3.2,
    phResult: 5.5,
    cbseNote: "Brisk effervescence of CO₂ turns lime water milky due to CaCO₃ precipitate. Prolonged bubbling clears it to soluble Ca(HCO₃)₂.",
    chapter: "Qualitative Salt Analysis",
    bubbles: true,
  },
  {
    id: "naoh_hcl",
    reactants: ["naoh", "hcl"],
    equation: "NaOH + HCl → NaCl + H₂O",
    balancedEquation: "NaOH(aq) + HCl(aq) → NaCl(aq) + H₂O(l)",
    observation: "Rapid neutralization! Flask warms up noticeably (+57.1 kJ/mol heat of neutralization).",
    resultColor: "#e0f2fe",
    reactionType: "Strong Acid - Strong Base Neutralization",
    deltaH: "Exothermic (ΔH < 0)",
    tempShift: 8.5,
    phResult: 7.0,
    cbseNote: "Standard enthalpy of neutralization for strong acid-strong base is always constant at -57.1 kJ/mol (formation of water from H⁺ and OH⁻).",
    chapter: "Thermodynamics & Solutions",
    bubbles: false,
  },
  {
    id: "acetone_chloroform",
    reactants: ["acetone", "chloroform"],
    equation: "CH₃COCH₃ + CHCl₃ → [H-Bonded Complex]",
    balancedEquation: "CH₃COCH₃(l) + CHCl₃(l) → CH₃COCH₃···H-CCl₃",
    observation: "Chamber heats up spontaneously (exothermic mixing) with volume contraction due to new intermolecular hydrogen bonds.",
    resultColor: "#ede9fe",
    reactionType: "Non-Ideal Solution Formation (Negative Deviation)",
    deltaH: "Exothermic (ΔH < 0)",
    tempShift: 4.8,
    phResult: 7.0,
    cbseNote: "High-yield CBSE Board Question: Chloroform and Acetone show NEGATIVE deviation from Raoult's law (ΔH_mix < 0, ΔV_mix < 0) due to strong C-H···O=C hydrogen bonds.",
    chapter: "Solutions (Ch 1)",
    bubbles: false,
  },
  {
    id: "cuso4_naoh",
    reactants: ["cuso4", "naoh"],
    equation: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
    balancedEquation: "CuSO₄(aq) + 2NaOH(aq) → Cu(OH)₂(s)↓ + Na₂SO₄(aq)",
    observation: "A pale sky-blue gelatinous precipitate of Copper(II) Hydroxide forms instantly.",
    resultColor: "#67e8f9",
    precipitate: "Cu(OH)₂ (s) - Pale Blue Gelatinous",
    precipitateColor: "#38bdf8",
    reactionType: "Transition Metal Hydroxide Precipitation",
    deltaH: "Athermal (ΔH ≈ 0)",
    tempShift: 0.5,
    phResult: 11.0,
    cbseNote: "Upon heating above 80°C, Cu(OH)₂ decomposes into black copper(II) oxide: Cu(OH)₂ → CuO (black) + H₂O.",
    chapter: "d- & f-Block Elements",
    bubbles: false,
  },
  {
    id: "fecl3_naoh",
    reactants: ["fecl3", "naoh"],
    equation: "FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl",
    balancedEquation: "FeCl₃(aq) + 3NaOH(aq) → Fe(OH)₃(s)↓ + 3NaCl(aq)",
    observation: "Dense reddish-brown gelatinous precipitate of Ferric Hydroxide forms and coagulates.",
    resultColor: "#78350f",
    precipitate: "Fe(OH)₃ (s) - Reddish-Brown Gelatinous",
    precipitateColor: "#9a3412",
    reactionType: "Group III Cation Precipitation",
    deltaH: "Exothermic (ΔH < 0)",
    tempShift: 2.1,
    phResult: 10.5,
    cbseNote: "Group III analytical cation precipitation. Fe(OH)₃ sol is positively charged and easily coagulated by sulfate or phosphate ions.",
    chapter: "Surface Chemistry & d-Block",
    bubbles: false,
  },
  {
    id: "acetone_iodine_naoh",
    reactants: ["acetone", "iodine", "naoh"],
    equation: "CH₃COCH₃ + 3I₂ + 4NaOH → CHI₃↓ + CH₃COONa + 3NaI + 3H₂O",
    balancedEquation: "CH₃COCH₃ + 3I₂ + 4NaOH → CHI₃(s)↓ + CH₃COONa + 3NaI + 3H₂O",
    observation: "Yellow crystalline precipitate of Iodoform (CHI₃) precipitates out with a distinctive antiseptic medicinal odor.",
    resultColor: "#fef08a",
    precipitate: "CHI₃ (s) - Canary Yellow Crystals (Iodoform)",
    precipitateColor: "#facc15",
    reactionType: "Haloform Reaction / Methyl Carbonyl Test",
    deltaH: "Exothermic (ΔH < 0)",
    tempShift: 4.2,
    phResult: 9.0,
    cbseNote: "Classic Iodoform Test (CBSE Ch 8): Given by compounds containing CH₃-C=O or CH₃-CH(OH)- group (e.g. ethanol, acetone, acetaldehyde).",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    bubbles: false,
  },
  {
    id: "naoh_phenolphthalein",
    reactants: ["naoh", "phenolphthalein"],
    equation: "HIn (colorless) + OH⁻ → In⁻ (fuchsia pink) + H₂O",
    balancedEquation: "HIn(aq) + OH⁻(aq) → In⁻(aq) + H₂O(l)",
    observation: "Solution flashes instantly from crystal clear into an intense, glowing fuchsia pink!",
    resultColor: "#ec4899",
    reactionType: "Acid-Base Indicator Chromophore Shift",
    deltaH: "Athermal (ΔH ≈ 0)",
    tempShift: 0,
    phResult: 12.0,
    cbseNote: "Phenolphthalein operating range: pH 8.2 (colorless) to 10.0 (pink). In alkaline medium, the quinonoid resonant structure generates the vivid pink color.",
    chapter: "Equilibrium & Volumetric Analysis",
    bubbles: false,
  },
  {
    id: "hcl_methyl_orange",
    reactants: ["hcl", "methyl_orange"],
    equation: "Ind⁻ (yellow) + H⁺ → HInd (crimson red)",
    balancedEquation: "Ind⁻(aq) + H⁺(aq) → HInd(aq)",
    observation: "Chamber transforms into a radiant crimson red upon acidification.",
    resultColor: "#ef4444",
    reactionType: "Azo-Dye Protonation Indicator Shift",
    deltaH: "Athermal (ΔH ≈ 0)",
    tempShift: 0,
    phResult: 1.5,
    cbseNote: "Methyl orange pH transition range: 3.1 (red) to 4.4 (yellow). Preferred indicator for strong acid vs weak base titrations.",
    chapter: "Volumetric Analysis",
    bubbles: false,
  },
];

// ─────────────────────────────────────────────────────────────
// FLAME TEST DATABASE
// ─────────────────────────────────────────────────────────────
const FLAME_ELEMENTS: FlameTestElement[] = [
  {
    id: "cu",
    element: "Copper",
    symbol: "Cu²⁺",
    saltName: "CuSO₄ / CuCl₂",
    flameColorName: "Brilliant Emerald Green / Azure",
    flameColorHex: "#10b981",
    wavelength: "510 nm - 525 nm",
    description: "High-temperature excitation of Cu²⁺ ions produces a characteristic bright bluish-green flame with sparks.",
  },
  {
    id: "na",
    element: "Sodium",
    symbol: "Na⁺",
    saltName: "NaCl",
    flameColorName: "Intense Golden Yellow",
    flameColorHex: "#eab308",
    wavelength: "589.0 nm & 589.6 nm (D-lines)",
    description: "Extremely sensitive flame reaction. The sodium D-doublet dominates the spectrum with brilliant golden illumination.",
    cobaltGlassEffect: "Invisible through cobalt blue glass (absorbs yellow wavelength completely).",
  },
  {
    id: "k",
    element: "Potassium",
    symbol: "K⁺",
    saltName: "KI / KCl",
    flameColorName: "Lilac / Soft Violet",
    flameColorHex: "#c084fc",
    wavelength: "766 nm & 769 nm",
    description: "Faint lilac flame. Readily masked by traces of sodium unless observed through cobalt blue glass.",
    cobaltGlassEffect: "Appears Crimson / Crimson-Violet through cobalt glass (sodium yellow blocked).",
  },
  {
    id: "ba",
    element: "Barium",
    symbol: "Ba²⁺",
    saltName: "BaCl₂",
    flameColorName: "Apple Green / Pale Green",
    flameColorHex: "#84cc16",
    wavelength: "524 nm",
    description: "Distinct apple green flame coloration. Signature confirmatory test for Group V barium salts.",
  },
  {
    id: "ca",
    element: "Calcium",
    symbol: "Ca²⁺",
    saltName: "CaCl₂",
    flameColorName: "Brick Red",
    flameColorHex: "#f97316",
    wavelength: "622 nm",
    description: "Warm brick red emission flame. Distinguishable from strontium by viewing through cobalt glass (appears light green).",
    cobaltGlassEffect: "Appears pale greenish through cobalt glass.",
  },
  {
    id: "sr",
    element: "Strontium",
    symbol: "Sr²⁺",
    saltName: "SrCl₂",
    flameColorName: "Crimson Red",
    flameColorHex: "#e11d48",
    wavelength: "662 nm & 688 nm",
    description: "Deep, vivid crimson red flame. Widely utilized in flare pyrotechnics and fireworks.",
    cobaltGlassEffect: "Appears purple / deep violet through cobalt glass.",
  },
  {
    id: "pb",
    element: "Lead",
    symbol: "Pb²⁺",
    saltName: "Pb(NO₃)₂",
    flameColorName: "Livid Blue / Pale Greyish",
    flameColorHex: "#93c5fd",
    wavelength: "405 nm",
    description: "Faint, livid pale-blue flame. Must be verified in oxidizing zone of non-luminous Bunsen flame.",
  },
];

// ─────────────────────────────────────────────────────────────
// PERIODIC TABLE QUICK MATRIX
// ─────────────────────────────────────────────────────────────
const PERIODIC_ELEMENTS: PeriodicElement[] = [
  { number: 1, symbol: "H", name: "Hydrogen", mass: "1.008", category: "Nonmetal", config: "1s¹", oxidationStates: "+1, -1", electronegativity: "2.20", cbseImportance: "H₂ evolution in metal-acid reactions, pop-sound confirmatory test." },
  { number: 6, symbol: "C", name: "Carbon", mass: "12.011", category: "Nonmetal", config: "[He] 2s² 2p²", oxidationStates: "+4, +2, -4", electronegativity: "2.55", cbseImportance: "Catenation, tetrahedral bonding, foundation of organic chemistry." },
  { number: 7, symbol: "N", name: "Nitrogen", mass: "14.007", category: "Nonmetal", config: "[He] 2s² 2p³", oxidationStates: "-3 to +5", electronegativity: "3.04", cbseImportance: "Inertness due to N≡N bond energy (941 kJ/mol), Haber process." },
  { number: 8, symbol: "O", name: "Oxygen", mass: "15.999", category: "Nonmetal", config: "[He] 2s² 2p⁴", oxidationStates: "-2, -1", electronegativity: "3.44", cbseImportance: "Paramagnetic O₂ (MOT theory), powerful oxidant." },
  { number: 11, symbol: "Na", name: "Sodium", mass: "22.990", category: "Alkali Metal", config: "[Ne] 3s¹", oxidationStates: "+1", electronegativity: "0.93", cbseImportance: "Flame test: 589nm Golden Yellow D-line. Low work function." },
  { number: 17, symbol: "Cl", name: "Chlorine", mass: "35.45", category: "Halogen", config: "[Ne] 3s² 3p⁵", oxidationStates: "-1, +1, +3, +5, +7", electronegativity: "3.16", cbseImportance: "Deacon's process, highest electron gain enthalpy among halogens." },
  { number: 19, symbol: "K", name: "Potassium", mass: "39.098", category: "Alkali Metal", config: "[Ar] 4s¹", oxidationStates: "+1", electronegativity: "0.82", cbseImportance: "Lilac flame test, forms superoxides (KO₂)." },
  { number: 24, symbol: "Cr", name: "Chromium", mass: "51.996", category: "Transition Metal", config: "[Ar] 3d⁵ 4s¹", oxidationStates: "+6, +3, +2", electronegativity: "1.66", cbseImportance: "Anomalous half-filled 3d⁵ configuration; K₂Cr₂O₇ oxidizer." },
  { number: 25, symbol: "Mn", name: "Manganese", mass: "54.938", category: "Transition Metal", config: "[Ar] 3d⁵ 4s²", oxidationStates: "+2 to +7", electronegativity: "1.55", cbseImportance: "Highest number of oxidation states (+2 to +7); KMnO₄ titrations." },
  { number: 26, symbol: "Fe", name: "Iron", mass: "55.845", category: "Transition Metal", config: "[Ar] 3d⁶ 4s²", oxidationStates: "+2, +3", electronegativity: "1.83", cbseImportance: "Neutral FeCl₃ diagnostic phenol test, hemoglobin active center." },
  { number: 29, symbol: "Cu", name: "Copper", mass: "63.546", category: "Transition Metal", config: "[Ar] 3d¹⁰ 4s¹", oxidationStates: "+1, +2", electronegativity: "1.90", cbseImportance: "Anomalous full 3d¹⁰ configuration; blue vitriol [Cu(H₂O)₄]²⁺." },
  { number: 35, symbol: "Br", name: "Bromine", mass: "79.904", category: "Halogen", config: "[Ar] 3d¹⁰ 4s² 4p⁵", oxidationStates: "-1, +1, +5", electronegativity: "2.96", cbseImportance: "Bromine water test for unsaturation; only liquid non-metal." },
  { number: 47, symbol: "Ag", name: "Silver", mass: "107.87", category: "Transition Metal", config: "[Kr] 4d¹⁰ 5s¹", oxidationStates: "+1", electronegativity: "1.93", cbseImportance: "Tollens' reagent silver mirror test; AgCl photographic curd." },
  { number: 53, symbol: "I", name: "Iodine", mass: "126.90", category: "Halogen", config: "[Kr] 4d¹⁰ 5s² 5p⁵", oxidationStates: "-1, +1, +5, +7", electronegativity: "2.66", cbseImportance: "Iodoform test (CHI₃ yellow crystals), lustrous purple sublimation." },
  { number: 56, symbol: "Ba", name: "Barium", mass: "137.33", category: "Alkaline Earth Metal", config: "[Xe] 6s²", oxidationStates: "+2", electronegativity: "0.89", cbseImportance: "Apple green flame test; BaSO₄ insoluble sulfate test." },
  { number: 82, symbol: "Pb", name: "Lead", mass: "207.2", category: "Post-Transition Metal", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", oxidationStates: "+2, +4", electronegativity: "2.33", cbseImportance: "Inert pair effect stabilizes Pb²⁺ over Pb⁴⁺; Golden rain PbI₂." },
];

// ─────────────────────────────────────────────────────────────
// 3D REALISTIC ORGANIC RED FLAME
// ─────────────────────────────────────────────────────────────
interface RealisticFlameProps {
  size?: "sm" | "md" | "lg";
  intensity?: number;
  overrideColor?: string;
  showEmbers?: boolean;
}

const RealisticFlame: React.FC<RealisticFlameProps> = ({
  size = "md",
  intensity = 1,
  overrideColor,
  showEmbers = true,
}) => {
  if (intensity === 0) return null;

  const heightClass = size === "sm" ? "h-14 w-10" : size === "lg" ? "h-44 w-28" : "h-24 w-16";
  const scale = intensity === 1 ? "scale-75" : intensity === 2 ? "scale-100" : "scale-125";
  const isCustomColor = Boolean(overrideColor);

  return (
    <div className={`relative flex flex-col items-center justify-end ${heightClass} ${scale} transition-all duration-300 pointer-events-none select-none my-0.5`}>
      {/* 1. Deep Ambient Fiery Halo */}
      <div
        className="absolute bottom-0 w-32 h-32 rounded-full animate-flame-halo blur-2xl pointer-events-none -z-10"
        style={{
          backgroundColor: isCustomColor ? overrideColor : "#ef4444",
          opacity: intensity === 3 ? 0.75 : intensity === 2 ? 0.55 : 0.35,
        }}
      />

      {/* 2. Floating Fire Embers & Dancing Sparks */}
      {showEmbers && intensity >= 2 && (
        <div className="absolute inset-0 flex justify-center pointer-events-none overflow-visible -top-6">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ember1 shadow-[0_0_8px_#f59e0b]" />
          <div className="w-1 h-1 rounded-full bg-red-500 animate-ember2 shadow-[0_0_6px_#ef4444]" />
          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ember3 shadow-[0_0_8px_#ea580c]" />
          <div className="w-1 h-1 rounded-full bg-yellow-200 animate-ember1 delay-300 shadow-[0_0_6px_#fde047]" />
        </div>
      )}

      {/* 3. Outer Roaring Red Fire Tongue (Back Layer) */}
      <div
        className="absolute bottom-0 w-full h-full rounded-t-full animate-flame-lick1 opacity-90 blur-[1px]"
        style={{
          background: isCustomColor
            ? `linear-gradient(to top, #0f172a 0%, ${overrideColor} 60%, #ffffff 100%)`
            : "linear-gradient(to top, #7f1d1d 0%, #b91c1c 25%, #dc2626 50%, #ef4444 80%, #f97316 100%)",
          boxShadow: isCustomColor
            ? `0 0 35px ${overrideColor}`
            : "0 0 25px rgba(239, 68, 68, 0.9), 0 0 55px rgba(220, 38, 38, 0.5)",
        }}
      />

      {/* 4. Secondary Asynchronous Blazing Fire Tongue */}
      <div
        className="absolute bottom-0 w-[82%] h-[84%] rounded-t-full animate-flame-lick2 opacity-95 blur-[0.5px]"
        style={{
          background: isCustomColor
            ? `linear-gradient(to top, ${overrideColor} 0%, #ffffff 100%)`
            : "linear-gradient(to top, #991b1b 0%, #ea580c 35%, #f97316 70%, #fde047 100%)",
          boxShadow: "0 0 18px rgba(249, 115, 22, 0.7)",
        }}
      />

      {/* 5. Superheated Hot Golden-White Inner Core */}
      <div
        className="absolute bottom-0 w-[52%] h-[58%] rounded-t-full animate-flame-core opacity-95"
        style={{
          background: isCustomColor
            ? "linear-gradient(to top, rgba(255,255,255,0.4) 0%, #ffffff 100%)"
            : "linear-gradient(to top, #ea580c 0%, #f59e0b 35%, #fde047 70%, #ffffff 100%)",
          boxShadow: "0 0 14px rgba(254, 240, 138, 0.95)",
        }}
      />

      {/* 6. Burner Combustion Base Anchor */}
      <div className="absolute bottom-0 w-[42%] h-[14%] rounded-b-md bg-gradient-to-t from-red-800/80 via-red-600/70 to-transparent blur-[0.5px]" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 3D REALISTIC METALLIC BUNSEN BURNER COMPONENT
// ─────────────────────────────────────────────────────────────
interface BunsenBurner3DProps {
  heatLevel: number;
  size?: "sm" | "md";
}

const BunsenBurner3D: React.FC<BunsenBurner3DProps> = ({ heatLevel, size = "md" }) => {
  const isSmall = size === "sm";

  return (
    <div className="relative flex flex-col items-center justify-end select-none">
      {/* Mounted Realistic Flame */}
      {heatLevel > 0 && (
        <div className="relative -mb-1 z-20">
          <RealisticFlame size={isSmall ? "sm" : "md"} intensity={heatLevel} showEmbers={true} />
        </div>
      )}

      {/* 3D Chrome Orifice Lip */}
      <div className={`${isSmall ? "w-8 h-1.5" : "w-10 h-2"} rounded-full bg-gradient-to-r from-slate-400 via-white to-slate-500 shadow-sm z-10 border-t border-white/60`} />

      {/* 3D Chrome Chimney Cylinder Barrel */}
      <div className={`${isSmall ? "w-6 h-10" : "w-8 h-14"} burner-3d-barrel relative flex flex-col justify-between py-1 rounded-t-sm z-10`}>
        {/* Specular White Vertical Highlight Line */}
        <div className="absolute left-2 top-0 bottom-0 w-1 bg-white/40 blur-[0.5px] pointer-events-none" />
      </div>

      {/* 3D Brass Air Collar with Vent Holes */}
      <div className={`${isSmall ? "w-7 h-3.5" : "w-9 h-4"} burner-3d-brass-collar rounded relative flex items-center justify-around px-1 z-10`}>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-950 border border-black/40 shadow-inner" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-950 border border-black/40 shadow-inner" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-950 border border-black/40 shadow-inner" />
      </div>

      {/* 3D Threaded Collar Base */}
      <div className={`${isSmall ? "w-5 h-2" : "w-6 h-2.5"} bg-gradient-to-r from-slate-700 via-slate-400 to-slate-800 border-x border-slate-600 z-10`} />

      {/* Gas Feed Tube Extending Horizontally */}
      <div className="absolute bottom-2 -right-6 flex items-center z-0 pointer-events-none">
        <div className="w-6 h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 rounded-r border border-amber-800 shadow" />
        <div className="w-2 h-2.5 rounded-r bg-slate-800 border border-slate-600" />
      </div>

      {/* 3D Cast Iron Heavy Base Pedestal */}
      <div className={`${isSmall ? "w-24 h-4" : "w-28 h-5"} burner-3d-base rounded-full relative z-10 flex flex-col items-center justify-center`}>
        {/* Chamfered Inner Rim */}
        <div className="w-[85%] h-1 rounded-full bg-gradient-to-r from-slate-600 via-slate-300 to-slate-700 opacity-60" />
      </div>

      {/* Ground Depth Shadow */}
      <div className={`${isSmall ? "w-28" : "w-32"} h-2 rounded-full bg-black/80 blur-[2px] mt-0.5`} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 3D REALISTIC GLASS BEAKER WITH FLUID MENISCUS & REFRACTIONS
// ─────────────────────────────────────────────────────────────
interface Beaker3DProps {
  currentVolume: number; // 0 to 100
  chamberColor: string;
  activeReaction: ReactionResult | null;
  stirrerRPM: number;
  size?: "compact" | "full";
}

const Beaker3D: React.FC<Beaker3DProps> = ({
  currentVolume,
  chamberColor,
  activeReaction,
  stirrerRPM,
  size = "full",
}) => {
  const isCompact = size === "compact";
  const beakerWidth = isCompact ? "w-36 h-48" : "w-44 h-60";

  return (
    <div className={`relative ${beakerWidth} flex flex-col justify-end select-none`}>
      {/* 3D Glass Beaded Lip Rim */}
      <div className="absolute top-0 left-0 right-0 h-3 rounded-t-xl glass-3d-rim z-20 flex items-center justify-between px-2">
        {/* Beaker Spout Notch */}
        <div className="w-3 h-1.5 -ml-1 rounded-tl-full bg-white/70" />
        <div className="w-2 h-1 bg-white/40 rounded-full" />
      </div>

      {/* 3D Glass Cylindrical Body */}
      <div className="relative w-full h-[95%] glass-3d-cylinder rounded-b-2xl overflow-hidden flex flex-col justify-end">
        {/* Specular Left Glare Reflection Highlight */}
        <div className="absolute left-2 top-0 bottom-0 w-2 bg-gradient-to-r from-white/40 via-white/10 to-transparent pointer-events-none z-20" />
        {/* Specular Right Diffuse Bounce Highlight */}
        <div className="absolute right-2 top-0 bottom-0 w-1.5 bg-gradient-to-l from-white/20 to-transparent pointer-events-none z-20" />

        {/* Graduated Volumetric Enamel Markings */}
        <div className="absolute left-3 top-3 bottom-3 flex flex-col justify-between text-[9px] font-mono text-white/70 pointer-events-none z-20 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          <span>- 100mL</span>
          <span>- 75mL</span>
          <span>- 50mL</span>
          <span>- 25mL</span>
        </div>

        {/* 3D LIQUID VOLUME WITH MENISCUS */}
        <div
          className="w-full relative transition-all duration-700 ease-out flex flex-col justify-start"
          style={{
            height: `${Math.max(currentVolume, 0)}%`,
            opacity: currentVolume > 0 ? 0.92 : 0,
          }}
        >
          {/* Top Elliptical Liquid Surface Meniscus */}
          {currentVolume > 2 && (
            <div
              className="absolute -top-2 left-0 right-0 h-4 liquid-3d-meniscus z-15 border-t border-white/40"
              style={{
                backgroundColor: chamberColor !== "transparent" ? chamberColor : "rgba(56, 189, 248, 0.6)",
                boxShadow: "inset 0 1px 3px rgba(255, 255, 255, 0.6)",
              }}
            />
          )}

          {/* Liquid Core Body Gradient */}
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              background: `linear-gradient(90deg, rgba(0,0,0,0.3) 0%, ${chamberColor !== "transparent" ? chamberColor : "rgba(30, 41, 59, 0.7)"} 30%, ${chamberColor !== "transparent" ? chamberColor : "rgba(30, 41, 59, 0.7)"} 70%, rgba(0,0,0,0.2) 100%)`,
            }}
          >
            {/* Magnetic Stirrer Vortex */}
            {stirrerRPM > 0 && currentVolume > 15 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 border-t-2 border-b-2 border-white/50 rounded-full animate-vortex blur-[0.5px]" />
              </div>
            )}

            {/* Gas Bubbles FX */}
            {activeReaction?.bubbles && (
              <div className="absolute inset-0 flex justify-around pointer-events-none overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-white/70 animate-bubble shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-white/60 animate-bubble delay-100" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bubble delay-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/70 animate-bubble delay-300" />
              </div>
            )}

            {/* Precipitate Settling at Bottom */}
            {activeReaction?.precipitate && (
              <div
                className="absolute bottom-0 w-full h-5 animate-precipitate-settle border-t border-white/50 shadow-md"
                style={{ backgroundColor: activeReaction.precipitateColor || "#ffffff" }}
              />
            )}

            {/* 3D PTFE Magnetic Stir Bar */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-15">
              <div
                className={`w-8 h-2.5 rounded-full bg-white border border-slate-300 shadow-[0_2px_4px_rgba(0,0,0,0.6)] ${stirrerRPM > 0 ? "animate-stirbar-3d" : ""
                  }`}
              />
            </div>
          </div>
        </div>

        {/* 3D Glass Bottom Thickness Curved Plate */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-white/20 to-transparent border-t border-white/10 z-10" />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN LAB CONTROLLER COMPONENT
// ─────────────────────────────────────────────────────────────
export default function VirtualAlchemyLab() {
  const [activeMode, setActiveMode] = useState<LabMode>("sandbox");
  const [activeReagents, setActiveReagents] = useState<string[]>([]);
  const [currentVolume, setCurrentVolume] = useState<number>(0);
  const [doseAmount, setDoseAmount] = useState<number>(25);
  const [temperature, setTemperature] = useState<number>(25);
  const [bunsenHeatLevel, setBunsenHeatLevel] = useState<number>(0);
  const [stirrerRPM, setStirrerRPM] = useState<number>(0);
  const [isSparking, setIsSparking] = useState<boolean>(false);
  const [activeReaction, setActiveReaction] = useState<ReactionResult | null>(null);
  const [chamberColor, setChamberColor] = useState<string>("transparent");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<ReagentCategory>("all");
  const [reactionLog, setReactionLog] = useState<{ id: string; time: string; text: string; xp: number }[]>([
    { id: "init", time: "00:00", text: "3D Virtual Alchemy Chamber online. Ready for Hunter experimentation.", xp: 0 },
  ]);

  // Flame Test State
  const [selectedFlameElement, setSelectedFlameElement] = useState<FlameTestElement>(FLAME_ELEMENTS[0]);
  const [isWireInFlame, setIsWireInFlame] = useState<boolean>(false);
  const [useCobaltGlass, setUseCobaltGlass] = useState<boolean>(false);

  // Titration State
  const [buretteVolume, setBuretteVolume] = useState<number>(50.0);
  const [titrationDelivered, setTitrationDelivered] = useState<number>(0.0);
  const [titrantIndicator, setTitrantIndicator] = useState<"phenolphthalein" | "methyl_orange">("phenolphthalein");
  const [titrationPh, setTitrationPh] = useState<number>(1.0);
  const [isTitratingFlow, setIsTitratingFlow] = useState<boolean>(false);
  const titrationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Salt Detective State
  const [detectiveNotes, setDetectiveNotes] = useState<string[]>([]);
  const [selectedCationGuess, setSelectedCationGuess] = useState<string>("");
  const [selectedAnionGuess, setSelectedAnionGuess] = useState<string>("");
  const [detectiveResult, setDetectiveResult] = useState<string | null>(null);

  // Periodic Table
  const [inspectedElement, setInspectedElement] = useState<PeriodicElement>(PERIODIC_ELEMENTS[4]);

  // Evaluate Reaction
  const evaluateReaction = useCallback((reagentIds: string[]) => {
    let match: ReactionResult | null = null;
    for (const rxn of REACTIONS) {
      if (rxn.reactants.every((r) => reagentIds.includes(r))) {
        match = rxn;
        break;
      }
    }

    if (match) {
      setActiveReaction(match);
      setChamberColor(match.resultColor);
      setTemperature((prev) => Math.min(prev + match!.tempShift, 100));
      sounds.playReaction();
      if (match.bubbles) sounds.playBubble();

      setReactionLog((prev) => [
        {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString().slice(3, 8),
          text: `[REACTION TRIGGERED]: ${match!.equation} (${match!.reactionType})`,
          xp: 150,
        },
        ...prev.slice(0, 15),
      ]);
    } else {
      setActiveReaction(null);
      if (reagentIds.length > 0) {
        const lastReagent = REAGENTS.find((r) => r.id === reagentIds[reagentIds.length - 1]);
        if (lastReagent) setChamberColor(lastReagent.color);
      } else {
        setChamberColor("transparent");
      }
    }
  }, []);

  const handleAddReagent = (reagent: Reagent) => {
    sounds.playClick();
    if (currentVolume >= 100) {
      sounds.playAlert();
      return;
    }

    const nextVol = Math.min(currentVolume + doseAmount, 100);
    setCurrentVolume(nextVol);

    const nextReagents = activeReagents.includes(reagent.id)
      ? activeReagents
      : [...activeReagents, reagent.id];

    setActiveReagents(nextReagents);
    evaluateReaction(nextReagents);

    setReactionLog((prev) => [
      {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString().slice(3, 8),
        text: `Dosed +${doseAmount}mL ${reagent.name} [${reagent.formula}].`,
        xp: 25,
      },
      ...prev.slice(0, 15),
    ]);
  };

  const handlePurgeFlask = () => {
    sounds.playAlert();
    setActiveReagents([]);
    setCurrentVolume(0);
    setTemperature(25);
    setBunsenHeatLevel(0);
    setStirrerRPM(0);
    setActiveReaction(null);
    setChamberColor("transparent");
    setReactionLog((prev) => [
      {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString().slice(3, 8),
        text: "CHAMBER PURGED. Decontaminated with Distilled H₂O wash.",
        xp: 0,
      },
      ...prev.slice(0, 15),
    ]);
  };

  const handleSparkIgnite = () => {
    sounds.playFlame();
    setIsSparking(true);
    setTimeout(() => setIsSparking(false), 500);

    if (activeReaction && activeReaction.combustibleGas) {
      sounds.playPop();
      setReactionLog((prev) => [
        {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString().slice(3, 8),
          text: `💥 [POP EXPLOSION]: Evolved ${activeReaction.gasEvolved} ignited with brilliant flash!`,
          xp: 200,
        },
        ...prev.slice(0, 15),
      ]);
    } else {
      setReactionLog((prev) => [
        {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString().slice(3, 8),
          text: "Spark generated. No combustible gas pocket detected in headspace.",
          xp: 10,
        },
        ...prev.slice(0, 15),
      ]);
    }
  };

  const handleBunsenToggle = () => {
    sounds.playFlame();
    const nextLevel = (bunsenHeatLevel + 1) % 4;
    setBunsenHeatLevel(nextLevel);
    const temps = [25, 95, 180, 420];
    setTemperature(temps[nextLevel]);
  };

  const handleStirrerToggle = () => {
    sounds.playClick();
    const rpms = [0, 400, 800, 1200];
    const currentIndex = rpms.indexOf(stirrerRPM);
    setStirrerRPM(rpms[(currentIndex + 1) % rpms.length]);
  };

  // Titration Loop
  const handleToggleTitrationFlow = () => {
    sounds.playClick();
    if (isTitratingFlow) {
      setIsTitratingFlow(false);
      if (titrationIntervalRef.current) clearInterval(titrationIntervalRef.current);
    } else {
      setIsTitratingFlow(true);
      titrationIntervalRef.current = setInterval(() => {
        sounds.playDrip();
        setBuretteVolume((prev) => {
          if (prev <= 0.5) {
            setIsTitratingFlow(false);
            if (titrationIntervalRef.current) clearInterval(titrationIntervalRef.current);
            return 0;
          }
          return Math.max(0, +(prev - 0.5).toFixed(1));
        });

        setTitrationDelivered((prev) => {
          const nextDelivered = +(prev + 0.5).toFixed(1);
          if (nextDelivered < 18.0) {
            setTitrationPh(+(1.0 + (nextDelivered / 20.0) * 1.5).toFixed(2));
          } else if (nextDelivered >= 18.0 && nextDelivered < 20.0) {
            setTitrationPh(+(2.5 + ((nextDelivered - 18) / 2.0) * 4.5).toFixed(2));
          } else if (nextDelivered >= 20.0 && nextDelivered <= 20.5) {
            setTitrationPh(8.5);
            sounds.playLevelUp();
          } else {
            setTitrationPh(+(10.5 + Math.min(2.0, (nextDelivered - 20) * 0.1)).toFixed(2));
          }
          return nextDelivered;
        });
      }, 300);
    }
  };

  // Auto-scroll handler for anchor hash deep-links (#alchemy-lab or #arena-raid-view)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#alchemy-lab" || hash === "#arena-raid-view") {
        setTimeout(() => {
          const el = document.getElementById("alchemy-lab") || document.getElementById("arena-raid-view");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 300); // 300ms delay ensures React finishes mounting before scrolling
      }
    }
  }, []);

  const handleResetTitration = () => {
    sounds.playAlert();
    if (titrationIntervalRef.current) clearInterval(titrationIntervalRef.current);
    setIsTitratingFlow(false);
    setBuretteVolume(50.0);
    setTitrationDelivered(0.0);
    setTitrationPh(1.0);
  };

  // Filtered reagents for easy access
  const filteredReagents = REAGENTS.filter((r) => {
    if (activeCategoryFilter === "all") return true;
    return r.category === activeCategoryFilter;
  });

  const calculatedPh = activeReaction ? activeReaction.phResult : activeReagents.length > 0 ? 7.0 : 7.0;

  return (
    <section id="alchemy-lab" className="relative w-full py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── HEADER TITLE & BADGE ── */}
      <div className="relative mb-5 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <FlaskConical className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>3D UNREAL CHEMIST ENGINE • LEGENDARY TIER</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_0_25px_rgba(0,255,221,0.3)]">
          VIRTUAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">ALCHEMY LAB</span>
        </h2>
        <p className="mt-1 text-xs text-slate-400 max-w-xl mx-auto font-mono">
          Interactive 3D laboratory apparatus, realistic red fire burner, and dropwise titration simulator.
        </p>
      </div>

      {/* ── SUB-MODE NAVIGATION TABS ── */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 mb-6 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: "sandbox", label: "REACTION CHAMBER", icon: FlaskConical, color: "text-emerald-400", border: "border-emerald-500" },
          { id: "flame_test", label: "FLAME SPECTROSCOPY", icon: Flame, color: "text-amber-400", border: "border-amber-500" },
          { id: "titration", label: "BURETTE & TITRATION", icon: Droplets, color: "text-cyan-400", border: "border-cyan-500" },
          { id: "salt_detective", label: "SALT DETECTIVE", icon: Search, color: "text-purple-400", border: "border-purple-500" },
          { id: "periodic_matrix", label: "PERIODIC MATRIX", icon: Atom, color: "text-rose-400", border: "border-rose-500" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveMode(tab.id as LabMode);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider whitespace-nowrap transition-all border shrink-0 ${isActive
                ? `bg-slate-900 ${tab.border} ${tab.color} shadow-[0_0_12px_rgba(0,255,221,0.25)] font-bold`
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═════════════════════════════════════════════════════════════
          MODE 1: REACTION CHAMBER (ERGONOMIC MOBILE + 3D APPARATUS)
      ═════════════════════════════════════════════════════════════ */}
      {activeMode === "sandbox" && (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5">
          {/* 
            MOBILE FIRST: ON SCREENS < 1024px, SHOW THE 3D APPARATUS AT TOP!
            No more scrolling/sliding 500px down to see the flask!
          */}
          <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col gap-4">
            {/* 3D CHAMBER VIEWPORT FRAME */}
            <div className="solo-window p-4 sm:p-6 rounded-2xl border border-slate-800 bg-[#0A0D14]/95 backdrop-blur-md flex flex-col items-center justify-center relative min-h-[340px] sm:min-h-[400px] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              {/* Headspace Spark Shockwave */}
              {isSparking && (
                <div className="absolute top-10 w-24 h-24 rounded-full bg-amber-400/40 animate-spark-pop pointer-events-none z-30 blur-sm" />
              )}

              {/* HUD Telemetry Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono z-30">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-slate-200 flex items-center gap-1 shadow">
                    <Thermometer className="w-3 h-3 text-red-400" /> {temperature.toFixed(1)}°C
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-slate-200 flex items-center gap-1 shadow">
                    <Gauge className="w-3 h-3 text-cyan-400" /> pH {calculatedPh.toFixed(1)}
                  </span>
                </div>
                <div className="px-2.5 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-emerald-400 font-bold shadow">
                  {currentVolume} / 100 mL
                </div>
              </div>

              {/* Steam Rising FX when Heated */}
              {bunsenHeatLevel > 0 && currentVolume > 0 && (
                <div className="absolute top-8 flex gap-4 pointer-events-none z-25">
                  <div className="w-6 h-12 bg-white/10 rounded-full animate-steam blur-md" />
                  <div className="w-8 h-16 bg-white/15 rounded-full animate-steam blur-lg delay-150" />
                  <div className="w-5 h-10 bg-white/10 rounded-full animate-steam blur-md delay-300" />
                </div>
              )}

              {/* 3D APPARATUS STAGE: 3D BEAKER + 3D METALLIC BUNSEN BURNER */}
              <div className="flex flex-col items-center justify-end z-20 mt-6">
                {/* 3D Volumetric Beaker */}
                <Beaker3D
                  currentVolume={currentVolume}
                  chamberColor={chamberColor}
                  activeReaction={activeReaction}
                  stirrerRPM={stirrerRPM}
                  size="full"
                />

                {/* 3D Metallic Bunsen Burner with Organic Red Flame */}
                <div className="mt-2">
                  <BunsenBurner3D heatLevel={bunsenHeatLevel} size="md" />
                </div>
              </div>

              {/* QUICK ONE-TOUCH MOBILE APPARATUS CONTROLS (DOCK BAR) */}
              <div className="w-full mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5 font-mono text-[10px] sm:text-xs z-30">
                {/* Heater Toggle */}
                <button
                  onClick={handleBunsenToggle}
                  className={`flex-1 py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${bunsenHeatLevel > 0
                    ? "border-red-500 bg-red-950/50 text-red-300 font-bold shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    : "border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white"
                    }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${bunsenHeatLevel > 0 ? "text-red-400 animate-flame" : ""}`} />
                  <span>{bunsenHeatLevel === 0 ? "FLAME: OFF" : `HEAT: L${bunsenHeatLevel}`}</span>
                </button>

                {/* Stirrer Toggle */}
                <button
                  onClick={handleStirrerToggle}
                  className={`flex-1 py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${stirrerRPM > 0
                    ? "border-cyan-500 bg-cyan-950/50 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    : "border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white"
                    }`}
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${stirrerRPM > 0 ? "text-cyan-400 animate-spin" : ""}`} />
                  <span>{stirrerRPM === 0 ? "STIR: OFF" : `${stirrerRPM} RPM`}</span>
                </button>

                {/* Gas Spark Gun */}
                <button
                  onClick={handleSparkIgnite}
                  className="py-1.5 px-2.5 rounded-lg border border-red-500/50 bg-red-950/40 text-red-300 hover:bg-red-900/40 flex items-center gap-1 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">SPARK</span>
                </button>

                {/* Purge Flask */}
                <button
                  onClick={handlePurgeFlask}
                  className="py-1.5 px-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-all font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PURGE</span>
                </button>
              </div>
            </div>

            {/* LIVE REACTION INTEL & CBSE CLASS 12 BREAKDOWN */}
            {activeReaction ? (
              <div className="solo-window p-3.5 sm:p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 backdrop-blur-md flex flex-col gap-2 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {activeReaction.reactionType}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300">
                    {activeReaction.deltaH}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-bold text-white tracking-wide bg-slate-900/90 p-2 rounded border border-slate-800 break-words">
                  {activeReaction.balancedEquation}
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold">Observation: </span>
                  {activeReaction.observation}
                </div>

                {activeReaction.precipitate && (
                  <div className="text-xs text-amber-300 flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Precipitate: {activeReaction.precipitate}</span>
                  </div>
                )}

                <div className="mt-1 pt-2 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
                  <div className="text-cyan-400 font-bold mb-1 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> CBSE CLASS 12 TACTICAL INTEL [{activeReaction.chapter}]
                  </div>
                  {activeReaction.cbseNote}
                </div>
              </div>
            ) : null}
          </div>

          {/* 
            REAGENT VAULT: DIRECTLY ACCESSIBLE WITH 1-TAP CATEGORIES
            On mobile, sits right underneath the flask so students can tap reagents and instantly see the flask!
          */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col gap-3 font-mono">
            <div className="solo-window p-3.5 sm:p-4 rounded-xl border border-slate-800 bg-[#0A0D14]/90 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white text-xs uppercase font-bold tracking-wider">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>CHEMICAL VAULT</span>
                </div>
                {/* Dosage volume pills */}
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-700">
                  {[10, 25, 50].map((vol) => (
                    <button
                      key={vol}
                      onClick={() => {
                        sounds.playClick();
                        setDoseAmount(vol);
                      }}
                      className={`px-2 py-0.5 text-[10px] rounded ${doseAmount === vol ? "bg-emerald-500 text-black font-bold" : "text-slate-400 hover:text-white"
                        }`}
                    >
                      +{vol}mL
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Filter Category Pills (All, Salts, Acids, Bases, Organics) */}
              <div className="flex items-center gap-1 mb-2.5 overflow-x-auto pb-1 text-[10px] custom-scrollbar">
                {[
                  { id: "all", label: "ALL" },
                  { id: "salt", label: "SALTS" },
                  { id: "acid", label: "ACIDS" },
                  { id: "base", label: "BASES" },
                  { id: "organic", label: "ORGANICS" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sounds.playClick();
                      setActiveCategoryFilter(cat.id as ReagentCategory);
                    }}
                    className={`px-2.5 py-1 rounded-md border uppercase whitespace-nowrap transition-all ${activeCategoryFilter === cat.id
                      ? "bg-emerald-950 border-emerald-400 text-emerald-300 font-bold"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Scrollable grid of chemicals */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[380px] sm:max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                {filteredReagents.map((reagent) => {
                  const isPresent = activeReagents.includes(reagent.id);
                  return (
                    <button
                      key={reagent.id}
                      onClick={() => handleAddReagent(reagent)}
                      className={`p-2 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between h-[76px] sm:h-[82px] relative overflow-hidden group ${isPresent
                        ? "border-emerald-400 bg-emerald-950/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                        : `border-slate-800 bg-gradient-to-br ${reagent.bgGradient} hover:border-slate-600`
                        }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[9px] text-slate-400 uppercase">{reagent.category}</span>
                        <div
                          className="w-2.5 h-2.5 rounded-full border border-white/30"
                          style={{ backgroundColor: reagent.color }}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white truncate group-hover:text-emerald-300">
                          {reagent.name}
                        </div>
                        <div className="text-[10px] text-emerald-400 truncate">{reagent.formula}</div>
                      </div>
                      <div className="absolute right-1 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-emerald-400">
                        +{doseAmount}mL
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          MODE 2: FLAME SPECTROSCOPY (3D BUNSEN & WIRE APPARATUS)
      ═════════════════════════════════════════════════════════════ */}
      {activeMode === "flame_test" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Elements Selector (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="solo-window p-4 rounded-xl border border-slate-800 bg-[#0A0D14]/90">
              <div className="flex items-center gap-2 text-white font-mono text-xs uppercase font-bold tracking-wider mb-3">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>SELECT SALT EMISSION SAMPLE</span>
              </div>
              <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                {FLAME_ELEMENTS.map((elem) => (
                  <button
                    key={elem.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedFlameElement(elem);
                    }}
                    className={`p-2.5 rounded-lg border text-left font-mono transition-all flex items-center justify-between ${selectedFlameElement.id === elem.id
                      ? "border-amber-400 bg-amber-950/40 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                      }`}
                  >
                    <div>
                      <div className="text-xs text-white">{elem.element} [{elem.symbol}]</div>
                      <div className="text-[10px] text-slate-400">{elem.saltName}</div>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: elem.flameColorHex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Bunsen Burner Flame Stage (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="solo-window p-6 rounded-xl border border-slate-800 bg-[#0A0D14]/95 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
              {/* Cobalt Glass Toggle */}
              <div className="absolute top-4 right-4 z-30">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setUseCobaltGlass(!useCobaltGlass);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-2 ${useCobaltGlass
                    ? "bg-blue-900 border-blue-400 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>COBALT BLUE GLASS: {useCobaltGlass ? "ON" : "OFF"}</span>
                </button>
              </div>

              {/* Cobalt Glass Overlay Filter */}
              {useCobaltGlass && (
                <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-[1px] pointer-events-none z-10 flex items-center justify-center">
                  <div className="text-blue-300/40 text-xs font-mono uppercase tracking-widest">
                    [COBALT BLUE GLASS OPTICAL FILTER ENGAGED]
                  </div>
                </div>
              )}

              {/* Platinum Wire Loop Thrusting Mechanism into 3D Flame */}
              <div className="relative flex flex-col items-center z-20">
                {/* Platinum Wire Loop with sample */}
                <div
                  className={`w-1 h-32 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-400 rounded transition-transform duration-500 ease-out flex flex-col items-center justify-end z-25 shadow-md ${isWireInFlame ? "translate-y-8" : "-translate-y-6"
                    }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-slate-300 shadow-sm"
                    style={{
                      backgroundColor: isWireInFlame ? selectedFlameElement.flameColorHex : "#cbd5e1",
                    }}
                  />
                </div>

                {/* 3D Realistic Roaring Flame */}
                <div className="my-1">
                  <RealisticFlame
                    size="lg"
                    intensity={3}
                    overrideColor={
                      isWireInFlame
                        ? useCobaltGlass && selectedFlameElement.cobaltGlassEffect
                          ? "#9333ea"
                          : selectedFlameElement.flameColorHex
                        : undefined
                    }
                    showEmbers={true}
                  />
                </div>

                {/* 3D Metallic Bunsen Burner Base */}
                <BunsenBurner3D heatLevel={3} size="md" />
              </div>

              {/* Action Button */}
              <div className="mt-5 z-30">
                <button
                  onClick={() => {
                    sounds.playFlame();
                    setIsWireInFlame(!isWireInFlame);
                  }}
                  className={`px-5 py-2.5 rounded-lg border font-mono text-xs uppercase tracking-wider font-bold transition-all ${isWireInFlame
                    ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                    : "bg-slate-900 text-amber-400 border-amber-500/50 hover:bg-slate-800"
                    }`}
                >
                  {isWireInFlame ? "RETRACT PLATINUM WIRE" : "DIP WIRE INTO FLAME"}
                </button>
              </div>
            </div>

            {/* Emission Spectrum Breakdown Card */}
            <div className="solo-window p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 font-mono text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span>EMISSION COLOR: {selectedFlameElement.flameColorName}</span>
                <span className="text-[10px] text-slate-400">{selectedFlameElement.wavelength}</span>
              </div>
              <p className="text-slate-300">{selectedFlameElement.description}</p>
              {selectedFlameElement.cobaltGlassEffect && (
                <div className="text-blue-300 text-[11px] bg-blue-950/40 p-2 rounded border border-blue-800/40">
                  <span className="font-bold">Through Cobalt Blue Glass: </span>
                  {selectedFlameElement.cobaltGlassEffect}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          MODE 3: 3D BURETTE & TITRATION SIMULATOR
      ═════════════════════════════════════════════════════════════ */}
      {activeMode === "titration" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Calculations (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 font-mono">
            <div className="solo-window p-4 rounded-xl border border-slate-800 bg-[#0A0D14]/90 flex flex-col gap-3 text-xs">
              <div className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>TITRATION PROTOCOL: 0.1M NaOH vs 0.1M HCl</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Analyte: 20.0 mL of 0.1M HCl in conical flask. Titrant: 0.1M NaOH in 50 mL burette.
              </p>

              {/* Indicator Selector */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
                <span className="text-slate-400 text-[10px]">CHOOSE INDICATOR:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setTitrantIndicator("phenolphthalein");
                    }}
                    className={`p-2 rounded border text-xs text-left ${titrantIndicator === "phenolphthalein"
                      ? "border-pink-500 bg-pink-950/40 text-pink-300 font-bold"
                      : "border-slate-800 bg-slate-900 text-slate-400"
                      }`}
                  >
                    Phenolphthalein
                    <div className="text-[9px] text-slate-400">Endpoint: Pink (pH 8.2)</div>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setTitrantIndicator("methyl_orange");
                    }}
                    className={`p-2 rounded border text-xs text-left ${titrantIndicator === "methyl_orange"
                      ? "border-amber-500 bg-amber-950/40 text-amber-300 font-bold"
                      : "border-slate-800 bg-slate-900 text-slate-400"
                      }`}
                  >
                    Methyl Orange
                    <div className="text-[9px] text-slate-400">Endpoint: Yellow (pH 4.4)</div>
                  </button>
                </div>
              </div>

              {/* Flow Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleToggleTitrationFlow}
                  className={`p-2.5 rounded font-bold text-xs uppercase transition-all ${isTitratingFlow
                    ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                    : "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    }`}
                >
                  {isTitratingFlow ? "STOP STOPCOCK" : "START DROPWISE"}
                </button>
                <button
                  onClick={handleResetTitration}
                  className="p-2.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                >
                  RESET BURETTE
                </button>
              </div>
            </div>

            {/* Titration Telemetry & Molarity Solver */}
            <div className="solo-window p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-xs flex flex-col gap-2">
              <div className="text-cyan-300 font-bold flex items-center justify-between">
                <span>VOLUMETRIC TELEMETRY</span>
                <span className="text-[10px] text-slate-400">CLASS 12 PRACTICAL</span>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400">DELIVERED VOL</div>
                  <div className="text-sm font-bold text-white">{titrationDelivered.toFixed(1)} mL</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">FLASK pH</div>
                  <div className="text-sm font-bold text-cyan-400">{titrationPh.toFixed(2)}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-300 pt-1">
                <span className="font-bold text-white">Equivalence Formula: </span>
                <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">M₁V₁ (Acid) = M₂V₂ (Base)</code>
              </div>
              <p className="text-[10px] text-slate-400">
                At exactly 20.0 mL of 0.1M NaOH delivered, complete neutralization occurs and the solution flashes permanent faint pink!
              </p>
            </div>
          </div>

          {/* 3D Burette & Erlenmeyer Visual Stage (7 cols) */}
          <div className="lg:col-span-7 solo-window p-6 rounded-xl border border-slate-800 bg-[#0A0D14]/95 flex flex-col items-center justify-center relative min-h-[420px]">
            {/* 3D Graduated Precision Glass Burette Tube */}
            <div className="relative w-8 h-56 glass-3d-cylinder rounded-b flex flex-col justify-end overflow-hidden shadow-2xl">
              {/* Specular White Line Highlight */}
              <div className="absolute left-1.5 top-0 bottom-0 w-1 bg-white/40 pointer-events-none z-20" />

              {/* Liquid inside burette */}
              <div
                className="w-full bg-cyan-400/50 transition-all duration-300 relative"
                style={{ height: `${(buretteVolume / 50.0) * 100}%` }}
              >
                {/* 3D Concave Liquid Meniscus */}
                <div className="absolute -top-1 left-0 right-0 h-2 rounded-full bg-cyan-200/60 border-t border-white/60" />
              </div>

              {/* Calibrations in crisp white */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 text-[8px] text-white/70 font-mono pointer-events-none px-1 font-bold">
                <span>- 0</span>
                <span>- 10</span>
                <span>- 20</span>
                <span>- 30</span>
                <span>- 40</span>
                <span>- 50</span>
              </div>
            </div>

            {/* 3D Glass Stopcock Valve & Nozzle */}
            <div className="relative flex flex-col items-center my-1 z-10">
              {/* Valve key handle */}
              <div className="w-6 h-2.5 rounded bg-gradient-to-r from-red-600 via-red-400 to-red-700 shadow-md border border-red-900" />
              <div className="w-1.5 h-3 bg-gradient-to-r from-slate-400 to-slate-200" />

              {/* Falling Droplet FX */}
              {isTitratingFlow && (
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-drop shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}
            </div>

            {/* 3D Conical Erlenmeyer Glass Flask */}
            <div className="relative w-40 h-36 glass-3d-cylinder rounded-b-3xl overflow-hidden flex flex-col justify-end shadow-2xl">
              {/* Dual glass reflections */}
              <div className="absolute left-2 top-0 bottom-0 w-2 bg-gradient-to-r from-white/30 to-transparent pointer-events-none z-20" />
              <div className="absolute right-2 top-0 bottom-0 w-1.5 bg-gradient-to-l from-white/20 to-transparent pointer-events-none z-20" />

              {/* 3D Solution with Dynamic Color Transition */}
              <div
                className="w-full relative transition-all duration-500 ease-out flex flex-col justify-start"
                style={{
                  height: "45%",
                  backgroundColor:
                    titrantIndicator === "phenolphthalein"
                      ? titrationPh >= 8.2
                        ? "#ec4899"
                        : "rgba(224, 242, 254, 0.45)"
                      : titrationPh < 3.5
                        ? "#ef4444"
                        : "#eab308",
                  opacity: 0.9,
                }}
              >
                {/* 3D Meniscus */}
                <div className="absolute -top-1.5 left-0 right-0 h-3 rounded-full bg-white/30 border-t border-white/50" />

                {/* Spinning Stir Bar at Base */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2">
                  <div className="w-7 h-2 rounded-full bg-white border border-slate-300 shadow animate-stirbar-3d" />
                </div>
              </div>
            </div>

            {/* Magnetic Stirrer Base Platform */}
            <div className="w-44 h-3 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-900 rounded-full mt-1 border-t border-slate-500 shadow-md" />
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          MODE 4: SALT ANALYSIS DETECTIVE (CBSE CLASS 12 SCHEME)
      ═════════════════════════════════════════════════════════════ */}
      {activeMode === "salt_detective" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="solo-window p-4 rounded-xl border border-slate-800 bg-[#0A0D14]/90 flex flex-col gap-2.5 text-xs">
              <div className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-400" />
                <span>MYSTERY SALT #A-12 INVESTIGATION</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Execute systematic preliminary, group, and confirmatory tests to identify the unknown crystalline salt.
              </p>

              <div className="flex flex-col gap-2 pt-2">
                {[
                  { id: "flame", label: "1. Platinum Wire Flame Test" },
                  { id: "dil_acid", label: "2. Dilute H₂SO₄ Anion Group Test" },
                  { id: "conc_acid", label: "3. Conc. H₂SO₄ + Copper Turnings Test" },
                  { id: "ki_confirm", label: "4. Potassium Iodide (KI) Confirmatory" },
                  { id: "brown_ring", label: "5. Ring Test for Nitrate (FeSO₄ + H₂SO₄)" },
                ].map((test) => (
                  <button
                    key={test.id}
                    onClick={() => {
                      sounds.playClick();
                      let note = "";
                      if (test.id === "flame") note = "Flame Test: Produced a pale livid-blue/greyish flame on platinum wire.";
                      else if (test.id === "dil_acid") note = "Dilute H₂SO₄: No brisk effervescence observed (Carbonate, Sulfite absent).";
                      else if (test.id === "conc_acid") note = "Conc. H₂SO₄: Brown fumes of NO₂ evolved upon heating with copper turnings (Nitrate suspected!).";
                      else if (test.id === "ki_confirm") note = "KI Solution Added: Brilliant golden yellow precipitate of PbI₂ formed instantly (Lead Pb²⁺ confirmed!).";
                      else if (test.id === "brown_ring") note = "Brown Ring Test: Distinct brown ring formed at junction of FeSO₄ and conc. H₂SO₄ (Nitrate NO₃⁻ confirmed!).";

                      if (!detectiveNotes.includes(note)) setDetectiveNotes((prev) => [...prev, note]);
                    }}
                    className="p-2 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:border-purple-400 text-left flex items-center justify-between transition-all"
                  >
                    <span>{test.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Notebook Observations */}
            <div className="solo-window p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 text-xs flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
              <div className="text-purple-300 font-bold">LAB NOTEBOOK OBSERVATIONS:</div>
              {detectiveNotes.length === 0 ? (
                <div className="text-slate-500 text-[11px]">No tests performed yet. Click tests above.</div>
              ) : (
                detectiveNotes.map((note, idx) => (
                  <div key={idx} className="text-[11px] text-slate-300 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                    {note}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Hunter Verdict & Deduction Form (7 cols) */}
          <div className="lg:col-span-7 solo-window p-6 rounded-xl border border-slate-800 bg-[#0A0D14]/95 flex flex-col justify-between text-xs">
            <div>
              <div className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>FINAL SALT IDENTIFICATION DEDUCTION</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-4">
                Match your observations against the CBSE Class 12 Qualitative Analysis scheme and submit the final diagnosis.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">IDENTIFIED CATION (BASIC RADICAL):</label>
                  <select
                    value={selectedCationGuess}
                    onChange={(e) => setSelectedCationGuess(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs"
                  >
                    <option value="">-- Choose Cation --</option>
                    <option value="Lead (Pb²⁺)">Lead (Pb²⁺) [Group I]</option>
                    <option value="Copper (Cu²⁺)">Copper (Cu²⁺) [Group II]</option>
                    <option value="Iron (Fe³⁺)">Iron (Fe³⁺) [Group III]</option>
                    <option value="Barium (Ba²⁺)">Barium (Ba²⁺) [Group V]</option>
                    <option value="Ammonium (NH₄⁺)">Ammonium (NH₄⁺) [Zero Group]</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">IDENTIFIED ANION (ACID RADICAL):</label>
                  <select
                    value={selectedAnionGuess}
                    onChange={(e) => setSelectedAnionGuess(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs"
                  >
                    <option value="">-- Choose Anion --</option>
                    <option value="Nitrate (NO₃⁻)">Nitrate (NO₃⁻)</option>
                    <option value="Chloride (Cl⁻)">Chloride (Cl⁻)</option>
                    <option value="Sulfate (SO₄²⁻)">Sulfate (SO₄²⁻)</option>
                    <option value="Carbonate (CO₃²⁻)">Carbonate (CO₃²⁻)</option>
                  </select>
                </div>
              </div>

              {detectiveResult && (
                <div
                  className={`p-3 rounded-lg border text-xs font-bold ${detectiveResult.startsWith("CORRECT")
                    ? "bg-emerald-950/60 border-emerald-500 text-emerald-300"
                    : "bg-red-950/60 border-red-500 text-red-300"
                    }`}
                >
                  {detectiveResult}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (selectedCationGuess === "Lead (Pb²⁺)" && selectedAnionGuess === "Nitrate (NO₃⁻)") {
                  sounds.playLevelUp();
                  setDetectiveResult("CORRECT! You identified Lead(II) Nitrate Pb(NO₃)₂. +500 Hunter Chemistry XP Awarded!");
                } else {
                  sounds.playAlert();
                  setDetectiveResult("INCORRECT ANALYSIS. Re-examine the confirmatory tests and qualitative flow chart.");
                }
              }}
              className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:brightness-110 transition-all"
            >
              SUBMIT SYSTEM IDENTIFICATION
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          MODE 5: PERIODIC ELEMENT MATRIX
      ═════════════════════════════════════════════════════════════ */}
      {activeMode === "periodic_matrix" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
          <div className="lg:col-span-7 solo-window p-4 rounded-xl border border-slate-800 bg-[#0A0D14]/90">
            <div className="text-white font-bold text-xs uppercase mb-3 flex items-center gap-2">
              <Atom className="w-4 h-4 text-rose-400" />
              <span>ELEMENTAL PERIODIC MATRIX (KEY CLASS 12 SPECIES)</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
              {PERIODIC_ELEMENTS.map((elem) => {
                const isSelected = inspectedElement.symbol === elem.symbol;
                return (
                  <button
                    key={elem.symbol}
                    onClick={() => {
                      sounds.playClick();
                      setInspectedElement(elem);
                    }}
                    className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center justify-between h-20 ${isSelected
                      ? "border-rose-400 bg-rose-950/50 shadow-[0_0_15px_rgba(244,63,94,0.3)] text-rose-300 font-bold"
                      : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                      }`}
                  >
                    <span className="text-[9px] text-slate-500 self-start">{elem.number}</span>
                    <span className="text-lg font-black">{elem.symbol}</span>
                    <span className="text-[10px] text-slate-400 truncate w-full">{elem.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 solo-window p-6 rounded-xl border border-rose-500/30 bg-rose-950/10 flex flex-col justify-between text-xs">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div>
                  <div className="text-2xl font-black text-white">{inspectedElement.name} ({inspectedElement.symbol})</div>
                  <div className="text-[11px] text-rose-400">{inspectedElement.category} • Atomic #{inspectedElement.number}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-200">{inspectedElement.mass} u</div>
                  <div className="text-[10px] text-slate-400">Atomic Mass</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">ELECTRON CONFIG</div>
                  <div className="text-xs font-bold text-white">{inspectedElement.config}</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">ELECTRONEGATIVITY</div>
                  <div className="text-xs font-bold text-white">{inspectedElement.electronegativity}</div>
                </div>
                <div className="col-span-2 bg-slate-900/80 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">OXIDATION STATES</div>
                  <div className="text-xs font-bold text-amber-300">{inspectedElement.oxidationStates}</div>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                <div className="text-cyan-400 font-bold mb-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> CBSE BOARD EXAM SIGNIFICANCE
                </div>
                {inspectedElement.cbseImportance}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-800 text-center">
              NCERT Chemistry Class 12 Syllabus Alignment
            </div>
          </div>
        </div>
      )}

      {/* ── SYSTEM REACTION LOGS TELEMETRY ── */}
      <div className="mt-8 solo-window p-4 rounded-xl border border-slate-800 bg-[#0A0D14]/95 font-mono">
        <div className="flex items-center justify-between mb-2 text-xs border-b border-slate-800 pb-2">
          <span className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> SYSTEM REACTION TELEMETRY LOGS
          </span>
          <span className="text-[10px] text-slate-500">REAL-TIME HUNTER TERMINAL</span>
        </div>
        <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto custom-scrollbar text-[11px]">
          {reactionLog.map((log) => (
            <div key={log.id} className="flex items-center justify-between text-slate-300 hover:text-white">
              <span className="flex items-center gap-2">
                <span className="text-slate-500">[{log.time}]</span>
                <span>{log.text}</span>
              </span>
              {log.xp > 0 && <span className="text-emerald-400 font-bold">+{log.xp} XP</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
