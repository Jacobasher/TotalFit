This folder documents core wiring changes made to the app.

Files modified in workspace:
- strength-tracker-part2/src/core/App.tsx

Purpose:
- Register module routes from `src/modules`.
- Add `QueryClientProvider` for React Query.
- Add a protected Dashboard route using the Auth module's `ProtectedRoute`.

Next steps:
- Add app-wide error boundary, theme provider, and layout components.
- Integrate React Query hooks for services.
