Recommendation engines added:

Files added:
- strength-tracker-part2/src/modules/recommendations/RecommendationService.ts
- strength-tracker-part2/src/modules/recommendations/RecommendationsPage.tsx
- strength-tracker-part2/src/modules/recommendations/index.tsx

Features:
- Protein recommendation: target 0.8g per lb bodyweight; warns if today's protein < target.
- Calorie recommendation: analyzes 21-day weight trend and 4-point strength trend to recommend:
  - Aggressive cut warning (weight loss >1%/week and strength declining)
  - Recomp classification (weight stable and strength increasing)
  - Suggest increasing calories if losing >1%/week
  - Suggest adjustments if cut is stalled

Next steps:
- Tune thresholds and present a timeline/estimated changes.
- Hook recommendations into Notifications module.
