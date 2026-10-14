"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FlaskConical,
  Sparkles,
  Sword,
  Scroll,
  Calendar,
  Gamepad2,
  CheckCircle2,
  XCircle,
  Play,
  Shield,
  Zap,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  CheckSquare,
  Square,
  Award,
  Flame,
  Atom,
  Layers,
  FileCheck,
  ExternalLink,
  Copy,
  Check,
  Trophy,
  Dna,
  TestTube,
} from "lucide-react";
import { sounds } from "../audio/soundEffects";

// App & Developer Metadata
export const GAME_METADATA = {
  appName: "Realms of Chemistry",
  appUrl: "https://play.google.com/store/apps/details?id=com.awakenedgames.realmsofchemistry&pcampaignid=web_share",
  packageName: "com.awakenedgames.realmsofchemistry",
  studio: "Awakened Games",
  developer: "Solo Developer Daniel",
  instagramUrl: "https://www.instagram.com/king_daniel_dev?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
  whatsappUrl: "https://wa.me/917904873647",
  youtubeUrl: "https://www.youtube.com/channel/UCdE2eZoDmtrWmg4Ks4SNhmQ",
};

interface ChapterTopic {
  id: string;
  name: string;
  highYield?: boolean;
}

interface ChemistryChapter {
  id: string;
  number: number;
  title: string;
  category: "Physical" | "Inorganic" | "Organic";
  weightageMarks: number;
  realmArc: string;
  bossName: string;
  themeColor: string;
  badgeBg: string;
  summary: string;
  keyFormulas: string[];
  topics: ChapterTopic[];
}

const CBSE_CHEMISTRY_CHAPTERS: ChemistryChapter[] = [
  // Physical Chemistry (23 Marks)
  {
    id: "solutions",
    number: 1,
    title: "Solutions",
    category: "Physical",
    weightageMarks: 7,
    realmArc: "Arc 1: The Liquid Phase Realm",
    bossName: "Raoult & Henry Titan",
    themeColor: "from-cyan-950/60 to-black border-cyan-400/80",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-400/60",
    summary: "Master concentration terms, gas solubility, ideal vs non-ideal positive/negative deviations, colligative properties, and Van't Hoff factor corrections.",
    keyFormulas: [
      "P_total = P°_A*x_A + P°_B*x_B (Raoult's Law)",
      "ΔT_b = i * K_b * m | ΔT_f = i * K_f * m",
      "π = i * C * R * T (Osmotic Pressure)",
      "p = K_H * x (Henry's Law for Gas Solubility)",
    ],
    topics: [
      { id: "sol_1", name: "Types of Solutions & Concentration Units (Molarity, Molality, Mole Fraction)", highYield: true },
      { id: "sol_2", name: "Solubility of Gases in Liquids & Henry's Law Applications", highYield: true },
      { id: "sol_3", name: "Vapour Pressure of Liquid Solutions & Raoult's Law (Ideal & Non-ideal)", highYield: true },
      { id: "sol_4", name: "Positive & Negative Deviations from Raoult's Law & Azeotropic Mixtures", highYield: true },
      { id: "sol_5", name: "Colligative Properties: Relative Lowering of Vapour Pressure", highYield: false },
      { id: "sol_6", name: "Elevation of Boiling Point (Ebullioscopic Constant K_b Calculations)", highYield: true },
      { id: "sol_7", name: "Depression of Freezing Point (Cryoscopic Constant K_f & Anti-freeze)", highYield: true },
      { id: "sol_8", name: "Osmotic Pressure, Reverse Osmosis & Isotonic Solutions", highYield: true },
      { id: "sol_9", name: "Abnormal Molar Masses, Association/Dissociation & Van't Hoff Factor (i)", highYield: true },
    ],
  },
  {
    id: "electrochemistry",
    number: 2,
    title: "Electrochemistry",
    category: "Physical",
    weightageMarks: 9,
    realmArc: "Arc 1: The Ion Dominion",
    bossName: "The Nernst Electro-Dragon",
    themeColor: "from-blue-950/70 to-black border-blue-400/80",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-400/60",
    summary: "Highest weightage physical chapter! Conquering galvanic cells, Nernst equation calculations, Gibbs free energy, Kohlrausch's law, and Faraday's laws.",
    keyFormulas: [
      "E_cell = E°_cell - (0.0591/n) * log(Q) at 298K",
      "ΔG° = -n * F * E°_cell | ΔG° = -2.303 * R * T * log(K_c)",
      "Λ_m = (κ * 1000) / Molar Concentration",
      "Λ°_m(AxBy) = x*λ°_m(A^y+) + y*λ°_m(B^x-) (Kohlrausch)",
      "m = Z * I * t = (E_eq * I * t) / 96500 (Faraday)",
    ],
    topics: [
      { id: "el_1", name: "Galvanic Cells, Daniell Cell & Standard Hydrogen Electrode (SHE)", highYield: true },
      { id: "el_2", name: "Nernst Equation for Electrode Potential & Cell EMF Calculation", highYield: true },
      { id: "el_3", name: "Relationship between E°_cell, Gibbs Free Energy (ΔG°) and Equilibrium Constant (Kc)", highYield: true },
      { id: "el_4", name: "Conductance, Specific Conductivity (κ) and Molar Conductivity (Λm)", highYield: true },
      { id: "el_5", name: "Variation of Conductivity & Molar Conductivity with Dilution (Debye-Huckel)", highYield: true },
      { id: "el_6", name: "Kohlrausch's Law of Independent Migration of Ions & Weak Electrolytes", highYield: true },
      { id: "el_7", name: "Electrolysis & Quantitative Aspects (Faraday's 1st & 2nd Laws)", highYield: true },
      { id: "el_8", name: "Commercial Batteries: Primary (Dry, Mercury) & Secondary (Lead-Acid Storage)", highYield: false },
      { id: "el_9", name: "H2-O2 Fuel Cells & Mechanism of Electrochemical Corrosion (Rusting)", highYield: true },
    ],
  },
  {
    id: "chemical_kinetics",
    number: 3,
    title: "Chemical Kinetics",
    category: "Physical",
    weightageMarks: 7,
    realmArc: "Arc 1: The Chrono-Velocity Nexus",
    bossName: "Arrhenius Chrono-Spectre",
    themeColor: "from-teal-950/60 to-black border-teal-400/80",
    badgeBg: "bg-teal-500/20 text-teal-300 border-teal-400/60",
    summary: "Analyze reaction rates, differential rate laws, zero & first-order integrated rate laws, half-life formulas, activation energy graphs, and collision theory.",
    keyFormulas: [
      "Zero Order: k = ([R]_0 - [R])/t | t_1/2 = [R]_0 / (2k)",
      "First Order: k = (2.303/t) * log([R]_0 / [R]) | t_1/2 = 0.693 / k",
      "Arrhenius: log(k2/k1) = (E_a / 2.303R) * [(T2 - T1) / (T1*T2)]",
      "Rate = k * [A]^x * [B]^y (Overall Order = x + y)",
    ],
    topics: [
      { id: "ck_1", name: "Rate of Reaction (Average & Instantaneous) and Stoichiometric Rate Expressions", highYield: true },
      { id: "ck_2", name: "Factors Affecting Reaction Rate: Concentration, Temperature, Catalyst & Surface Area", highYield: false },
      { id: "ck_3", name: "Rate Law, Specific Rate Constant (k), Order of Reaction vs Molecularity", highYield: true },
      { id: "ck_4", name: "Units of Rate Constant (k = mol^(1-n) L^(n-1) s^-1) for n-th Order", highYield: true },
      { id: "ck_5", name: "Integrated Rate Equation & Linear Graphs for Zero-Order Reactions", highYield: true },
      { id: "ck_6", name: "Integrated Rate Equation & Half-life Calculations for First-Order Reactions", highYield: true },
      { id: "ck_7", name: "Pseudo First-Order Reactions (Hydrolysis of Cane Sugar & Ester Hydrolysis)", highYield: false },
      { id: "ck_8", name: "Temperature Dependence: Arrhenius Equation, Activation Energy (Ea) & Graph Slope", highYield: true },
      { id: "ck_9", name: "Collision Theory of Chemical Reactions (Steric Factor & Effective Collisions)", highYield: false },
    ],
  },

  // Inorganic Chemistry (14 Marks)
  {
    id: "d_and_f_block",
    number: 4,
    title: "The d- and f-Block Elements",
    category: "Inorganic",
    weightageMarks: 7,
    realmArc: "Arc 2: The Transition Metallurgy Spire",
    bossName: "Dichromate Permanganate Golem",
    themeColor: "from-amber-950/60 to-black border-amber-400/80",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-400/60",
    summary: "Periodic trends in 3d series, variable oxidation states, magnetic moments, interstitial alloys, KMnO4 & K2Cr2O7 redox reactions, and Lanthanoid contraction.",
    keyFormulas: [
      "Magnetic Moment: μ = √[n(n+2)] Bohr Magnetons (BM)",
      "K2Cr2O7: Cr2O7^2- + 14H+ + 6e- → 2Cr^3+ + 7H2O",
      "KMnO4 (Acidic): MnO4^- + 8H+ + 5e- → Mn^2+ + 4H2O",
      "Lanthanoid Contraction: 4f electron shielding defect",
    ],
    topics: [
      { id: "df_1", name: "Electronic Configurations & Anomalous 3d Exceptions (Cr: 3d5 4s1, Cu: 3d10 4s1)", highYield: true },
      { id: "df_2", name: "General Trends: Atomic/Ionic Radii, Metallic Character & Enthalpy of Atomization", highYield: true },
      { id: "df_3", name: "Variable Oxidation States & Standard Electrode Potentials (E° M2+/M and M3+/M2+)", highYield: true },
      { id: "df_4", name: "Magnetic Properties (Spin-only formula calculation for d-ions)", highYield: true },
      { id: "df_5", name: "Formation of Coloured Ions (d-d transitions) & Catalytic Properties", highYield: true },
      { id: "df_6", name: "Formation of Interstitial Compounds and Alloy Formation (Brass, Bronze)", highYield: false },
      { id: "df_7", name: "Potassium Dichromate (K2Cr2O7): Preparation from Chromite Ore & Acidic Oxidations", highYield: true },
      { id: "df_8", name: "Potassium Permanganate (KMnO4): Preparation from Pyrolusite Ore & Redox Reactions", highYield: true },
      { id: "df_9", name: "Lanthanoids: Electronic Config, +3 State, Lanthanoid Contraction & Consequences", highYield: true },
      { id: "df_10", name: "Actinoids: Electronic Config, Oxidation States & Comparison with Lanthanoids", highYield: false },
    ],
  },
  {
    id: "coordination_compounds",
    number: 5,
    title: "Coordination Compounds",
    category: "Inorganic",
    weightageMarks: 7,
    realmArc: "Arc 2: The Crystal Field Citadel",
    bossName: "Octahedral Ligand Sovereign",
    themeColor: "from-yellow-950/60 to-black border-yellow-400/80",
    badgeBg: "bg-yellow-500/20 text-yellow-300 border-yellow-400/60",
    summary: "Werner's theory, IUPAC naming of coordination entities, geometric & optical isomerism, Valence Bond Theory hybridization, and Crystal Field Theory (CFT) splitting.",
    keyFormulas: [
      "Octahedral Splitting: Δ_o (t2g^3 eg^0 etc.)",
      "Tetrahedral Splitting: Δ_t = (4/9) * Δ_o",
      "Spectrochemical: I- < Br- < Cl- < F- < OH- < H2O < NH3 < en < CN- < CO",
      "VBT: sp3 (Tetrahedral), dsp2 (Square planar), sp3d2 (Outer), d2sp3 (Inner)",
    ],
    topics: [
      { id: "co_1", name: "Werner's Theory: Primary (Ionizable) vs Secondary (Non-ionizable) Valencies", highYield: true },
      { id: "co_2", name: "Coordination Entity, Central Atom, Ligand Denticity (Monodentate, Bidentate, Ambidentate)", highYield: true },
      { id: "co_3", name: "IUPAC Nomenclature of Mononuclear Coordination Complexes (Rules & Practice)", highYield: true },
      { id: "co_4", name: "Structural Isomerism: Ionization, Solvate/Hydrate, Linkage & Coordination Isomerism", highYield: true },
      { id: "co_5", name: "Stereoisomerism: Geometrical (Cis/Trans, Fac/Mer) & Optical Isomerism (Chirality)", highYield: true },
      { id: "co_6", name: "Valence Bond Theory (VBT): Inner & Outer Orbital Complexes, Hybridization & Magnetic Moment", highYield: true },
      { id: "co_7", name: "Crystal Field Theory (CFT): Crystal Field Splitting in Octahedral & Tetrahedral Complexes", highYield: true },
      { id: "co_8", name: "Spectrochemical Series, Strong-field vs Weak-field Ligands & High/Low Spin States", highYield: true },
      { id: "co_9", name: "Colour in Coordination Compounds & Biological/Industrial Applications (Cisplatin, EDTA)", highYield: true },
    ],
  },

  // Organic Chemistry (33 Marks)
  {
    id: "haloalkanes_haloarenes",
    number: 6,
    title: "Haloalkanes and Haloarenes",
    category: "Organic",
    weightageMarks: 6,
    realmArc: "Arc 3: The Halogen Synthesizer",
    bossName: "Chiral Inversion Shade",
    themeColor: "from-purple-950/60 to-black border-purple-400/80",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-400/60",
    summary: "SN1 vs SN2 nucleophilic substitutions, Walden inversion, Saytzeff elimination rule, Grignard reagents, low reactivity of aryl halides, and Wurtz-Fittig reactions.",
    keyFormulas: [
      "SN2: 1-step, Bimolecular, Inversion, 1° > 2° > 3°",
      "SN1: 2-step via Carbocation, Racemization, 3° > 2° > 1°",
      "Wurtz: 2 R-X + 2Na → R-R + 2NaX",
      "Fittig: 2 Ar-X + 2Na → Ar-Ar + 2NaX",
    ],
    topics: [
      { id: "ha_1", name: "Nomenclature & Nature of C-X Bond (Dipole Moment & Bond Length trends)", highYield: false },
      { id: "ha_2", name: "Preparation of Haloalkanes: from Alcohols (SOCl2, PCl5, PCl3) & Halogen Exchange (Finkelstein, Swarts)", highYield: true },
      { id: "ha_3", name: "Nucleophilic Substitution Mechanisms: SN1 vs SN2 Comparison & Reactivity Orders", highYield: true },
      { id: "ha_4", name: "Stereochemical Aspects: Optical Activity, Chirality, Inversion & Racemization", highYield: true },
      { id: "ha_5", name: "Elimination Reactions (β-elimination, Saytzeff/Zaitsev's Rule vs Hoffman)", highYield: true },
      { id: "ha_6", name: "Reaction with Metals: Organometallic Compounds, Grignard Reagent (R-Mg-X) & Wurtz Reaction", highYield: true },
      { id: "ha_7", name: "Haloarenes: Low Reactivity towards Nucleophilic Substitution (Resonance, Hybridization, Polarity)", highYield: true },
      { id: "ha_8", name: "Electrophilic Substitution in Haloarenes (Halogenation, Nitration, Sulfonation, Friedel-Crafts)", highYield: true },
      { id: "ha_9", name: "Wurtz-Fittig Reaction, Fittig Reaction & Polyhalogen Compounds (Chloroform, Iodoform, DDT, Freons)", highYield: false },
    ],
  },
  {
    id: "alcohols_phenols_ethers",
    number: 7,
    title: "Alcohols, Phenols and Ethers",
    category: "Organic",
    weightageMarks: 6,
    realmArc: "Arc 3: The Hydroxy Resonance Sanctuary",
    bossName: "Reimer-Tiemann Colossus",
    themeColor: "from-pink-950/60 to-black border-pink-400/80",
    badgeBg: "bg-pink-500/20 text-pink-300 border-pink-400/60",
    summary: "Acidic strength of alcohols vs phenols, Lucas test for degree classification, Kolbe's synthesis of salicylic acid, Reimer-Tiemann mechanism, and Williamson synthesis.",
    keyFormulas: [
      "Acidity: Phenol > Water > 1° Alcohol > 2° Alcohol > 3° Alcohol",
      "Lucas Test: conc. HCl + anhyd. ZnCl2 (3° immediate turbidity)",
      "Kolbe: Phenol + NaOH + CO2 + H+ → Salicylic Acid",
      "Reimer-Tiemann: Phenol + CHCl3 + aq. NaOH → Salicylaldehyde",
      "Williamson Ether: R-X + R'-O-Na → R-O-R' + NaX (SN2)",
    ],
    topics: [
      { id: "ape_1", name: "IUPAC Nomenclature & Classification of Alcohols (1°, 2°, 3°) and Phenols", highYield: false },
      { id: "ape_2", name: "Preparation of Alcohols: Hydration of Alkenes, Hydroboration-Oxidation & Grignard Reagent", highYield: true },
      { id: "ape_3", name: "Physical Properties: Boiling Point Trends (Intermolecular H-bonding) & Solubility", highYield: false },
      { id: "ape_4", name: "Acidity of Alcohols & Phenols (Resonance Stabilization of Phenoxide vs Alkoxide)", highYield: true },
      { id: "ape_5", name: "Esterification & Distinguishing Tests (Lucas Reagent, Victor Meyer Test)", highYield: true },
      { id: "ape_6", name: "Dehydration of Alcohols to Alkenes/Ethers & Oxidation (PCC, Cu/573K, KMnO4)", highYield: true },
      { id: "ape_7", name: "Phenol Preparations (from Cumene, Diazonium Salt) & Reactions with Zinc Dust", highYield: true },
      { id: "ape_8", name: "Named Reactions of Phenol: Kolbe's Reaction, Reimer-Tiemann Reaction & Nitration (Picric Acid)", highYield: true },
      { id: "ape_9", name: "Ethers: Williamson Ether Synthesis & Cleavage of C-O Bond with Hydrogen Halides (HI)", highYield: true },
    ],
  },
  {
    id: "aldehydes_ketones_carboxylic",
    number: 8,
    title: "Aldehydes, Ketones and Carboxylic Acids",
    category: "Organic",
    weightageMarks: 8,
    realmArc: "Arc 3: The Carbonyl Monarch Chamber",
    bossName: "Aldol-Cannizzaro Overlord",
    themeColor: "from-fuchsia-950/60 to-black border-fuchsia-400/80",
    badgeBg: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/60",
    summary: "Most critical organic chapter! Mastering nucleophilic addition, Aldol & Cross-Aldol condensation, Cannizzaro disproportionation, Tollens'/Fehling's tests, and HVZ reaction.",
    keyFormulas: [
      "Nucleophilic Addition: >C=O + Nu- → Tetrahedral intermediate",
      "Aldol: 2 CH3CHO + dil. NaOH → CH3-CH(OH)-CH2-CHO → CH3-CH=CH-CHO",
      "Cannizzaro: 2 HCHO + conc. NaOH → CH3OH + HCOONa",
      "Rosenmund: R-COCl + H2 --(Pd-BaSO4)--> R-CHO",
      "Hell-Volhard-Zelinsky (HVZ): R-CH2-COOH + X2/Red P → R-CH(X)-COOH",
    ],
    topics: [
      { id: "akc_1", name: "Nomenclature & Structure of Carbonyl Group (Planar sp2 Hybridized Polarity)", highYield: false },
      { id: "akc_2", name: "Preparation of Aldehydes & Ketones: Rosenmund, Stephen, Etard & Gattermann-Koch", highYield: true },
      { id: "akc_3", name: "Nucleophilic Addition Reactions: Addition of HCN, NaHSO3, Grignard & Alcohols (Acetals)", highYield: true },
      { id: "akc_4", name: "Addition-Elimination with Ammonia Derivatives (Hydroxylamine, 2,4-DNP, Semicarbazide)", highYield: true },
      { id: "akc_5", name: "Reduction Reactions: Clemmensen Reduction (Zn-Hg/HCl) & Wolff-Kishner Reduction (NH2NH2/KOH)", highYield: true },
      { id: "akc_6", name: "Distinguishing Oxidation Tests: Tollens' Silver Mirror Test & Fehling's Copper Test", highYield: true },
      { id: "akc_7", name: "Haloform Reaction & Iodoform Test for Methyl Carbonyls (CH3-C=O and CH3-CH(OH)-)", highYield: true },
      { id: "akc_8", name: "Reactions due to α-Hydrogen: Aldol Condensation, Cross-Aldol Condensation & Cannizzaro Reaction", highYield: true },
      { id: "akc_9", name: "Carboxylic Acids: Preparation, Acidic Strength Factors (-I vs +I effect) & HVZ Reaction", highYield: true },
    ],
  },
  {
    id: "amines",
    number: 9,
    title: "Amines",
    category: "Organic",
    weightageMarks: 6,
    realmArc: "Arc 3: The Diazonium Abyss",
    bossName: "The Hoffmann Amine Phantom",
    themeColor: "from-indigo-950/60 to-black border-indigo-400/80",
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-400/60",
    summary: "Basic character order in gas vs aqueous phase, Gabriel Phthalimide synthesis, Hoffmann Bromamide degradation, Carbylamine test, Hinsberg test, and Diazonium coupling.",
    keyFormulas: [
      "Aqueous Basicity: 2° > 1° > 3° > NH3 (for -CH3) | 2° > 3° > 1° > NH3 (for -C2H5)",
      "Carbylamine Test: R-NH2 + CHCl3 + 3KOH → R-NC (Foul Isocyanide) + 3KCl",
      "Hoffmann Bromamide: R-CONH2 + Br2 + 4KOH → R-NH2 + K2CO3 + 2KBr",
      "Sandmeyer: Ar-N2+Cl- + Cu2Cl2/HCl → Ar-Cl + N2",
      "Coupling: Ar-N2+Cl- + Phenol (alkaline pH) → p-Hydroxyazobenzene (Orange Dye)",
    ],
    topics: [
      { id: "am_1", name: "Classification & IUPAC Nomenclature of Primary (1°), Secondary (2°) and Tertiary (3°) Amines", highYield: false },
      { id: "am_2", name: "Preparation of Amines: Reduction of Nitro/Nitriles, Gabriel Phthalimide & Hoffmann Bromamide", highYield: true },
      { id: "am_3", name: "Basic Character of Amines: Effect of Inductive, Steric & Hydration on Basicity Orders", highYield: true },
      { id: "am_4", name: "Carbylamine Reaction (Isocyanide Test for Primary Amines only)", highYield: true },
      { id: "am_5", name: "Reaction with Nitrous Acid (HNO2) & Distinguishing Aliphatic vs Aromatic Amines", highYield: true },
      { id: "am_6", name: "Hinsberg's Reagent Test (Benzenesulfonyl Chloride) to Separate 1°, 2°, 3° Amines", highYield: true },
      { id: "am_7", name: "Electrophilic Substitution in Aniline: Bromination (2,4,6-tribromoaniline) & Protection with Acetic Anhydride", highYield: true },
      { id: "am_8", name: "Diazonium Salts: Diazotization Reaction (0-5°C) & Stability of Arenediazonium Cations", highYield: true },
      { id: "am_9", name: "Sandmeyer Reaction, Gattermann Reaction & Azo Dye Coupling Reactions with Phenol/Aniline", highYield: true },
    ],
  },
  {
    id: "biomolecules",
    number: 10,
    title: "Biomolecules",
    category: "Organic",
    weightageMarks: 7,
    realmArc: "Arc 3: The Genetic Double Helix",
    bossName: "Glycosidic Peptide Archon",
    themeColor: "from-rose-950/60 to-black border-rose-400/80",
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-400/60",
    summary: "D/L glucose stereochemistry, Haworth cyclic structures, essential/non-essential amino acids, peptide linkages, primary-quaternary protein structure, denaturation, DNA vs RNA.",
    keyFormulas: [
      "Glucose Reactions: HI → n-Hexane | Br2 water → Gluconic acid | HNO3 → Saccharic acid",
      "Zwitterion of Amino Acid: +H3N-CH(R)-COO- at Isoelectric point",
      "Peptide Bond: -CO-NH- formed by condensation",
      "DNA Base Pairing: Adenine = Thymine (2 H-bonds), Guanine ≡ Cytosine (3 H-bonds)",
    ],
    topics: [
      { id: "bm_1", name: "Classification of Carbohydrates: Monosaccharides, Oligosaccharides & Polysaccharides", highYield: false },
      { id: "bm_2", name: "Structure of D-Glucose (Open Chain Evidence, Reactions with HI, Br2 water, HNO3, NH2OH)", highYield: true },
      { id: "bm_3", name: "Cyclic Structure of Glucose (α-D and β-D Glucopyranose Haworth Projections & Anomers)", highYield: true },
      { id: "bm_4", name: "Disaccharides (Sucrose, Maltose, Lactose), Glycosidic Linkage & Invert Sugar Concept", highYield: true },
      { id: "bm_5", name: "Polysaccharides: Starch (Amylose vs Amylopectin) & Cellulose Biological Importance", highYield: false },
      { id: "bm_6", name: "Amino Acids: Classification (Essential vs Non-essential, Acidic/Basic), Zwitterion & Isoelectric Point", highYield: true },
      { id: "bm_7", name: "Proteins: Peptide Bond Formation, Fibrous vs Globular, 1°, 2° (α-Helix & β-Pleated), 3°, 4° Structures", highYield: true },
      { id: "bm_8", name: "Denaturation of Proteins (Loss of 2° and 3° Structure upon Heat/pH Change)", highYield: true },
      { id: "bm_9", name: "Vitamins: Classification (Fat Soluble A,D,E,K vs Water Soluble B,C) & Deficiency Diseases", highYield: false },
      { id: "bm_10", name: "Nucleic Acids: Chemical Composition of DNA vs RNA, Nucleosides vs Nucleotides & Double Helix Model", highYield: true },
    ],
  },
];

interface ChemistryArchivesProps {
  initialSubTab?: "syllabus" | "bosses" | "cheatsheet";
}

export default function ChemistryArchives({ initialSubTab = "syllabus" }: ChemistryArchivesProps = {}) {
  // Release Date: 10.09.2026 (September 10, 2026)
  const releaseDate = new Date("2026-09-10T00:00:00+05:30").getTime();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = releaseDate - new Date().getTime();
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [releaseDate]);

  // Topic Checklist State
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({
    sol_1: true,
    sol_2: true,
    sol_3: true,
    el_1: true,
    el_2: true,
    ck_1: true,
    ck_6: true,
    ha_3: true,
    akc_8: true,
  });

  const [expandedChapterIds, setExpandedChapterIds] = useState<Set<string>>(new Set(["solutions"]));
  const [categoryFilter, setCategoryFilter] = useState<"All" | "Physical" | "Inorganic" | "Organic">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"syllabus" | "bosses" | "cheatsheet">(
    initialSubTab || "syllabus"
  );

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const toggleExpandChapter = (id: string) => {
    sounds.playClick();
    setExpandedChapterIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAllChapters = () => {
    sounds.playClick();
    setExpandedChapterIds(new Set(CBSE_CHEMISTRY_CHAPTERS.map((c) => c.id)));
  };

  const collapseAllChapters = () => {
    sounds.playClick();
    setExpandedChapterIds(new Set());
  };

  const toggleTopic = (topicId: string) => {
    sounds.playClick();
    setCompletedTopics((prev) => {
      const next = { ...prev, [topicId]: !prev[topicId] };
      if (next[topicId]) sounds.playAlert();
      return next;
    });
  };

  const toggleChapterAll = (chapter: ChemistryChapter) => {
    sounds.playClick();
    const allChecked = chapter.topics.every((t) => completedTopics[t.id]);
    setCompletedTopics((prev) => {
      const updated = { ...prev };
      chapter.topics.forEach((t) => {
        updated[t.id] = !allChecked;
      });
      if (!allChecked) sounds.playLevelUp();
      return updated;
    });
  };

  const handleCopyFormula = (formula: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(formula);
    setCopiedFormula(formula);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  // Filtered chapters based on branch and search
  const filteredChapters = useMemo(() => {
    return CBSE_CHEMISTRY_CHAPTERS.filter((chap) => {
      const matchesCategory = categoryFilter === "All" || chap.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        chap.title.toLowerCase().includes(q) ||
        chap.realmArc.toLowerCase().includes(q) ||
        chap.summary.toLowerCase().includes(q) ||
        chap.topics.some((t) => t.name.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  // Progress metrics calculation
  const totalTopicsCount = useMemo(() => {
    return CBSE_CHEMISTRY_CHAPTERS.reduce((acc, c) => acc + c.topics.length, 0);
  }, []);

  const completedTopicsCount = useMemo(() => {
    return Object.values(completedTopics).filter(Boolean).length;
  }, [completedTopics]);

  const syllabusProgressPercent = Math.round((completedTopicsCount / totalTopicsCount) * 100);

  // Boss Battle Mini-Game
  const [bossHp, setBossHp] = useState(18500);
  const maxBossHp = 25000;
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [attackFeedback, setAttackFeedback] = useState<string | null>(null);

  const handleAttackBoss = (idx: number, correct: boolean, exp: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);

    if (correct) {
      sounds.playReaction();
      setBossHp((prev) => Math.max(0, prev - 6500));
      setAttackFeedback(`CRITICAL HIT! -6,500 DMG! ${exp}`);
    } else {
      sounds.playClick();
      setAttackFeedback(`DEFLECTED! 0 DMG. ${exp}`);
    }
  };

  const handleResetBoss = () => {
    sounds.playClick();
    setBossHp(maxBossHp);
    setSelectedAnswer(null);
    setAttackFeedback(null);
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. HERO GAME SHOWCASE WINDOW WITH GOOGLE PLAY STORE CARD */}
      <div className="solo-window solo-bracket rounded-sm overflow-hidden border-2 border-cyan-400 shadow-[0_0_40px_rgba(0,240,255,0.35)]">
        {/* System Header */}
        <div className="solo-header-bar">
          <div className="flex items-center gap-2 font-orbitron text-xs font-black text-cyan-300 tracking-widest uppercase">
            <Gamepad2 className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>[ DUNGEON DOSSIER // REALMS OF CHEMISTRY ]</span>
          </div>
          <span className="text-xs font-mono text-amber-300 font-bold px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/50">
            PRODUCED BY AWAKENED GAMES • SOLO DEVELOPER DANIEL
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-amber-300">
                <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/50 flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  OFFICIAL RELEASE: SEPTEMBER 10, 2026 (10.09.2026)
                </span>
                <span className="text-cyan-400 hidden sm:inline">|</span>
                <span className="text-cyan-300 font-mono text-xs font-bold">
                  CBSE CLASS 12 ALCHEMICAL RPG
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-cyan-100 text-glow-blue tracking-tight">
                REALMS OF CHEMISTRY
              </h2>
              <div className="text-sm sm:text-base font-orbitron font-bold text-purple-300 tracking-wider flex items-center gap-2">
                <Atom className="w-4 h-4 text-purple-400" />
                <span>OFFICIAL PRODUCTION BY AWAKENED GAMES • SOLO DEVELOPER DANIEL</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 font-rajdhani leading-relaxed">
                Step into an awakened Solo Leveling dungeon where CBSE Class 12 formulas are the ultimate combat spells. Slay Previous Year Question bosses, master all 10 chapters with 100% NCERT precision, and dominate the Formula Arena to achieve a guaranteed 95%+ in your board exams.
              </p>

              {/* Countdown timer */}
              <div className="flex flex-wrap items-center gap-3 bg-black/80 p-3.5 rounded border border-cyan-400/60 w-fit shadow-md">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <div className="text-xs font-mono text-slate-200">
                  <span>LAUNCH COUNTDOWN: </span>
                  <span className="font-orbitron font-bold text-cyan-300 text-glow-blue ml-1">
                    {countdown.days}D : {countdown.hours}H : {countdown.minutes}M : {countdown.seconds}S
                  </span>
                </div>
              </div>
            </div>

            {/* Google Play Store Capsule */}
            <div className="solo-window p-6 rounded-sm bg-gradient-to-b from-cyan-950/80 via-black to-black border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.4)] flex flex-col items-center text-center space-y-4 min-w-[290px]">
              <div className="p-3 bg-cyan-950/80 rounded-full border-2 border-cyan-400 shadow-[0_0_20px_#00f0ff]">
                <Gamepad2 className="w-8 h-8 text-cyan-200 animate-bounce" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block tracking-wider">
                  ANDROID PRE-REGISTRATION LIVE
                </span>
                <h4 className="text-lg font-orbitron font-black text-slate-100 mt-0.5">
                  GOOGLE PLAY STORE
                </h4>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                  com.awakenedgames.realmsofchemistry
                </span>
              </div>

              <a
                href={GAME_METADATA.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playLevelUp()}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-orbitron text-xs font-black uppercase tracking-wider rounded-sm shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(0,240,255,0.8)] transition-all flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1.99 1.99 0 0 1-.61-.92L3 21.266V2.734l.609-.92zM15.207 13.414l2.707-2.707a1 1 0 0 0 0-1.414l-2.707-2.707L14.5 7.293l4.207 4.207-4.207 4.207.707.707zM4.908 1.157L14.5 10.749l-1.414 1.414L3.494 2.571a2.008 2.008 0 0 1 1.414-1.414zM14.5 13.251l-9.592 9.592a2.008 2.008 0 0 1-1.414-1.414l9.592-9.592 1.414 1.414z" />
                </svg>
                <span>GET ON GOOGLE PLAY</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <span className="text-[11px] font-mono text-cyan-300 font-bold">
                🎁 Free Day-1 S-Rank Mythic Alchemical Flask
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ARCHIVES SUB-NAVIGATION TABS */}
      <div id="archives-tabs" className="flex flex-wrap items-center gap-2 p-1.5 bg-black/80 rounded-sm border-2 border-cyan-500/40 scroll-mt-24 sm:scroll-mt-28">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("syllabus");
            setTimeout(() => {
              const el = document.getElementById("archives-grimoire") || document.getElementById("archives-tabs");
              if (el) {
                const y = el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - 75;
                window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
              }
            }, 60);
          }}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-sm font-orbitron text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeSubTab === "syllabus"
              ? "bg-cyan-500 text-black shadow-neon-blue font-black"
              : "text-slate-300 hover:text-cyan-200 hover:bg-cyan-950/40"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>CBSE 12th Syllabus Grimoire (10 Chapters)</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("bosses");
            setTimeout(() => {
              const el = document.getElementById("archives-bosses") || document.getElementById("archives-tabs");
              if (el) {
                const y = el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - 75;
                window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
              }
            }, 60);
          }}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-sm font-orbitron text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeSubTab === "bosses"
              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.7)] font-black"
              : "text-slate-300 hover:text-purple-200 hover:bg-purple-950/40"
          }`}
        >
          <Sword className="w-4 h-4" />
          <span>Game Boss Raids & PYQ Simulator</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("cheatsheet");
            setTimeout(() => {
              const el = document.getElementById("archives-cheatsheet") || document.getElementById("archives-tabs");
              if (el) {
                const y = el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - 75;
                window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
              }
            }, 60);
          }}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-sm font-orbitron text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeSubTab === "cheatsheet"
              ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.7)] font-black"
              : "text-slate-300 hover:text-amber-200 hover:bg-amber-950/40"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Formula Engine & High-Yield Keys</span>
        </button>
      </div>

      {/* SUB-TAB 1: CBSE CLASS 12TH CHEMISTRY CHAPTER & TOPIC MASTERY CHECKLIST GRIMOIRE */}
      {activeSubTab === "syllabus" && (
        <div id="archives-grimoire" className="solo-window solo-bracket rounded-sm overflow-hidden border-2 border-cyan-400 space-y-6 scroll-mt-24 sm:scroll-mt-28">
          <div className="solo-header-bar">
            <div className="flex items-center gap-2 font-orbitron text-xs font-black text-cyan-300 tracking-widest uppercase">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>[ CBSE CLASS 12TH CHEMISTRY // CHAPTER & TOPIC GRIMOIRE ]</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50">
                SYLLABUS MASTERY: {syllabusProgressPercent}% ({completedTopicsCount}/{totalTopicsCount} TOPICS)
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header Description & Overall Progress Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-orbitron font-black text-cyan-100">
                  COMPLETE CBSE CLASS 12 SYLLABUS CHECKLIST (70 MARKS THEORY)
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 font-rajdhani mt-1 max-w-2xl leading-relaxed">
                  Track your board revision topic-by-topic across all 10 NCERT chapters. Check off concepts as you complete them, revise high-yield formula keys, and raid previous year questions in &apos;Realms of Chemistry&apos;.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-cyan-950/80 border border-cyan-400/60 px-4 py-2.5 rounded text-xs font-mono">
                <span className="text-cyan-300 font-bold">BOARD THEORY: 70 MARKS</span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-300 font-bold">PRACTICALS: 30 MARKS</span>
              </div>
            </div>

            {/* Master Progress Bar */}
            <div className="space-y-2 bg-black/80 p-4 rounded border border-cyan-500/40">
              <div className="flex items-center justify-between text-xs font-orbitron">
                <span className="text-cyan-300 flex items-center gap-1.5 font-bold">
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                  <span>OVERALL HUNTER PREPARATION SYNC</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">{syllabusProgressPercent}% READY FOR BOARDS</span>
              </div>
              <div className="w-full h-3.5 bg-black border border-cyan-500/50 rounded-sm p-0.5 overflow-hidden">
                <div
                  className="h-full mana-bar-fill rounded-sm transition-all duration-500"
                  style={{ width: `${syllabusProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Filter Bar & Search Box & Expand All / Collapse All */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {[
                  { label: "All Chapters (10)", val: "All", color: "bg-cyan-500 text-black" },
                  { label: "Physical (23 Marks)", val: "Physical", color: "bg-cyan-600 text-white" },
                  { label: "Inorganic (14 Marks)", val: "Inorganic", color: "bg-amber-600 text-white" },
                  { label: "Organic (33 Marks)", val: "Organic", color: "bg-purple-600 text-white" },
                ].map((filter) => (
                  <button
                    key={filter.val}
                    onClick={() => {
                      sounds.playClick();
                      setCategoryFilter(filter.val as "All" | "Physical" | "Inorganic" | "Organic");
                    }}
                    className={`px-3 py-1.5 rounded-sm font-orbitron text-xs font-bold transition-all uppercase whitespace-nowrap ${
                      categoryFilter === filter.val
                        ? `${filter.color} shadow-neon-blue font-black`
                        : "bg-black/70 text-slate-300 hover:text-cyan-200 border border-slate-700"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Expand All / Collapse All & Search Input */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={expandAllChapters}
                    className="px-2.5 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 font-orbitron text-[10px] font-bold rounded uppercase whitespace-nowrap"
                    title="Expand all 10 chapters simultaneously"
                  >
                    EXPAND ALL
                  </button>
                  <button
                    onClick={collapseAllChapters}
                    className="px-2.5 py-1.5 bg-black/80 hover:bg-slate-900 border border-slate-700 text-slate-300 font-orbitron text-[10px] font-bold rounded uppercase whitespace-nowrap"
                    title="Collapse all chapters"
                  >
                    COLLAPSE ALL
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search topic, formula..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/80 border border-cyan-500/40 rounded px-3 pl-9 py-1.5 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400 font-rajdhani"
                  />
                </div>
              </div>
            </div>

            {/* Chapter Accordion List */}
            <div className="space-y-4">
              {filteredChapters.map((chapter) => {
                const isExpanded = expandedChapterIds.has(chapter.id);
                const chapterCompletedCount = chapter.topics.filter((t) => completedTopics[t.id]).length;
                const chapterTotalCount = chapter.topics.length;
                const chapterProgress = Math.round((chapterCompletedCount / chapterTotalCount) * 100);
                const isAllDone = chapterCompletedCount === chapterTotalCount;

                return (
                  <div
                    key={chapter.id}
                    className={`solo-window solo-bracket rounded-sm overflow-hidden border-2 transition-all ${
                      isAllDone
                        ? "border-emerald-500 bg-emerald-950/20"
                        : isExpanded
                        ? "border-cyan-400 bg-cyan-950/30 shadow-[0_0_25px_rgba(0,240,255,0.3)]"
                        : "border-slate-800 bg-black/80 hover:border-cyan-500/50"
                    }`}
                  >
                    {/* Accordion Header */}
                    <div
                      onClick={() => toggleExpandChapter(chapter.id)}
                      className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none transition-colors"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded flex items-center justify-center font-orbitron font-black text-sm border-2 ${
                            isAllDone
                              ? "bg-emerald-950 border-emerald-400 text-emerald-300"
                              : "bg-cyan-950/90 border-cyan-400 text-cyan-200"
                          }`}
                        >
                          {chapter.number < 10 ? `0${chapter.number}` : chapter.number}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-orbitron text-sm sm:text-base font-bold text-slate-100 truncate">
                              {chapter.title}
                            </h4>
                            <span className={`text-[10px] font-orbitron font-bold px-2 py-0.5 rounded border uppercase ${chapter.badgeBg}`}>
                              {chapter.category} • {chapter.weightageMarks} MARKS
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-slate-300 flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="text-cyan-300 font-semibold">{chapter.realmArc}</span>
                            <span>•</span>
                            <span>Boss: {chapter.bossName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex flex-col items-end font-mono text-xs">
                          <span className={isAllDone ? "text-emerald-400 font-bold" : "text-cyan-300 font-bold"}>
                            {chapterCompletedCount} / {chapterTotalCount} Topics ({chapterProgress}%)
                          </span>
                          <div className="w-28 h-2 bg-black rounded-full overflow-hidden border border-slate-700 mt-1">
                            <div
                              className={`h-full ${isAllDone ? "bg-emerald-400" : "bg-cyan-400"}`}
                              style={{ width: `${chapterProgress}%` }}
                            />
                          </div>
                        </div>

                        <div className="p-1 text-slate-300 hover:text-cyan-300">
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Accordion Content */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 border-t border-cyan-500/30 bg-black/90 space-y-5 animate-fadeIn">
                        <p className="text-xs sm:text-sm text-slate-200 font-rajdhani leading-relaxed">
                          {chapter.summary}
                        </p>

                        {/* Key Formulas / Mechanisms Box */}
                        <div className="space-y-2 p-4 bg-cyan-950/40 border border-cyan-500/40 rounded text-xs font-mono">
                          <div className="text-[11px] font-orbitron font-bold text-cyan-300 flex items-center gap-1.5 uppercase">
                            <Flame className="w-4 h-4 text-cyan-400" />
                            <span>CORE FORMULAS & HIGH-YIELD KEYS:</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-slate-100">
                            {chapter.keyFormulas.map((f, i) => (
                              <div key={i} className="p-2 bg-black/80 rounded border border-cyan-500/30 text-xs flex items-center justify-between gap-2">
                                <span>• {f}</span>
                                <button
                                  onClick={() => handleCopyFormula(f)}
                                  className="text-slate-400 hover:text-cyan-300 shrink-0 p-1"
                                  title="Copy formula"
                                >
                                  {copiedFormula === f ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Topic Checklist Items */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between pb-1">
                            <span className="text-xs font-orbitron font-bold text-slate-200 uppercase tracking-wider">
                              CHAPTER SYLLABUS TOPICS:
                            </span>
                            <button
                              onClick={() => toggleChapterAll(chapter)}
                              className="text-xs font-mono text-cyan-300 hover:text-cyan-200 underline font-bold"
                            >
                              {isAllDone ? "Uncheck All Topics" : "Check All Topics (Mark Complete)"}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            {chapter.topics.map((topic) => {
                              const isDone = !!completedTopics[topic.id];
                              return (
                                <div
                                  key={topic.id}
                                  onClick={() => toggleTopic(topic.id)}
                                  className={`p-3 rounded border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                    isDone
                                      ? "bg-emerald-950/40 border-emerald-500/70 text-emerald-100"
                                      : "bg-black/70 hover:bg-cyan-950/40 border-slate-700 text-slate-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {isDone ? (
                                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-500 shrink-0" />
                                    )}
                                    <span className={`text-xs sm:text-sm font-rajdhani font-semibold ${isDone ? "line-through opacity-80" : ""}`}>
                                      {topic.name}
                                    </span>
                                  </div>

                                  {topic.highYield && (
                                    <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/60 text-rose-300 shrink-0">
                                      HIGH YIELD
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Game Raid Quick Action */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                          <span className="text-xs font-mono text-slate-300">
                            Mastered this chapter? Battle <span className="text-cyan-300 font-bold">{chapter.bossName}</span> in &apos;Realms of Chemistry&apos;.
                          </span>
                          <a
                            href={GAME_METADATA.appUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => sounds.playAlert()}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron text-xs font-bold rounded flex items-center gap-2 shadow-neon-blue uppercase transition-all"
                          >
                            <Sword className="w-3.5 h-3.5" />
                            <span>RAID {chapter.title.toUpperCase()} IN GAME</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GAME BOSS RAIDS & COMBAT ENGINE */}
      {activeSubTab === "bosses" && (
        <div id="archives-bosses" className="space-y-6 scroll-mt-24 sm:scroll-mt-28">
          {/* Boss Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "The Nernst Electro-Dragon",
                arc: "Arc 1: Electrochemistry (9 Marks)",
                difficulty: "S-RANK",
                color: "border-cyan-400 bg-cyan-950/30 text-cyan-300",
                weakness: "Cell Potential (E°_cell) & Reaction Quotient (Q)",
              },
              {
                name: "Aldol-Cannizzaro Overlord",
                arc: "Arc 3: Carbonyls (8 Marks)",
                difficulty: "S-RANK",
                color: "border-purple-400 bg-purple-950/30 text-purple-300",
                weakness: "α-Hydrogen Enolates & Hydride Shifts",
              },
              {
                name: "Octahedral Ligand Sovereign",
                arc: "Arc 2: Coordination (7 Marks)",
                difficulty: "A-RANK",
                color: "border-amber-400 bg-amber-950/30 text-amber-300",
                weakness: "Crystal Field Splitting (Δo) & Spectrochemical",
              },
              {
                name: "Dichromate Golem",
                arc: "Arc 2: d- & f-Block (7 Marks)",
                difficulty: "A-RANK",
                color: "border-rose-400 bg-rose-950/30 text-rose-300",
                weakness: "Acidic Redox Half-Reactions & 6e- Transfer",
              },
            ].map((b, i) => (
              <div key={i} className={`solo-window p-5 rounded border-2 ${b.color} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-rose-400">
                    {b.difficulty}
                  </span>
                  <Sword className="w-4 h-4" />
                </div>
                <h4 className="font-orbitron font-bold text-sm text-slate-100">{b.name}</h4>
                <div className="text-[11px] font-mono text-slate-300">{b.arc}</div>
                <div className="text-[10px] text-slate-400 font-rajdhani pt-1 border-t border-slate-800">
                  Weakness: {b.weakness}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Boss Battle Simulator */}
          <div className="solo-window solo-bracket rounded-sm overflow-hidden border-2 border-cyan-400">
            <div className="solo-header-bar">
              <div className="flex items-center gap-2 font-orbitron text-xs font-bold text-cyan-300">
                <Sword className="w-4 h-4 text-cyan-400" />
                <span>[ LIVE BOSS RAID PREVIEW // THE NERNST ELECTRO-DRAGON ]</span>
              </div>
              <span className="text-xs font-mono text-rose-400 font-bold">RAID DIFFICULTY: S-RANK</span>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              {/* Boss Status Bar */}
              <div className="space-y-2 bg-black/80 p-4 rounded border border-rose-500/50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs sm:text-sm font-orbitron font-bold text-rose-400">
                      BOSS: THE NERNST ELECTRO-DRAGON (ELECTROCHEMISTRY 9 MARKS)
                    </span>
                    <div className="text-[11px] text-slate-300 font-mono">
                      Weakness: Cell Potential (E°_cell) & Reaction Quotient (Q)
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs text-rose-300 font-bold">{bossHp} / {maxBossHp} HP</span>
                  </div>
                </div>

                <div className="w-full h-3.5 bg-slate-950 rounded-sm overflow-hidden border border-rose-900 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 transition-all duration-500 rounded-sm shadow-[0_0_12px_#ff2156]"
                    style={{ width: `${(bossHp / maxBossHp) * 100}%` }}
                  />
                </div>
              </div>

              {/* PYQ Question Card */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center justify-between">
                  <span>[ RAID PHASE 1: CBSE CLASS 12 PYQ COMBAT SPELL ]</span>
                  <span className="text-amber-300 font-mono">3 MARKS PYQ</span>
                </div>
                <p className="text-sm font-rajdhani font-semibold text-slate-100 bg-black/80 p-4 rounded border border-cyan-500/40 leading-relaxed">
                  &ldquo;For the electrochemical cell reaction: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), which mathematical formula correctly calculates the cell electromotive force (E_cell) under non-standard concentrations at 298 Kelvin?&rdquo;
                </p>

                {/* Spell Choices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      text: "E_cell = E°_cell - (0.0591 / 2) log [Zn²⁺]/[Cu²⁺]",
                      correct: true,
                      exp: "Accurate Nernst equation for 2-electron transfer (n=2) with Q = [Zn²⁺]/[Cu²⁺].",
                    },
                    {
                      text: "E_cell = E°_cell + (0.0591 / 1) log [Cu²⁺]/[Zn²⁺]",
                      correct: false,
                      exp: "Incorrect: n=2 for zinc-copper displacement, and sign convention is negative.",
                    },
                    {
                      text: "E_cell = E°_cell - (8.314 / 2) ln [Cu²⁺]/[Zn²⁺]",
                      correct: false,
                      exp: "Incorrect formula units and reactant/product orientation.",
                    },
                    {
                      text: "E_cell = E°_cell × log [Zn²⁺]/[Cu²⁺]",
                      correct: false,
                      exp: "Incorrect: Multiplicative factor without gas constant or Faraday constant.",
                    },
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAttackBoss(idx, opt.correct, opt.exp)}
                      disabled={selectedAnswer !== null}
                      className={`p-3.5 rounded border text-left font-mono text-xs transition-all flex items-center justify-between ${
                        selectedAnswer === null
                          ? "bg-black/70 hover:bg-cyan-950/50 border-cyan-500/40 text-slate-200"
                          : opt.correct
                          ? "bg-emerald-950/70 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                          : idx === selectedAnswer
                          ? "bg-rose-950/70 border-rose-400 text-rose-200"
                          : "opacity-40 bg-black/40 border-slate-800 text-slate-500"
                      }`}
                    >
                      <span>{opt.text}</span>
                      {selectedAnswer !== null && opt.correct && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Combat Feedback */}
                {attackFeedback && (
                  <div className="p-3.5 bg-cyan-950/50 border border-cyan-400 rounded text-xs font-mono text-cyan-300 flex items-center justify-between animate-fadeIn">
                    <span>{attackFeedback}</span>
                    <button
                      onClick={handleResetBoss}
                      className="px-3 py-1 bg-cyan-800 hover:bg-cyan-700 text-white rounded uppercase text-[10px]"
                    >
                      RETRY BOSS
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: FORMULA MATRIX & BOARD CHEAT ENGINE */}
      {activeSubTab === "cheatsheet" && (
        <div id="archives-cheatsheet" className="solo-window solo-bracket rounded-sm overflow-hidden border-2 border-amber-400 space-y-6 scroll-mt-24 sm:scroll-mt-28">
          <div className="solo-header-bar">
            <div className="flex items-center gap-2 font-orbitron text-xs font-bold text-amber-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>[ FORMULA MATRIX // HIGH-YIELD BOARD CHEAT ENGINE ]</span>
            </div>
            <span className="text-xs font-mono text-amber-300 font-bold">100% NCERT VERIFIED</span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Physical Chemistry */}
              <div className="solo-window p-4 rounded border border-cyan-400 space-y-3 bg-cyan-950/20">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                  <span className="font-orbitron text-xs font-bold text-cyan-300">PHYSICAL (23 MARKS)</span>
                  <span className="text-[10px] font-mono text-cyan-400">3 CHAPTERS</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-200">
                  <div className="p-2 bg-black/70 rounded border border-cyan-500/20">
                    <span className="text-cyan-400 block font-bold">Nernst EMF:</span>
                    E = E° - (0.0591/n) log Q
                  </div>
                  <div className="p-2 bg-black/70 rounded border border-cyan-500/20">
                    <span className="text-cyan-400 block font-bold">Osmotic Pressure:</span>
                    π = i * C * R * T
                  </div>
                  <div className="p-2 bg-black/70 rounded border border-cyan-500/20">
                    <span className="text-cyan-400 block font-bold">First Order Rate:</span>
                    k = (2.303/t) log([R]₀/[R])
                  </div>
                  <div className="p-2 bg-black/70 rounded border border-cyan-500/20">
                    <span className="text-cyan-400 block font-bold">Arrhenius Slope:</span>
                    slope = -Ea / (2.303 R)
                  </div>
                </div>
              </div>

              {/* Inorganic Chemistry */}
              <div className="solo-window p-4 rounded border border-amber-400 space-y-3 bg-amber-950/20">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                  <span className="font-orbitron text-xs font-bold text-amber-300">INORGANIC (14 MARKS)</span>
                  <span className="text-[10px] font-mono text-amber-400">2 CHAPTERS</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-200">
                  <div className="p-2 bg-black/70 rounded border border-amber-500/20">
                    <span className="text-amber-400 block font-bold">Magnetic Moment:</span>
                    μ = √[n(n+2)] BM
                  </div>
                  <div className="p-2 bg-black/70 rounded border border-amber-500/20">
                    <span className="text-amber-400 block font-bold">Tetrahedral Splitting:</span>
                    Δt = (4/9) Δo
                  </div>
                  <div className="p-2 bg-black/70 rounded border border-amber-500/20">
                    <span className="text-amber-400 block font-bold">KMnO₄ Redox (Acidic):</span>
                    MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺
                  </div>
                  <div className="p-2 bg-black/70 rounded border border-amber-500/20">
                    <span className="text-amber-400 block font-bold">VBT Geometry:</span>
                    [Ni(CN)₄]²⁻ = dsp² (Square planar)
                  </div>
                </div>
              </div>

              {/* Organic Chemistry */}
              <div className="solo-window p-4 rounded border border-purple-400 space-y-3 bg-purple-950/20">
                <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
                  <span className="font-orbitron text-xs font-bold text-purple-300">ORGANIC (33 MARKS)</span>
                  <span className="text-[10px] font-mono text-purple-400">5 CHAPTERS</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-200">
                  <div className="p-2 bg-black/70 rounded border border-purple-500/20">
                    <span className="text-purple-400 block font-bold">Aldol Condensation:</span>
                    2 R-CHO (dil NaOH) → β-hydroxy aldehyde
                  </div>
                  <div className="p-2 bg-black/70 rounded border border-purple-500/20">
                    <span className="text-purple-400 block font-bold">Lucas Test Reagent:</span>
                    conc. HCl + anhyd. ZnCl₂ (3° instant)
                  </div>
                  <div className="p-2 bg-black/70 rounded border border-purple-500/20">
                    <span className="text-purple-400 block font-bold">Hoffmann Bromamide:</span>
                    R-CONH₂ + Br₂ + 4KOH → R-NH₂
                  </div>
                  <div className="p-2 bg-black/70 rounded border border-purple-500/20">
                    <span className="text-purple-400 block font-bold">Reimer-Tiemann:</span>
                    Phenol + CHCl₃ + NaOH → Salicylaldehyde
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. OFFICIAL LAUNCH PATCH NOTES & DEVELOPER CREDITS */}
      <div className="solo-window solo-bracket rounded-sm overflow-hidden border-2 border-cyan-500/50">
        <div className="solo-header-bar">
          <div className="font-orbitron text-xs font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
            <Scroll className="w-4 h-4 text-cyan-400" />
            <span>[ OFFICIAL LAUNCH PATCH NOTES // BUILD v1.0.0 ]</span>
          </div>
          <span className="text-xs font-mono text-cyan-400">RELEASE: 10.09.2026</span>
        </div>

        <div className="p-6 space-y-3 text-xs font-rajdhani">
          <div className="p-4 bg-black/70 rounded border border-cyan-500/30 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 font-orbitron text-sm font-bold text-slate-100">
              <span>REALMS OF CHEMISTRY BUILD 1.0.0 (ALL 10 NCERT CHAPTERS)</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">PRODUCED BY AWAKENED GAMES • SOLO DEVELOPER DANIEL</span>
            </div>
            <div className="text-slate-200 space-y-1.5 leading-relaxed">
              <div>✓ Over 250+ Verified CBSE Class 12 Previous Year Questions integrated into combat boss encounters.</div>
              <div>✓ Complete Chapter Modules: Solutions (7M), Electrochemistry (9M), Kinetics (7M), d- & f-Block (7M), Coordination (7M), Haloalkanes (6M), Alcohols (6M), Aldehydes & Ketones (8M), Amines (6M), Biomolecules (7M).</div>
              <div>✓ Real-time formula balancing PvP arena with State & National Ranker leaderboards.</div>
              <div>✓ Cloud-save synchronization with Google Play Store: <a href={GAME_METADATA.appUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-mono">{GAME_METADATA.packageName}</a>.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
