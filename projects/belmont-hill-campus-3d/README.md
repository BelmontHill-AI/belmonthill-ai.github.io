# Belmont Hill in 3D

A 3D model of campus you can fly over (Drone mode) or explore on foot (Walk mode). It runs in the browser with [three.js](https://threejs.org), loaded from jsDelivr at a pinned version.

## Want to help build it?

The map is meant to grow. Some ideas, from easiest to hardest:

1. **Label a place.** Add a building, field, room or landmark to `places.json` (see below).
2. **Fix a building's look.** Wall colors, roof shapes and window styles are set near the top of the building code in `index.html` (search for `STYLE`).
3. **Add a feature.** A tour mode that flies between stops, a "where's my next class" route, seasonal lighting, sound, mini-games. Open an issue or bring it to AI Club first so two people don't build the same thing.

Every change goes through a pull request, the same as any other project on the site. See the repo's [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Adding a label in `places.json`

Each entry is a name plus a position on the map in meters (`x` is east, `y` is north, measured from the center of the model):

```json
{ "name": "Dining Hall", "x": 134.3, "y": 101.8 }
```

To find the `x` and `y` for a spot:

1. Run the site locally (`python3 -m http.server` from the repo root) and open `http://localhost:8000/projects/belmont-hill-campus-3d/`.
2. Switch to **Walk** mode and stand on the spot. The readout in the bottom-left corner shows `map x` and `y`.
3. Copy those numbers into a new entry in `places.json`, reload, and check that the label appears and shows up in the **Go to…** menu.

Names must be unique. A name that matches a building already labeled on the map is skipped.

## What the files are

| File | What it holds | Edit it? |
|---|---|---|
| `index.html` | The whole app: rendering, controls, labels, minimap | Yes, for features and styling |
| `places.json` | Extra labels anyone can add | Yes, this is the easy one |
| `campus.json` | Ground heights, building shapes, trees, sports fields (generated from the data below) | Rarely; it's large and machine-made |
| `ortho.jpg`, `mini.jpg` | The aerial photo draped over the ground, and the minimap image | No |
| `grass.jpg`, `turf.jpg`, `clay.jpg` | Surface textures | Only to swap a texture |

## Data sources

- Ground and tree heights: USGS 3DEP lidar (2021)
- Aerial photo: MassGIS orthoimagery (spring 2025, 15 cm)
- Building outlines: © OpenStreetMap contributors (ODbL), plus a few traced from the lidar
- Textures: CC0 from [ambientCG](https://ambientcg.com)
