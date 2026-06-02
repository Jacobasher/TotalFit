Notifications updates:

- Notifications are now automatically created when Recommendation engines produce warnings (protein, calorie, aggressive cut, recomp, stalled cut).
- Plateau detection creates `plateau_warning` notifications for exercises flagged as plateaued.
- Files changed:
  - strength-tracker-part2/src/modules/notifications/NotificationService.ts
  - strength-tracker-part2/src/modules/recommendations/RecommendationService.ts
  - strength-tracker-part2/src/modules/plateau/PlateauService.ts

Next: Add in-app notification bell with unread count and deep links to relevant pages.
