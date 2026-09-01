# Esports Model Grader V1

A from-scratch CS2 prop grading prototype built with Next.js + TypeScript.

## What V1 includes

- CS2 prop board
- Kills / headshots markets
- Weighted projection from L5, L10 and season average
- Matchup, role, map pool and series-length adjustments
- Edge and edge percentage
- Estimated Over probability
- 0-100 model score
- A+ through D grade
- Explainable reasons for each pick
- Search + prop-type filtering
- Top-3 ranked picks
- POST `/api/grade` endpoint

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Important

The probability formula in V1 is a transparent heuristic, not yet a trained or backtested betting model. The next major step is building a historical CS2 dataset and evaluating whether each signal actually improves prediction accuracy.

## Suggested V2 roadmap

1. PostgreSQL database
2. Historical player/map stats ingestion
3. Match schedule + opponent data
4. Prop-line ingestion
5. Backtesting engine
6. Calibrated probability model
7. Line movement tracking
8. Pick builder with same-team / same-match constraints
9. User accounts and saved picks
10. Valorant support
