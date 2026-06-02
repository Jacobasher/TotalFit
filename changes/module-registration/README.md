This folder documents the module registration changes.

Files added in workspace:
- strength-tracker-part2/src/modules/index.ts

Purpose:
- Central registry of available modules so modules can register routes, services and widgets without deep coupling.

Next steps:
- Expand registry to dynamically import modules.
- Add runtime module enable/disable toggles.
