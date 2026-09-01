import { GradedProp, RawProp } from "@/types/prop";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const round = (value: number, digits = 1) => {
  const p = 10 ** digits;
  return Math.round(value * p) / p;
};

export function gradeProp(prop: RawProp): GradedProp {
  // Weighted baseline: recent form matters most, season form keeps the projection anchored.
  const baseline = prop.last5 * 0.35 + prop.last10 * 0.4 + prop.season * 0.25;

  // Context adjustment is intentionally capped so matchup variables cannot overwhelm actual performance.
  const contextSignal =
    prop.matchupRating * 0.35 +
    prop.roleRating * 0.25 +
    prop.mapPoolRating * 0.25 +
    prop.seriesLengthRating * 0.15;

  const contextMultiplier = 1 + clamp(contextSignal, -0.12, 0.12);
  const projection = baseline * contextMultiplier;
  const edge = projection - prop.line;
  const edgePct = (edge / prop.line) * 100;

  // Confidence is a transparent heuristic for V1. We will replace/tune this with backtested distributions later.
  const normalizedEdge = clamp(edgePct / 18, -1, 1);
  const sampleConfidence = clamp(prop.sampleSize / 25, 0.35, 1);
  const stability = 1 - clamp(prop.volatility, 0, 1);

  const rawProbability =
    0.5 +
    normalizedEdge * 0.18 +
    (sampleConfidence - 0.5) * 0.05 +
    (stability - 0.5) * 0.05;

  const probabilityOver = clamp(rawProbability, 0.25, 0.78);
  const modelScore = clamp(
    Math.round(probabilityOver * 100 + Math.max(0, edgePct) * 0.8 - prop.volatility * 6),
    0,
    100
  );

  let grade: GradedProp["grade"] = "D";
  if (probabilityOver >= 0.68) grade = "A+";
  else if (probabilityOver >= 0.64) grade = "A";
  else if (probabilityOver >= 0.61) grade = "A-";
  else if (probabilityOver >= 0.58) grade = "B+";
  else if (probabilityOver >= 0.55) grade = "B";
  else if (probabilityOver >= 0.5) grade = "C";

  let recommendation: GradedProp["recommendation"] = "PASS";
  if (probabilityOver >= 0.64) recommendation = "OVER";
  else if (probabilityOver >= 0.56) recommendation = "LEAN OVER";
  else if (probabilityOver <= 0.4) recommendation = "UNDER";
  else if (probabilityOver <= 0.46) recommendation = "LEAN UNDER";

  const reasons: string[] = [];
  if (edgePct >= 8) reasons.push("Strong model edge");
  else if (edgePct >= 3) reasons.push("Positive model edge");
  else if (edgePct <= -5) reasons.push("Projection below posted line");

  if (prop.last10 > prop.line * 1.06) reasons.push("Strong L10 form");
  if (prop.matchupRating >= 0.2) reasons.push("Favorable opponent context");
  if (prop.mapPoolRating >= 0.15) reasons.push("Positive map-pool fit");
  if (prop.roleRating >= 0.25) reasons.push("Role supports volume");
  if (prop.seriesLengthRating >= 0.15) reasons.push("Good series-length environment");
  if (prop.volatility >= 0.45) reasons.push("High volatility lowers confidence");
  if (prop.sampleSize < 12) reasons.push("Small sample size");
  if (!reasons.length) reasons.push("No major model signal");

  return {
    ...prop,
    projection: round(projection),
    edge: round(edge),
    edgePct: round(edgePct),
    probabilityOver: round(probabilityOver * 100),
    modelScore,
    grade,
    recommendation,
    reasons,
  };
}
