import { NextRequest, NextResponse } from "next/server";
import { gradeProp } from "@/lib/model";
import { RawProp } from "@/types/prop";

export async function POST(request: NextRequest) {
  try {
    const prop = (await request.json()) as RawProp;
    const required = [
      "id", "player", "team", "opponent", "propType", "line", "last5", "last10", "season",
      "matchupRating", "roleRating", "mapPoolRating", "seriesLengthRating", "volatility", "sampleSize"
    ];
    const missing = required.filter((key) => !(key in prop));

    if (missing.length) {
      return NextResponse.json({ error: `Missing fields: ${missing.join(", ")}` }, { status: 400 });
    }

    const numericFields = [
      "line", "last5", "last10", "season", "matchupRating", "roleRating",
      "mapPoolRating", "seriesLengthRating", "volatility", "sampleSize"
    ] as const;

    if (numericFields.some((key) => !Number.isFinite(prop[key]))) {
      return NextResponse.json({ error: "All model inputs must be finite numbers" }, { status: 400 });
    }

    if (prop.line <= 0) {
      return NextResponse.json({ error: "Line must be greater than 0" }, { status: 400 });
    }

    return NextResponse.json(gradeProp(prop));
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
