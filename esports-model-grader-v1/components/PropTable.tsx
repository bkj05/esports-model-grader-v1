"use client";

import { useMemo, useState } from "react";
import { gradeProp } from "@/lib/model";
import { RawProp } from "@/types/prop";

export default function PropTable({ props }: { props: RawProp[] }) {
  const [search, setSearch] = useState("");
  const [propType, setPropType] = useState("ALL");

  const graded = useMemo(() => {
    return props
      .map(gradeProp)
      .filter((p) => {
        const matchesSearch = `${p.player} ${p.team} ${p.opponent}`.toLowerCase().includes(search.toLowerCase());
        const matchesType = propType === "ALL" || p.propType === propType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => b.modelScore - a.modelScore);
  }, [props, search, propType]);

  return (
    <section className="panel">
      <div className="toolbar">
        <input
          aria-label="Search players or teams"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search player, team, opponent..."
        />
        <select aria-label="Filter prop type" value={propType} onChange={(e) => setPropType(e.target.value)}>
          <option value="ALL">All props</option>
          <option value="Kills M1-2">Kills M1-2</option>
          <option value="Headshots M1-2">Headshots M1-2</option>
          <option value="Kills Map 1">Kills Map 1</option>
          <option value="Headshots Map 1">Headshots Map 1</option>
        </select>
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Matchup</th>
              <th>Prop</th>
              <th>Line</th>
              <th>Proj.</th>
              <th>Edge</th>
              <th>Over %</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Call</th>
            </tr>
          </thead>
          <tbody>
            {graded.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.player}</strong>
                  <span>{p.team}</span>
                </td>
                <td>{p.opponent}</td>
                <td>{p.propType}</td>
                <td>{p.line}</td>
                <td><strong>{p.projection}</strong></td>
                <td className={p.edge >= 0 ? "positive" : "negative"}>{p.edge > 0 ? "+" : ""}{p.edge}</td>
                <td>{p.probabilityOver}%</td>
                <td><strong>{p.modelScore}</strong></td>
                <td><span className={`grade grade-${p.grade.replace("+", "plus").replace("-", "minus")}`}>{p.grade}</span></td>
                <td>{p.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cards">
        {graded.slice(0, 3).map((p, index) => (
          <article className="pickCard" key={`card-${p.id}`}>
            <div className="rank">#{index + 1}</div>
            <div>
              <h3>{p.player} — {p.recommendation}</h3>
              <p>{p.propType} {p.line} vs {p.opponent}</p>
              <p className="reason">{p.reasons.slice(0, 3).join(" • ")}</p>
            </div>
            <div className="scoreBox">
              <strong>{p.grade}</strong>
              <span>{p.modelScore}/100</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
