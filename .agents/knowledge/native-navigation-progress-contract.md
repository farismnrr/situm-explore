# Native Situm navigation progress contract

_Last verified: 2026-09-02 against installed `@situm/react-native@3.19.2`._

The published package's source under `mobile/node_modules/@situm/react-native/src/sdk/types/index.ts` exposes the navigation data needed for a navigation-first UI. This is local installed-version evidence, not a guess from prototype copy.

Verified `NavigationProgress` fields used/available to Situm Explore include:

- `distanceToGoal` — remaining meters to the route goal;
- `distanceToEndStep` — remaining meters in the current route step;
- `timeToGoal` — Situm estimate in seconds, documented as based on 1 meter/second;
- `timeToEndStep` — equivalent estimate for the current step;
- `currentIndication` / `currentStepIndex`;
- `nextIndication`;
- `closestLocationInRoute`.

Verified `Indication` fields include:

- `indicationType` string;
- `orientationType` string;
- `neededLevelChange`;
- `distance` / `distanceToNextLevel`;
- orientation angle and step indices.

The current official Android Situm indication enums document action strings including `TURN`, `GO_AHEAD`, `CHANGE_FLOOR`, `PASS_THROUGH`, and `END`, plus orientations such as `STRAIGHT`, `VEER_RIGHT`, `RIGHT`, `SHARP_RIGHT`, `VEER_LEFT`, `LEFT`, `SHARP_LEFT`, and `BACKWARD`. UI mapping should always retain a safe fallback for unknown strings.

The installed MapView ref still exposes `selectPoi`, `deselectPoi`, `selectFloor`, `navigateToPoi`, `cancelNavigation`, `followUser`, and `unfollowUser`. Situm remains the route/map renderer; React Native may safely own the visible search/floor/guidance controls around that surface.

Do not infer route metrics when a progress callback has not supplied them, and do not treat Situm's time estimate as a measured walking speed.
