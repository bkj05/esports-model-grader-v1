export type PropType = "Kills M1-2" | "Headshots M1-2" | "Kills Map 1" | "Headshots Map 1";

export type RawProp = {
  id: string;
  player: string;
  team: string;
  opponent: string;
  propType: PropType;
  line: number;
  last5: number;
  last10: number;
  season: number;
  matchupRating: number;      // -1 to +1
  roleRating: number;         // -1 to +1
  mapPoolRating: number;      // -1 to +1
  seriesLengthRating: number; // -1 to +1
  volatility: number;         // 0 to 1; higher = riskier
  sampleSize: number;
};

export type GradedProp = RawProp & {
  projection: number;
  edge: number;
  edgePct: number;
  probabilityOver: number;
  modelScore: number;
  grade: "A+" | "A" | "A-" | "B+" | "B" | "C" | "D";
  recommendation: "OVER" | "LEAN OVER" | "PASS" | "LEAN UNDER" | "UNDER";
  reasons: string[];
};
