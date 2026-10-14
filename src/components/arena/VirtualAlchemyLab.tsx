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
} from "lucide-react";
import { sounds } from "../audio/soundEffects";

// ─────────────────────────────────────────────────────────────
// DATA TYPES & INTERFACES
// ─────────────────────────────────────────────────────────────

type LabMode = "sandbox" | "flame_test" | "titration" | "salt_detective" | "periodic_matrix";

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
  combustibleGas?: boolean; // Can be ignited with spark lighter
  reactionType: string;
  deltaH: "Exothermic (ΔH < 0)" | "Endothermic (ΔH > 0)" | "Athermal (ΔH ≈ 0)";
  tempShift: number; // In Celsius
  phResult: number;
  cbseNote: string;
  chapter: string;
  bubbles: boolean;
  minTempRequired?: number; // Requires Bunsen burner heating
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
// REACTION ENGINE DATABASE (25+ CBSE & Unreal Chemist reactions)
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
    chapter: "Qualitative Analysis & Solutions",
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
    id: "ethanol_water",
    reactants: ["ethanol", "water"],
    equation: "C₂H₅OH + H₂O → Azeotropic Mixture",
    balancedEquation: "C₂H₅OH(l) + H₂O(l) → Solution",
    observation: "Miscible clear blend forms with slight thermal variation, demonstrating positive deviation at specific fractions.",
    resultColor: "#e0f2fe",
    reactionType: "Azeotrope Precursor / Raoult's Law",
    deltaH: "Endothermic (ΔH > 0)",
    tempShift: -1.2,
    phResult: 7.0,
    cbseNote: "Ethanol-water forms a minimum boiling azeotrope at 95.6% ethanol by volume (b.p. 351.15 K). Cannot be separated by fractional distillation.",
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
// FLAME TEST DATABASE (Unreal Chemist & CBSE Class 12 Qualitative)
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
// PERIODIC TABLE QUICK MATRIX (16 Essential Elements)
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
// REALISTIC ORGANIC RED FLAME COMPONENT (Unreal Chemist Physics)
// ─────────────────────────────────────────────────────────────
interface RealisticFlameProps {
  size?: "sm" | "md" | "lg";
  intensity?: number; // 0 = off, 1 = low, 2 = med, 3 = max
  overrideColor?: string; // custom salt emission color if dipped
  showEmbers?: boolean;
}

const RealisticFlame: React.FC<RealisticFlameProps> = ({
  size = "md",
  intensity = 1,
  overrideColor,
  showEmbers = true,
}) => {
  if (intensity === 0) return null;

  const heightClass = size === "sm" ? "h-16 w-12" : size === "lg" ? "h-48 w-32" : "h-28 w-20";
  const scale = intensity === 1 ? "scale-75" : intensity === 2 ? "scale-100" : "scale-125";
  const isCustomColor = Boolean(overrideColor);

  return (
    <div className={`relative flex flex-col items-center justify-end ${heightClass} ${scale} transition-all duration-300 pointer-events-none select-none my-1`}>
      {/* 1. Deep Ambient Fiery Red Light Halo */}
      <div
        className="absolute bottom-0 w-36 h-36 rounded-full animate-flame-halo blur-2xl pointer-events-none -z-10"
        style={{
          backgroundColor: isCustomColor ? overrideColor : "#ef4444",
          opacity: intensity === 3 ? 0.75 : intensity === 2 ? 0.55 : 0.35,
        }}
      />

      {/* 2. Floating Fire Embers & Dancing Sparks */}
      {showEmbers && intensity >= 2 && (
        <div className="absolute inset-0 flex justify-center pointer-events-none overflow-visible -top-8">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ember1 shadow-[0_0_8px_#f59e0b]" />
          <div className="w-1 h-1 rounded-full bg-red-500 animate-ember2 shadow-[0_0_6px_#ef4444]" />
          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ember3 shadow-[0_0_8px_#ea580c]" />
          <div className="w-1 h-1 rounded-full bg-yellow-200 animate-ember1 delay-300 shadow-[0_0_6px_#fde047]" />
        </div>
      )}

      {/* 3. Outer Roaring Red Fire Mantle (Licking Flame Tongue 1) */}
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

      {/* 4. Secondary Asynchronous Blazing Fire Tongue (Licking Flame Tongue 2) */}
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

      {/* 6. Burner Gas Throat Combustion Anchor */}
      <div className="absolute bottom-0 w-[42%] h-[14%] rounded-b-md bg-gradient-to-t from-red-800/80 via-red-600/70 to-transparent blur-[0.5px]" />
    </div>
  );
};

export default function VirtualAlchemyLab() {
  // Navigation & Subsystem Mode
  const [activeMode, setActiveMode] = useState<LabMode>("sandbox");

  // Chamber State
  const [activeReagents, setActiveReagents] = useState<string[]>([]);
  const [currentVolume, setCurrentVolume] = useState<number>(0); // 0 to 100 mL
  const [doseAmount, setDoseAmount] = useState<number>(25); // 10, 25, 50 mL
  const [temperature, setTemperature] = useState<number>(25); // Room temp 25°C
  const [bunsenHeatLevel, setBunsenHeatLevel] = useState<number>(0); // 0 = off, 1 = low, 2 = medium, 3 = roaring
  const [stirrerRPM, setStirrerRPM] = useState<number>(0); // 0, 400, 800, 1200
  const [simSpeed, setSimSpeed] = useState<number>(1); // 0.5, 1, 2.5
  const [isSparking, setIsSparking] = useState<boolean>(false);
  const [activeReaction, setActiveReaction] = useState<ReactionResult | null>(null);
  const [chamberColor, setChamberColor] = useState<string>("transparent");
  const [reactionLog, setReactionLog] = useState<{ id: string; time: string; text: string; xp: number }[]>([
    { id: "init", time: "00:00", text: "Virtual Alchemy Chamber initialized. Ready for Hunter experimentation.", xp: 0 },
  ]);

  // Flame Test State
  const [selectedFlameElement, setSelectedFlameElement] = useState<FlameTestElement>(FLAME_ELEMENTS[0]);
  const [isWireInFlame, setIsWireInFlame] = useState<boolean>(false);
  const [useCobaltGlass, setUseCobaltGlass] = useState<boolean>(false);

  // Titration State
  const [buretteVolume, setBuretteVolume] = useState<number>(50.0); // 50 mL burette
  const [titrationDelivered, setTitrationDelivered] = useState<number>(0.0);
  const [titrantIndicator, setTitrantIndicator] = useState<"phenolphthalein" | "methyl_orange">("phenolphthalein");
  const [titrationPh, setTitrationPh] = useState<number>(1.0);
  const [isTitratingFlow, setIsTitratingFlow] = useState<boolean>(false);
  const titrationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Salt Detective Mystery Challenge State
  const [mysterySalt, setMysterySalt] = useState<{ name: string; cation: string; anion: string; formula: string }>({
    name: "Lead Nitrate",
    cation: "Pb²⁺ (Lead)",
    anion: "NO₃⁻ (Nitrate)",
    formula: "Pb(NO₃)₂",
  });
  const [detectiveNotes, setDetectiveNotes] = useState<string[]>([]);
  const [selectedCationGuess, setSelectedCationGuess] = useState<string>("");
  const [selectedAnionGuess, setSelectedAnionGuess] = useState<string>("");
  const [detectiveResult, setDetectiveResult] = useState<string | null>(null);

  // Periodic Table Selected Element
  const [inspectedElement, setInspectedElement] = useState<PeriodicElement>(PERIODIC_ELEMENTS[4]); // Na by default

  // ─────────────────────────────────────────────────────────────
  // REACTION EVALUATION ENGINE
  // ─────────────────────────────────────────────────────────────
  const evaluateReaction = useCallback(
    (reagentIds: string[]) => {
      // Find matching reactions
      let match: ReactionResult | null = null;

      for (const rxn of REACTIONS) {
        const hasAll = rxn.reactants.every((r) => reagentIds.includes(r));
        if (hasAll) {
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
        // Simple physical blend
        setActiveReaction(null);
        if (reagentIds.length > 0) {
          const lastReagent = REAGENTS.find((r) => r.id === reagentIds[reagentIds.length - 1]);
          if (lastReagent) {
            setChamberColor(lastReagent.color);
          }
        } else {
          setChamberColor("transparent");
        }
      }
    },
    []
  );

  // Add Reagent Handler
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
        text: `Dosed +${doseAmount}mL ${reagent.name} [${reagent.formula}] into chamber.`,
        xp: 25,
      },
      ...prev.slice(0, 15),
    ]);
  };

  // Purge Flask Handler
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

  // Spark Gas Ignition Handler
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

  // Bunsen Burner Heat Adjust
  const handleBunsenToggle = () => {
    sounds.playFlame();
    const nextLevel = (bunsenHeatLevel + 1) % 4;
    setBunsenHeatLevel(nextLevel);

    const temps = [25, 95, 180, 420];
    setTemperature(temps[nextLevel]);

    setReactionLog((prev) => [
      {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString().slice(3, 8),
        text: `Bunsen Burner set to: ${
          nextLevel === 0 ? "OFF (25°C)" : nextLevel === 1 ? "Gentle Warmth (95°C)" : nextLevel === 2 ? "Oxidizing Flame (180°C)" : "Roaring Blue Blast (420°C)"
        }`,
        xp: 15,
      },
      ...prev.slice(0, 15),
    ]);
  };

  // Magnetic Stirrer Toggle
  const handleStirrerToggle = () => {
    sounds.playClick();
    const rpms = [0, 400, 800, 1200];
    const currentIndex = rpms.indexOf(stirrerRPM);
    const nextRPM = rpms[(currentIndex + 1) % rpms.length];
    setStirrerRPM(nextRPM);
  };

  // Titration Flow Loop
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

          // Calculate pH curve: neutralization endpoint at 20.0 mL delivered
          if (nextDelivered < 18.0) {
            setTitrationPh(+(1.0 + (nextDelivered / 20.0) * 1.5).toFixed(2));
          } else if (nextDelivered >= 18.0 && nextDelivered < 20.0) {
            setTitrationPh(+(2.5 + ((nextDelivered - 18) / 2.0) * 4.5).toFixed(2));
          } else if (nextDelivered >= 20.0 && nextDelivered <= 20.5) {
            // Equivalence sharp surge
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

  // Clean titration interval on unmount
  useEffect(() => {
    return () => {
      if (titrationIntervalRef.current) clearInterval(titrationIntervalRef.current);
    };
  }, []);

  // Reset Titration
  const handleResetTitration = () => {
    sounds.playAlert();
    if (titrationIntervalRef.current) clearInterval(titrationIntervalRef.current);
    setIsTitratingFlow(false);
    setBuretteVolume(50.0);
    setTitrationDelivered(0.0);
    setTitrationPh(1.0);
  };

  // Salt Detective Test Execution
  const runDetectiveTest = (testType: string) => {
    sounds.playClick();
    let note = "";
    if (testType === "flame") {
      note = "Flame Test: Produced a pale livid-blue/greyish flame on platinum wire.";
    } else if (testType === "dil_acid") {
      note = "Dilute H₂SO₄: No brisk effervescence observed (Carbonate, Sulfite absent).";
    } else if (testType === "conc_acid") {
      note = "Conc. H₂SO₄: Brown fumes of NO₂ evolved upon heating with copper turnings (Nitrate suspected!).";
    } else if (testType === "ki_confirm") {
      note = "KI Solution Added: Brilliant golden yellow precipitate of PbI₂ formed instantly (Lead Pb²⁺ confirmed!).";
    } else if (testType === "brown_ring") {
      note = "Brown Ring Test: Distinct brown ring formed at junction of FeSO₄ and conc. H₂SO₄ (Nitrate NO₃⁻ confirmed!).";
    }

    if (!detectiveNotes.includes(note)) {
      setDetectiveNotes((prev) => [...prev, note]);
    }
  };

  // Submit Detective Guess
  const handleDetectiveSubmit = () => {
    if (selectedCationGuess === "Lead (Pb²⁺)" && selectedAnionGuess === "Nitrate (NO₃⁻)") {
      sounds.playLevelUp();
      setDetectiveResult("CORRECT! You identified Lead(II) Nitrate Pb(NO₃)₂. +500 Hunter Chemistry XP Awarded!");
    } else {
      sounds.playAlert();
      setDetectiveResult("INCORRECT ANALYSIS. Re-examine the confirmatory tests and qualitative flow chart.");
    }
  };

  // Dynamic pH Calculation for Chamber
  const calculatedPh = activeReaction ? activeReaction.phResult : activeReagents.length > 0 ? 7.0 : 7.0;

  return (
    <section id="arena-raid-view" className="relative w-full py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── HEADER TITLE & BADGE ── */}
      <div className="relative mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <FlaskConical className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>UNREAL CHEMIST ENGINE • SIMULATION LAB</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_0_25px_rgba(0,255,221,0.3)]">
          VIRTUAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">ALCHEMY LAB</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-mono">
          Interactive chemical apparatus sandbox featuring Bunsen heating, flame spectroscopy, dropwise titration, and CBSE Class 12 board qualitative analysis.
        </p>
      </div>

      {/* ── SUB-MODE NAVIGATION TABS (5 Unreal Chemist Systems) ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 border-b border-slate-800/80 pb-4">
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 border ${
                isActive
                  ? `bg-slate-900 ${tab.border} ${tab.color} shadow-[0_0_15px_rgba(0,255,221,0.2)] font-bold`
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═════════════════════════════════════════════════════════════
          MODE 1: REACTION CHAMBER (CORE UNREAL CHEMIST SANDBOX)
      ═════════════════════════════════════════════════════════════ */}
      {activeMode === "sandbox" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: REAGENT VAULT (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="solo-window p-4 rounded-xl border border-slate-800 bg-[#0A0D14]/90 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-white font-mono text-xs uppercase font-bold tracking-wider">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>CHEMICAL REAGENT VAULT</span>
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
                      className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                        doseAmount === vol ? "bg-emerald-500 text-black font-bold" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      +{vol}mL
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable grid of chemicals */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                {REAGENTS.map((reagent) => {
                  const isPresent = activeReagents.includes(reagent.id);
                  return (
                    <button
                      key={reagent.id}
                      onClick={() => handleAddReagent(reagent)}
                      className={`p-2 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between h-[82px] relative overflow-hidden group ${
                        isPresent
                          ? "border-emerald-400 bg-emerald-950/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                          : `border-slate-800 bg-gradient-to-br ${reagent.bgGradient} hover:border-slate-600`
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">{reagent.category}</span>
                        <div
                          className="w-2.5 h-2.5 rounded-full border border-white/30"
                          style={{ backgroundColor: reagent.color }}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white truncate group-hover:text-emerald-300">
                          {reagent.name}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400 truncate">{reagent.formula}</div>
                      </div>
                      {/* Dosing indicator */}
                      <div className="absolute right-1 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-emerald-400 font-mono">
                        +{doseAmount}mL
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CHAMBER CONTROLS & APPARATUS (Bunsen, Stirrer, pH, Spark) */}
            <div className="solo-window p-4 rounded-xl border border-slate-800 bg-[#0A0D14]/90 flex flex-col gap-3 font-mono text-xs">
              <div className="text-slate-400 uppercase text-[11px] font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-white">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> APPARATUS CONTROL PANEL
                </span>
                <span className="text-slate-500">SPEED: {simSpeed}x</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Bunsen Burner Button */}
                <button
                  onClick={handleBunsenToggle}
                  className={`p-2.5 rounded-lg border flex items-center gap-2 transition-all ${
                    bunsenHeatLevel > 0
                      ? "border-amber-500 bg-amber-950/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] font-bold"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Flame className={`w-4 h-4 ${bunsenHeatLevel > 0 ? "text-amber-400 animate-flame" : ""}`} />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400">BUNSEN HEATER</div>
                    <div className="text-xs">{bunsenHeatLevel === 0 ? "OFF" : bunsenHeatLevel === 1 ? "LOW (95°C)" : bunsenHeatLevel === 2 ? "MED (180°C)" : "MAX (420°C)"}</div>
                  </div>
                </button>

                {/* Magnetic Stirrer */}
                <button
                  onClick={handleStirrerToggle}
                  className={`p-2.5 rounded-lg border flex items-center gap-2 transition-all ${
                    stirrerRPM > 0
                      ? "border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <RotateCcw className={`w-4 h-4 ${stirrerRPM > 0 ? "text-cyan-400 animate-spin" : ""}`} />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400">MAGNETIC STIRRER</div>
                    <div className="text-xs">{stirrerRPM === 0 ? "OFF" : `${stirrerRPM} RPM`}</div>
                  </div>
                </button>

                {/* Spark Igniter */}
                <button
                  onClick={handleSparkIgnite}
                  className="p-2.5 rounded-lg border border-red-500/40 bg-red-950/30 text-red-300 hover:border-red-400 hover:bg-red-900/40 flex items-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4 text-red-400" />
                  <div className="text-left">
                    <div className="text-[10px] text-red-400">GAS SPARK GUN</div>
                    <div className="text-xs">IGNITE HEADSPACE</div>
                  </div>
                </button>

                {/* PURGE FLASK */}
                <button
                  onClick={handlePurgeFlask}
                  className="p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 flex items-center gap-2 transition-all"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400">CLEAN DECONTAMINATE</div>
                    <div className="text-xs font-bold text-emerald-400">PURGE FLASK</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: VIRTUAL FLASK CHAMBER & TELEMETRY (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* FLASK VISUAL APPARATUS */}
            <div className="solo-window p-6 rounded-xl border border-slate-800 bg-[#0A0D14]/95 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
              {/* Headspace Spark Shockwave */}
              {isSparking && (
                <div className="absolute top-12 w-24 h-24 rounded-full bg-amber-400/40 animate-spark-pop pointer-events-none z-30 blur-sm" />
              )}

              {/* Telemetry Status Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono z-20">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-red-400" /> {temperature.toFixed(1)}°C
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-cyan-400" /> pH {calculatedPh.toFixed(1)}
                  </span>
                </div>
                <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-bold">
                  VOL: {currentVolume} / 100 mL
                </div>
              </div>

              {/* Steam Rising FX when Heated */}
              {bunsenHeatLevel > 0 && currentVolume > 0 && (
                <div className="absolute top-10 flex gap-4 pointer-events-none z-10">
                  <div className="w-6 h-12 bg-white/10 rounded-full animate-steam blur-md" />
                  <div className="w-8 h-16 bg-white/15 rounded-full animate-steam blur-lg delay-150" />
                  <div className="w-5 h-10 bg-white/10 rounded-full animate-steam blur-md delay-300" />
                </div>
              )}

              {/* BEAKER / FLASK CONTAINER */}
              <div className="relative w-48 h-64 border-b-4 border-l-4 border-r-4 border-slate-600/80 rounded-b-3xl bg-slate-950/40 backdrop-blur-sm shadow-[inset_0_0_25px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-end mt-4">
                {/* Beaker volumetric graduation marks */}
                <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between py-4 text-[9px] font-mono text-slate-500 pointer-events-none select-none z-10">
                  <span>- 100mL</span>
                  <span>- 75mL</span>
                  <span>- 50mL</span>
                  <span>- 25mL</span>
                </div>

                {/* LIQUID LEVEL */}
                <div
                  className="w-full transition-all duration-700 ease-out relative flex items-center justify-center"
                  style={{
                    height: `${currentVolume}%`,
                    backgroundColor: chamberColor !== "transparent" ? chamberColor : "rgba(30, 41, 59, 0.4)",
                    opacity: currentVolume > 0 ? 0.85 : 0,
                  }}
                >
                  {/* Magnetic Stirrer Vortex */}
                  {stirrerRPM > 0 && currentVolume > 20 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-20 h-20 border-t-2 border-b-2 border-white/40 rounded-full animate-vortex" />
                    </div>
                  )}

                  {/* Gas Bubbles FX */}
                  {activeReaction?.bubbles && (
                    <div className="absolute inset-0 flex justify-around pointer-events-none overflow-hidden">
                      <div className="w-2 h-2 rounded-full bg-white/60 animate-bubble" />
                      <div className="w-3 h-3 rounded-full bg-white/50 animate-bubble delay-100" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bubble delay-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/60 animate-bubble delay-300" />
                    </div>
                  )}

                  {/* Precipitate settling at bottom */}
                  {activeReaction?.precipitate && (
                    <div
                      className="absolute bottom-0 w-full h-4 animate-precipitate-settle border-t border-white/40"
                      style={{ backgroundColor: activeReaction.precipitateColor || "#ffffff" }}
                    />
                  )}
                </div>
              </div>

              {/* REALISTIC BUNSEN BURNER RED FLAME BASE */}
              <div className="flex flex-col items-center mt-1 z-10">
                {bunsenHeatLevel > 0 ? (
                  <RealisticFlame
                    size="sm"
                    intensity={bunsenHeatLevel}
                    showEmbers={true}
                  />
                ) : (
                  <div className="w-16 h-2 bg-slate-800 rounded-full" />
                )}
                <div className="w-20 h-3 bg-slate-900 border border-slate-700 rounded-t" />
              </div>
            </div>

            {/* REACTION INTEL & CBSE CLASS 12 BREAKDOWN */}
            {activeReaction ? (
              <div className="solo-window p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 backdrop-blur-md flex flex-col gap-2 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {activeReaction.reactionType}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300">
                    {activeReaction.deltaH}
                  </span>
                </div>

                <div className="text-sm font-bold text-white tracking-wide bg-slate-900/90 p-2 rounded border border-slate-800">
                  {activeReaction.balancedEquation}
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold">Observation: </span>
                  {activeReaction.observation}
                </div>

                {activeReaction.precipitate && (
                  <div className="text-xs text-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
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
            ) : (
              <div className="solo-window p-4 rounded-xl border border-slate-800 bg-[#0A0D14]/80 text-center py-6 text-slate-500 font-mono text-xs">
                Select reagents from the vault above (e.g. NaCl + AgNO₃ or Phenol + FeCl₃) to trigger reactions and precipitate crystallization.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          MODE 2: FLAME SPECTROSCOPY LAB (UNREAL CHEMIST SIGNATURE)
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
              <div className="flex flex-col gap-2">
                {FLAME_ELEMENTS.map((elem) => (
                  <button
                    key={elem.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedFlameElement(elem);
                    }}
                    className={`p-2.5 rounded-lg border text-left font-mono transition-all flex items-center justify-between ${
                      selectedFlameElement.id === elem.id
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

          {/* Bunsen Burner Flame Stage (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="solo-window p-6 rounded-xl border border-slate-800 bg-[#0A0D14]/95 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
              {/* Cobalt Glass Toggle */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setUseCobaltGlass(!useCobaltGlass);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-2 ${
                    useCobaltGlass
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

              {/* Platinum Wire Loop Thrusting Mechanism */}
              <div className="relative flex flex-col items-center z-15">
                {/* Platinum Wire Loop with sample */}
                <div
                  className={`w-1 h-36 bg-gradient-to-b from-slate-400 to-slate-200 rounded transition-transform duration-500 ease-out flex flex-col items-center justify-end ${
                    isWireInFlame ? "translate-y-8" : "-translate-y-6"
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-slate-300"
                    style={{
                      backgroundColor: isWireInFlame ? selectedFlameElement.flameColorHex : "#cbd5e1",
                    }}
                  />
                </div>

                {/* REALISTIC ROARING RED FLAME STAGE */}
                <div className="my-2">
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

                {/* Bunsen Burner Metal Base */}
                <div className="w-8 h-16 bg-slate-700 border border-slate-600 rounded-t" />
                <div className="w-24 h-4 bg-slate-900 border border-slate-700 rounded-full" />
              </div>

              {/* Test Action Button */}
              <div className="mt-6 z-20">
                <button
                  onClick={() => {
                    sounds.playFlame();
                    setIsWireInFlame(!isWireInFlame);
                  }}
                  className={`px-5 py-2.5 rounded-lg border font-mono text-xs uppercase tracking-wider font-bold transition-all ${
                    isWireInFlame
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
          MODE 3: BURETTE & TITRATION SIMULATOR
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
                    className={`p-2 rounded border text-xs text-left ${
                      titrantIndicator === "phenolphthalein"
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
                    className={`p-2 rounded border text-xs text-left ${
                      titrantIndicator === "methyl_orange"
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
                  className={`p-2.5 rounded font-bold text-xs uppercase transition-all ${
                    isTitratingFlow
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

          {/* Burette & Erlenmeyer Visual Stage (7 cols) */}
          <div className="lg:col-span-7 solo-window p-6 rounded-xl border border-slate-800 bg-[#0A0D14]/95 flex flex-col items-center justify-center relative min-h-[420px]">
            {/* Graduated Burette Tube */}
            <div className="relative w-8 h-56 border-2 border-slate-500 rounded-b bg-slate-900/60 overflow-hidden flex flex-col justify-end">
              <div
                className="w-full bg-cyan-400/50 transition-all duration-300"
                style={{ height: `${(buretteVolume / 50.0) * 100}%` }}
              />
              {/* Graduations */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 text-[8px] text-slate-400 font-mono pointer-events-none px-0.5">
                <span>- 0</span>
                <span>- 10</span>
                <span>- 20</span>
                <span>- 30</span>
                <span>- 40</span>
                <span>- 50</span>
              </div>
            </div>

            {/* Stopcock valve & dripping nozzle */}
            <div className="relative flex flex-col items-center my-1">
              <div className="w-5 h-2 bg-slate-600 rounded" />
              <div className="w-1.5 h-3 bg-slate-400" />
              {/* Falling droplet animation */}
              {isTitratingFlow && (
                <div className="w-2 h-2 rounded-full bg-cyan-300 animate-drop shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}
            </div>

            {/* Conical Erlenmeyer Flask */}
            <div className="relative w-36 h-32 border-b-4 border-l-4 border-r-4 border-slate-500 rounded-b-3xl bg-slate-950/60 backdrop-blur-sm overflow-hidden flex flex-col justify-end">
              <div
                className="w-full transition-all duration-500 ease-out"
                style={{
                  height: "45%",
                  backgroundColor:
                    titrantIndicator === "phenolphthalein"
                      ? titrationPh >= 8.2
                        ? "#ec4899"
                        : "rgba(224, 242, 254, 0.4)"
                      : titrationPh < 3.5
                      ? "#ef4444"
                      : "#eab308",
                  opacity: 0.85,
                }}
              />
            </div>
            <div className="w-40 h-2 bg-slate-800 rounded-full mt-1" />
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          MODE 4: SALT ANALYSIS DETECTIVE (CBSE CLASS 12 SCHEME)
      ═════════════════════════════════════════════════════════════ */}
      {activeMode === "salt_detective" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
          {/* Diagnostic Tests Panel (5 cols) */}
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
                <button
                  onClick={() => runDetectiveTest("flame")}
                  className="p-2 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:border-purple-400 text-left flex items-center justify-between"
                >
                  <span>1. Platinum Wire Flame Test</span>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                </button>
                <button
                  onClick={() => runDetectiveTest("dil_acid")}
                  className="p-2 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:border-purple-400 text-left flex items-center justify-between"
                >
                  <span>2. Dilute H₂SO₄ Anion Group Test</span>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                </button>
                <button
                  onClick={() => runDetectiveTest("conc_acid")}
                  className="p-2 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:border-purple-400 text-left flex items-center justify-between"
                >
                  <span>3. Conc. H₂SO₄ + Copper Turnings Test</span>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                </button>
                <button
                  onClick={() => runDetectiveTest("ki_confirm")}
                  className="p-2 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:border-purple-400 text-left flex items-center justify-between"
                >
                  <span>4. Potassium Iodide (KI) Confirmatory</span>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                </button>
                <button
                  onClick={() => runDetectiveTest("brown_ring")}
                  className="p-2 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:border-purple-400 text-left flex items-center justify-between"
                >
                  <span>5. Ring Test for Nitrate (FeSO₄ + H₂SO₄)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                </button>
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
                {/* Cation Dropdown */}
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

                {/* Anion Dropdown */}
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
                  className={`p-3 rounded-lg border text-xs font-bold ${
                    detectiveResult.startsWith("CORRECT")
                      ? "bg-emerald-950/60 border-emerald-500 text-emerald-300"
                      : "bg-red-950/60 border-red-500 text-red-300"
                  }`}
                >
                  {detectiveResult}
                </div>
              )}
            </div>

            <button
              onClick={handleDetectiveSubmit}
              className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:brightness-110 transition-all"
            >
              SUBMIT SYSTEM IDENTIFICATION
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          MODE 5: PERIODIC ELEMENT MATRIX (INSPECTOR)
      ═════════════════════════════════════════════════════════════ */}
      {activeMode === "periodic_matrix" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
          {/* Grid of Elements (7 cols) */}
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
                    className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center justify-between h-20 ${
                      isSelected
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

          {/* Inspected Element Details Card (5 cols) */}
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

      {/* ── SYSTEM REACTION LOGS TELEMETRY (Persistent at bottom) ── */}
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
