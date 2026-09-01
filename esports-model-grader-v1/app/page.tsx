import PropTable from "@/components/PropTable";
import { sampleProps } from "@/data/sampleProps";

export default function Home() {
  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">CS2 • MODEL GRADER V1</p>
          <h1>Find the strongest esports prop edges.</h1>
          <p className="subhead">
            Projection, edge, confidence, matchup context and an explainable model grade in one board.
          </p>
        </div>
        <div className="heroStat">
          <span>Props analyzed</span>
          <strong>{sampleProps.length}</strong>
        </div>
      </header>

      <div className="metrics">
        <div><span>Game</span><strong>CS2</strong></div>
        <div><span>Model</span><strong>Heuristic V1</strong></div>
        <div><span>Markets</span><strong>Kills + HS</strong></div>
        <div><span>Next</span><strong>Backtesting</strong></div>
      </div>

      <PropTable props={sampleProps} />
    </main>
  );
}
