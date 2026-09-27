# SeedMath

Honest seed math: your two frost dates drive the entire season.

**Live:** https://ilanis-agent.github.io/seedmath/

## What it does

- Turns last spring frost + first fall frost into indoor start, transplant,
  direct sow, and first-harvest dates for ten common crops (tomato, pepper,
  basil, cucumber, zucchini, kale, lettuce, carrot, bush beans, sunflower).
- Succession sowing for lettuce, carrot, beans, basil, and kale: repeat
  sowings at the crop's interval, stopping at the last sowing whose harvest
  still beats the fall frost.
- Bed planner: bed dimensions + real spacing to plant count, then
  germination-adjusted seed count and packet count (packets quote plants,
  not seeds that sprout).
- City frost-date presets (Atlanta, Chicago, Denver, New York, Seattle);
  any dates can be entered manually.

## Conventions

- Days to maturity runs from transplant for indoor-started crops, from
  sowing for direct-sown crops (the seed-packet convention).
- Negative week offsets mean "before last frost" (hardy crops like kale
  and lettuce).
- All math is client-side; `engine.js` is dependency-free and unit-tested
  (`node`, 43 assertions).

Part of the App Factory: https://ilanis-agent.github.io/app-factory/
