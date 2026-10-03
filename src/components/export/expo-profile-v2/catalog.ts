import { SkillsData, ToolsAnswer, WorkEntry } from "./types";

/** Skills page option lists. Swap for a backend catalogue if you have one. */
export const TRADES = [
  "Electrician",
  "Plumber",
  "Painter",
  "Carpenter",
  "Delivery",
  "Mason",
];

export const SUGGESTIONS: Record<string, string[]> = {
  Electrician: [
    "Electrical wiring",
    "Panel installation",
    "Solar fitting",
    "Appliance repair",
    "CCTV setup",
    "Inverter servicing",
    "Earthing",
  ],
  Plumber: [
    "Pipe fitting",
    "Leak repair",
    "Bathroom fitting",
    "Water tank cleaning",
    "Motor installation",
  ],
  Painter: [
    "Interior painting",
    "Exterior painting",
    "Texture finish",
    "Waterproofing",
    "Wood polish",
  ],
  Carpenter: [
    "Furniture assembly",
    "Door fitting",
    "Modular kitchen",
    "Wood repair",
    "Cabinet making",
  ],
  Delivery: [
    "Two-wheeler",
    "Route planning",
    "Cash handling",
    "Parcel handling",
  ],
  Mason: ["Brickwork", "Plastering", "Tiling", "Concrete work"],
};

export const LANGUAGES = ["Malayalam", "English", "Hindi", "Tamil", "Kannada"];

export const TOOLS: ToolsAnswer[] = ["Yes, full kit", "Some tools", "No"];

export const EMPTY_SKILLS: SkillsData = {
  trade: "",
  years: 0,
  skills: [],
  languages: [],
  tools: "Some tools",
  history: [],
};

export const whenLabel = (w: WorkEntry) =>
  `${w.from || "—"} – ${w.current ? "present" : w.to || "—"}`;

export const yearsLabel = (n: number) => `${n} ${n === 1 ? "yr" : "yrs"}`;
