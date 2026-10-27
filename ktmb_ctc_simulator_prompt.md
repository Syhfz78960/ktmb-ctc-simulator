# Project Specification: KTMB CTC Simulator — HTML5 Railway Signalling Game

## 1. Project Overview

Develop a browser-based HTML5 game in which the player assumes the role of a Centralised Traffic Control (CTC) officer responsible for managing railway traffic across three simulated KTMB control regions:

1. **Southern Region**
2. **Central Region**
3. **Northern Region**

The player must supervise train movements, set routes, control signals, manage points, monitor block occupancy, resolve conflicts, and respond to operational disruptions.

The game should be inspired by KTMB's railway operating practices and the document *H491-005-2-2020-CU1 — Stations Safety and Security Execution*, particularly Modules 11 and 12, covering station interlocking and block signalling.

This is an educational simulation, not an actual railway control system. Do not imply that the simulated layouts, control boundaries, or configurations represent KTMB's complete current infrastructure.

## 2. Technical Requirements

- Use HTML5, CSS3 and vanilla JavaScript.
- Run entirely in a modern web browser.
- Do not require a backend, database, account, or server connection.
- Keep the project modular and maintainable.
- Use SVG or HTML Canvas for the railway control panel and track diagrams.
- Support desktop and mobile browser layouts.
- Use a consistent visual design inspired by railway CTC workstations.
- Include pause, resume, restart, simulation speed controls, and scenario selection.
- Keep train movement and signalling logic separate from the user interface.
- Do not depend on external assets or libraries unless necessary.

## 3. Control Regions

### 3.1 Southern Region

Represent a fictionalised Southern Region inspired by the Gemas–Johor Bahru corridor.

Gameplay features:
- Interlocked stations and junctions.
- Single-track and double-track sections where appropriate to the scenario.
- Route setting, point control, signal clearance, and block occupancy.
- Conflicting movements and delayed trains.
- RRI-inspired station interlocking scenarios.

### 3.2 Central Region

Represent a fictionalised Central Region inspired by the Klang Valley railway network.

Gameplay features:
- Higher traffic density.
- Closely spaced stations and junctions.
- Commuter and intercity train interactions.
- Platform and route conflicts.
- Train delays, congestion, and service recovery.

### 3.3 Northern Region

Represent a fictionalised Northern Region inspired by the northern main line towards Padang Besar.

Gameplay features:
- Long-distance and intercity services.
- Station approaches and junctions.
- Block management across multiple stations.
- Train sequencing, overtaking where infrastructure permits, and disruption management.

All three regions must have distinct track layouts, timetables, traffic patterns, difficulty levels, and operational challenges. Treat them as game-design regions rather than verified representations of KTMB's real CTC jurisdiction boundaries.

## 4. Railway Signalling and Interlocking Model

Implement a simplified but internally consistent railway signalling model inspired by the KTMB training material.

### 4.1 Interlocking Categories

Support three station types:

**A. Non-interlocked station**
- Points and signals are operated separately.
- Require the player to follow prescribed manual safety procedures.
- Clearly indicate that the system does not automatically enforce every route-conflict constraint.

**B. Partially interlocked station**
- Model limited interlocking and point-detection capabilities.
- Make the applicable restrictions explicit in the scenario.
- Do not assume that every track section has occupancy detection.
- Represent limitations as defined simulation rules, not arbitrary behaviour.

**C. Fully interlocked station**
- Support mechanical-interlocking-inspired, relay-interlocking-inspired (RRI), and processor-based-interlocking-inspired (PBI) configurations.
- Prevent incompatible routes from being established simultaneously.
- Require applicable point positions, point detection, track vacancy, and route-locking conditions before signal clearance.
- Display the reason whenever a route request is rejected.

These are simplified game models. Do not present them as complete replicas of real KTMB signalling installations.

### 4.2 Route Setting

When the player requests a route, the game must:

1. Validate the requested origin and destination.
2. Check that the route exists in the track topology.
3. Check all relevant track sections for occupancy.
4. Check point positions and point detection.
5. Check for conflicting or opposing routes.
6. Check applicable overlap and flank-protection requirements defined for the scenario.
7. Establish route locking when all required conditions are satisfied.
8. Clear the signal only when the complete configured set of conditions is met.
9. Display a clear explanation if any condition fails.

Once a route is locked, prevent unsafe changes to its protected points or conflicting routes until the applicable release conditions are satisfied.

### 4.3 Train Detection

Support configurable train-detection methods:

- Track circuits.
- Axle counters.

Track circuits should detect simulated train occupancy and may have configurable failures.

Axle counters should maintain simulated axle counts and section states. A count discrepancy must not automatically declare a section clear. Require an explicit, appropriately authorised recovery procedure.

Include normal, occupied, failed, and indeterminate detection states.

### 4.4 Signals

Implement a configurable signal-aspect model, including:
- Red: stop.
- Yellow: caution, according to the scenario's defined signalling rules.
- Green: proceed, according to the scenario's defined signalling rules.

Do not assume that these three aspects cover every real KTMB signal type. Configure aspect meanings and permitted transitions according to each scenario.

A signal must never clear merely because the player clicks it. Signal clearance must be determined by the interlocking and block-system logic.

### 4.5 Block Signalling

Include scenario configurations inspired by the operating arrangements described in the training document:

- Absolute Block working.
- Token-based single-line working.
- Tokenless block working inspired by Auto Blok Geganti (ABG).
- Electronic train-detection-based block working.

Implement only the rules needed for the selected scenario, with clear explanations of how movement authority is established.

For token-based scenarios:
- Model the token or authorised movement document.
- Prevent conflicting authorities for the same protected single-line section.
- Require compliance with the scenario's token exchange and arrival procedures.

For tokenless and electronic block scenarios:
- Enforce the configured block-occupancy and signal rules.
- Prevent conflicting movement authorities.
- Display the current block state and applicable authority.

### 4.6 Overlaps

Allow scenarios to define a protected overlap beyond a stop signal.

The KTMB training document describes an approximately 400-metre overlap for a particular electronic train-detection block arrangement. This value may be used in a clearly labelled example scenario, but must not be applied universally.

Represent overlap occupancy and clearance as explicit conditions where required by the selected scenario.

## 5. Train Simulation

Each train should have:
- Unique train ID.
- Service category.
- Origin and destination.
- Current track section and position.
- Direction of travel.
- Speed and maximum permitted speed.
- Current movement authority.
- Timetable and scheduled stops.
- Delay status.
- Operating state.

Train movement must be simulated over time.

Trains must:
- Obey their movement authority.
- Respond to restrictive signals.
- Stop at red signals.
- Reduce speed and stop at stations as required.
- Respect configured speed limits.
- Never move through an occupied or unauthorised section.
- Report arrival and departure events to the CTC interface.

Use a deterministic simulation engine where practical so that the same scenario and player actions produce reproducible outcomes.

## 6. CTC User Interface

Create a railway-control interface with the following components.

### 6.1 Main Track Diagram
- Display tracks, stations, junctions, points, signals, block boundaries, and platforms.
- Display train IDs and directions.
- Show track occupancy using distinct colours or patterns.
- Animate train movement.
- Allow the player to select signals, points, trains, and routes.
- Visually distinguish requested, established, locked, occupied, and failed states.

### 6.2 Control Panel
Include controls for:
- Requesting routes.
- Cancelling eligible route requests.
- Operating points when permitted.
- Viewing signal aspects.
- Selecting trains.
- Viewing movement-authority information.
- Opening station and block information.
- Acknowledging alarms.
- Managing authorised recovery procedures.

All controls must invoke real simulation logic rather than being decorative.

### 6.3 Status and Event Panels
Display:
- Active trains.
- Occupied and clear blocks.
- Locked routes.
- Signal and point states.
- Active alarms.
- Delayed services.
- Recent operational events.
- Reasons for rejected commands.

Provide a timestamped event log recording player actions, train movements, route changes, alarms, and scenario outcomes.

### 6.4 Region Switching
Provide a clear interface for switching among Southern, Central, and Northern regions.

Each region should have independent simulation state unless a scenario explicitly connects them. Preserve the state of a region when switching away from it.

## 7. Disruptions and Failure Scenarios

Include optional events such as:
- Point machine failure.
- Point detection failure.
- Track-circuit failure.
- Axle-counter discrepancy.
- Signal failure.
- Communication failure.
- Delayed train.
- Extended station dwell.
- Temporary track closure.
- Engineering possession.
- Congestion caused by poor traffic sequencing.

Failures must have defined consequences and recovery rules. Never silently bypass interlocking protections to make a scenario progress.

Where a real-world recovery procedure is not established by the reference material, clearly label the procedure as a game abstraction.

## 8. Gameplay and Scoring

Provide multiple modes.

### Training Mode
- Explain signalling concepts.
- Provide hints and feedback.
- Allow the player to inspect why a route is or is not available.
- Offer introductory scenarios with low traffic density.

### Timetable Mode
- Manage multiple trains according to a schedule.
- Reward punctuality, safe route planning, and efficient traffic sequencing.

### Incident Mode
- Introduce unexpected disruptions.
- Require the player to maintain safe train movements while recovering service.

### Scoring
Track:
- Timetable adherence.
- Average train delay.
- Route-setting efficiency.
- Number of unnecessary stops.
- Correct handling of failures.
- Safety-rule compliance.

A simulated collision, conflicting movement authority, or other major safety violation should cause the scenario to fail immediately. Never reward unsafe operation for the sake of punctuality.

## 9. Architecture

Organise the JavaScript into logical modules or classes:

- `SimulationEngine`: time progression and simulation lifecycle.
- `RailwayNetwork`: stations, track sections, junctions, and connectivity.
- `TrainController`: train state, movement, speed, and stops.
- `InterlockingEngine`: route validation, conflict exclusion, point locking, and signal clearance.
- `BlockSystem`: block occupancy and movement-authority rules.
- `TrainDetection`: track circuits and axle-counter states.
- `TimetableManager`: schedules, delays, and train sequencing.
- `IncidentManager`: failures and disruptions.
- `CTCInterface`: controls, diagrams, and status displays.
- `EventLogger`: event history and diagnostics.
- `ScenarioManager`: region configurations, training scenarios, and difficulty settings.

Use a single authoritative simulation state. The interface must not be able to override safety rules by directly modifying signal aspects, point states, occupancy states, or movement authority.

## 10. Data Model

Represent each railway network using configurable data objects.

A track section should include:
- ID.
- Length.
- Connected track sections.
- Permitted directions.
- Occupancy state.
- Detection method.
- Speed limit.
- Associated signals.
- Applicable overlap configuration.

A station should include:
- ID and name.
- Connected track sections.
- Platforms.
- Points and signals.
- Interlocking category.
- Block-system configuration.

A route should include:
- Origin signal.
- Destination.
- Required track sections.
- Required point positions.
- Conflicting routes.
- Overlap requirements.
- Locking and release conditions.

A train should include:
- ID.
- Current position.
- Speed.
- Direction.
- Route and movement authority.
- Schedule.
- Operational state.

Keep regional infrastructure in separate configuration files or JavaScript objects so new regions and scenarios can be added easily.

## 11. Safety and Validation

Implement automated tests for:
- Conflicting routes cannot both be cleared.
- Occupied blocks cannot be treated as clear.
- Signals remain restrictive when mandatory safety conditions fail.
- Points cannot change position while protected by a locked route.
- A train cannot exceed its movement authority.
- Opposing trains cannot enter the same protected single-line section without valid, compatible authority.
- Failed or indeterminate train detection cannot silently grant permission to proceed.
- Route release follows the configured release conditions.
- Scenario resets restore a consistent state.

Validate route requests and state transitions in the simulation engine, not only in the UI.

## 12. Development Priorities

Build the game incrementally.

**Phase 1 — Playable prototype**
- One region.
- One small station layout.
- A few trains.
- Track occupancy.
- Signals, points, and basic route setting.
- Interlocking checks.
- Basic event log.

**Phase 2 — Traffic management**
- Timetables.
- Train movement animation.
- Multiple stations and junctions.
- Block signalling.
- Route locking and release.

**Phase 3 — Three-region system**
- Southern, Central, and Northern configurations.
- Region switching.
- Different traffic densities and operational challenges.

**Phase 4 — Advanced simulation**
- RRI/PBI-inspired interlocking variations.
- Token and tokenless block scenarios.
- Failures, alarms, and recovery.
- Training and incident modes.
- Scoring and statistics.

**Phase 5 — Testing and polish**
- Automated safety tests.
- Responsive interface.
- Performance optimisation.
- Save and resume simulation state locally if practical.
- Documentation for controls and signalling rules.

## 13. Deliverables

Produce:
1. A complete working HTML5 game.
2. All required HTML, CSS, and JavaScript files.
3. A clear project structure.
4. At least one playable scenario.
5. A concise README with instructions for running the game locally.
6. Documented assumptions and simplifications.
7. Automated tests for the core signalling and interlocking rules.

Do not deliver a static mock-up in place of a working game. Prioritise a functional, testable prototype before implementing every advanced feature.

## Final Instruction

Start by designing and implementing a small but functional CTC simulation with one station, multiple connected track sections, signals, points, block occupancy, and a basic interlocking engine.

Verify the safety rules with automated tests before expanding to the three control regions. Use the KTMB training document as a reference for concepts, while explicitly distinguishing documented operating principles from invented simulation details.

The final result should feel like a railway traffic-control game, with meaningful decisions, visible train movements, clear signal indications, operational challenges, and a consistent safety model.
