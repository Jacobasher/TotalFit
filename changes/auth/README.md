This folder groups changes related to the Auth module added to the workspace.

Files added in workspace:
- strength-tracker-part2/src/modules/auth/LoginPage.tsx
- strength-tracker-part2/src/modules/auth/RegisterPage.tsx
- strength-tracker-part2/src/modules/auth/ForgotPasswordPage.tsx
- strength-tracker-part2/src/modules/auth/ProtectedRoute.tsx
- strength-tracker-part2/src/modules/auth/index.ts

Purpose:
- Provide sign up / sign in / password reset UI.
- Create profile row on signup.
- Expose `module` object with `routes`, `services` and `components` for registration.

Next steps:
- Add styling and mobile-first layouts.
- Replace inline navigation with app-wide auth state/context if desired.
