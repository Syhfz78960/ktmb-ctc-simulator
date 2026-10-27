# KTMB CTC Simulator — playable prototype

A local, dependency-free browser game prototype for practising basic route setting and station interlocking. The current build focuses on one fictional Southern Region station layout, Gemas Junction, with two approaches, one junction, two platforms, a detected turnout, absolute-block-inspired authority, moving trains, route locking and an event log.

## Run locally

Python 3 is sufficient to serve the static files:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000> in a modern browser. The simulation has no backend or network requirements. The page imports a Google font if a connection is available; system fonts are used otherwise.

Run the signalling rule tests with Node.js 18 or later:

```sh
npm test
```

## Play

1. Choose the Training or Timetable scenario.
2. Select an origin and destination, then set the points to match (P1 is normal; P2 is reverse).
3. Request the route. The signal clears only when the interlocking accepts the complete request.
4. Watch the train travel under its authority, arrive, and release the route. Pause, change speed, or restart at any time.
5. Timetable mode adds a second train from the opposite approach to demonstrate route conflicts.

## Model and assumptions

- Track geometry, jurisdiction, station, services, distances, signal IDs, and operational rules are invented for this educational game. They are not a representation of KTMB's current network or installations.
- The interlocking is a simplified RRI-inspired game model. A route needs clear detected sections, correctly positioned and detected points, a free block authority, and no conflicting locked route. Route locking protects the points until route release.
- The block display uses an absolute-block-inspired single-authority rule. Token exchange, tokenless block, real signal transitions, overlaps, and real operational recovery procedures are not implemented in this phase.
- Detection can be configured in the engine as clear, occupied, failed, or indeterminate; failed and indeterminate states do not grant authority. This prototype does not yet expose simulated failures in the controls.
- The three region labels are illustrative signposts only in this prototype. The current playable topology is the Southern training layout; independent Central and Northern networks are future work.
- The deterministic engine advances in fixed ticks. Trains move only when the simulation has established their route and movement authority.

See `ktmb_ctc_simulator_prompt.md` for the full project specification and staged roadmap.
