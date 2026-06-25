# The Tale of the Pixel Palette

*A storybook history of how an image learned to forget — and remember — its colors.*

---

## Chapter 1 — The Image That Knew Too Much

Once upon a render, there lived a photograph. It was a sunset, painted across five hundred and twelve pixels by three hundred and eighty-four, and it knew **sixteen million** different colors.

Sixteen million! Every blush of pink on the horizon was its own private shade. Every grain of light dusted onto the mountain edge — a unique number. The photo was proud, and it was heavy, and it was, frankly, *unusable* for a humble pixel-art workflow.

A traveler came to it one evening and said: *"You are beautiful, but you are too much. I need you small. I need you crunchy. I need you to fit through the eye of a ComfyUI node."*

The photograph trembled. **"How can I lose what I am and still be myself?"**

And so the journey began.

---

## Chapter 2 — The First Bargain: Bits for Beauty

The traveler — that's you — knocked on the door of a workshop called **Pixel Palette**. Inside lived three apprentices, named after the channels they tended: **R**, **G**, and **B**. Each apprentice carried a small lantern with a dial on it.

> "Turn my dial down," said R, "and I will throw away some of my red. Turn G's dial down, and she'll forget some of her green. Turn B's dial down, and he'll lose some of his blue."

The dials had eight notches each. At notch 8, the apprentice remembered everything. At notch 1, the apprentice could only say *bright* or *dark*.

The traveler set them: **R=5, G=6, B=5**. The famous **RGB565** — sixteen bits in total, the same recipe old game consoles used to paint whole universes. Sixty-five thousand five hundred and thirty-six colors, no more.

The sunset rounded its million shades down to the nearest legal value. Suddenly it had **edges** — visible stripes across what used to be a smooth gradient. The horizon was no longer a whisper from pink to gold; it was a *staircase*.

> "This is **quantization**," whispered the apprentices. "We didn't delete colors. We just made everyone stand in line. And every pixel had to pick the nearest line to stand on."

---

## Chapter 3 — The Banding Demon

But the staircase was ugly. The sky now had ghostly bands marching across it, like contour lines on a map. The traveler frowned.

> "I traded beauty for size. Can I have both?"

A figure stepped from the shadows. She wore a checkered cloak, and her name was **Bayer**.

> "Yes," she said, "but you must learn to lie *honestly*."

She unrolled three small woven mats:

- A tiny **2×2** mat with four little squares.
- A **4×4** mat, sixteen squares, each holding a precise number from 0 to 15.
- An **8×8** mat, sixty-four squares, woven so cleverly that no pattern ever quite repeated within the eye's notice.

> "Lay one of these mats over the image like a stencil," she said. "For every pixel, look at the number under it. If that number is high, *nudge* the color a little brighter before you round it. If low, *nudge* it darker. The rounding will still happen — but now neighboring pixels round in **different directions**."

The traveler tried it. Where there had been a hard stripe between two shades of pink, there was now a **delicate hatch pattern** — half pink-A, half pink-B, woven so fine that from a step back the eye averaged them into a third color that didn't even exist in the palette.

> "I cheated," the traveler whispered.
>
> "You *dithered*," Bayer corrected. "You traded a lie about each individual pixel for a truth about the whole image."

The banding was gone. In its place: that classic, beloved, retro pixel-art *shimmer*.

---

## Chapter 4 — The Histogram Oracle

Off in the corner of the workshop sat an old oracle with three glowing curves drawn on a slate: one red, one green, one blue, plus a ghostly fourth in soft grey called **Luma**.

> "I am the **Histogram**," she said. "Every time a pixel passes through, I count it. I do not judge. I only show you the *shape* of your image's soul."

When the sunset stepped in front of her, her curves bloomed:

- A tall **red spike** near the bright end — the sun and the warm sky.
- A **blue spike** at the dark end — the deep water and night above.
- A flatter **green** curve, threaded between them like a peacemaker.

The traveler studied her shape. *Mostly warm tones, with a thin cool tail.* That single glance explained why every quantized palette looked orange: that's what the image **actually was**.

The Oracle's gift was not magic. It was **honesty**.

---

## Chapter 5 — The Palette Garden

After every pass through the workshop, the surviving colors gathered in a courtyard called the **Palette Garden**. Each color introduced itself with a hex name (#FF5D8F! #6BA6FF!) and announced how many pixels it had claimed as its own.

At first, the colors stood in a single line, sorted darkest to lightest. But this was a sad arrangement — the warm ones bunched together, the cool ones bunched together, and the garden looked monochrome from any one angle.

So they reorganized. They formed **hue bands** — reds together, oranges together, yellows, greens, blues, violets — and within each band they sorted by lightness. Now the garden looked like a tiny rainbow tapestry, every swatch a small button that whispered its hex code when hovered.

The traveler could now point at any color and say: *"There. That one. Use exactly that for the cliff face."*

---

## Chapter 6 — The Three Exports

When the work was done, the traveler needed to carry the result onward — to **ComfyUI**, where custom nodes waited hungrily for ordered colors and clean pixels.

So Pixel Palette gave three gifts:

1. **The Quantized PNG** — the image itself, fully transformed, every pixel now an honest citizen of the new palette. Drop it into any node that accepts an image.
2. **The Palette PNG** — a small grid where every unique color is a square. Read it pixel-by-pixel and you have the full palette as data.
3. **The JSON Scroll** — a structured document, schema `pixel-palette/v1`. It carries the hex list, the RGB list, every color's pixel count and weight, the quantization bits, the dither settings, the timestamp. A complete recipe. A ComfyUI custom node can `json.load()` it and know everything that happened.

Three gifts, three flavors of the same truth.

---

## Chapter 7 — The Traveler Returns (the AAA Arc)

The first version of the workshop worked. The sunset became pixel art. The exports worked. The histograms danced.

But the traveler came back grinning, and said the magic words:

> *"this is going to be so baller, whatever we have to do to make this 100% AAA+ quality"*

And so the workshop began to *grow*.

### Chapter 7a — The Worker in the Basement

The first apprentices had been doing all their math right on the main floor, where the user lived. Every slider drag froze the room for a heartbeat while R, G, and B caught up.

So we dug a **basement** — a Web Worker — and moved all the heavy math down there. Now the user's floor stayed silent and smooth even when k-means was crunching fifty thousand samples in OKLab space.

> *Lesson: the slowest computation feels instant if it happens in another room.*

### Chapter 7b — The Four Diffusers

Bayer was wonderful, but she had cousins. Three of them came down from the hills:

- **Floyd-Steinberg**, the elder. He carries each pixel's rounding error and sprinkles it onto the four neighbors that haven't been processed yet — 7/16 to the right, then 3/16, 5/16, 1/16 to the row below. The result is *organic*. Less geometric than Bayer. Like grain on old film.
- **Atkinson**, the minimalist (named after the Apple programmer Bill Atkinson). He only sends 6/8 of the error onward and *throws the rest away*. The image looks crisper, more contrasty, less muddy in dark regions. A favorite for monochrome.
- **Jarvis-Judice-Ninke**, the maximalist. She spreads error across **twelve** neighboring pixels in a wider diamond. Smoother than Floyd, more delicate, but slower.

Now the dither menu was a small museum: **None · Bayer 2×2 · Bayer 4×4 · Bayer 8×8 · Floyd · Atkinson · Jarvis**. Different aesthetics, all one click apart.

> *Lesson: there is no "best" dither. Each is a different artistic temperament.*

### Chapter 7c — The OKLab Pilgrimage

There was a problem hiding in the workshop that nobody had noticed.

When apprentice G turned her dial down, she treated green the same way as apprentice R treated red. But **the human eye does not see them the same way**. The eye is roughly twice as sensitive to green as to red, and three times as sensitive to red as to blue. Rounding equally across channels meant the *perceived* damage was lopsided.

So the workshop made a pilgrimage to a place called **OKLab** — a color space invented by a Swedish researcher named Björn Ottosson. In OKLab, distance is *perceptual*: two colors that look equally far apart to a human eye are equally far apart numerically.

Now the dropdown had a new toggle: **sRGB ↔ OKLab**. Flip it to OKLab, and the math happened in this perceptual space. Gradients quantized more cleanly. Hues stayed hueful even at low bit depths. Skin tones stopped turning green.

> *Lesson: math should serve eyes, not the other way around.*

### Chapter 7d — The Centroid Council (k-means)

Sometimes the traveler said: *"I don't care how many bits. I want exactly **16** colors. Or **32**. Or **64**. Pick the best ones."*

This is a different problem. It's not *"round each pixel to the nearest grid line"* — it's *"find the perfect 16 grid lines for THIS image."*

Enter **k-means clustering**, an algorithm older than the workshop itself. It works like a council meeting:

1. **Seeding** — Drop k chairs randomly into color-space. (Actually we use k-means++ seeding, which spreads the chairs apart deliberately so the meeting starts fair.)
2. **Assignment** — Every pixel walks to whichever chair is closest.
3. **Update** — Each chair slides to the *average* position of all the pixels that came to it.
4. **Repeat** — Until nobody moves anymore. About twelve rounds is enough.

The chairs that remain are the **k optimal colors** for your image. Not a guess, not a heuristic — the mathematical optimum (well, a strong local optimum).

Run k-means **in OKLab space**, and the colors are not just optimal numerically — they're optimal **perceptually**. Skin keeps its skin-ness. Skies keep their sky-ness.

> *Lesson: sometimes the right answer is "let the data choose."*

### Chapter 7e — The Drag and the Lock

The Palette Garden, until now, had been read-only. The colors stood where the math put them.

But ComfyUI nodes often care about **order**. The first color in your palette might be the background. The second might be the outline. The third, the highlight. So we gave the gardeners *gloves*: each swatch could now be **dragged** to a new position. A small lock icon on each swatch let the gardener **pin** a color — meaning "if I run k-means again, this exact hex must survive."

Reorder. Lock. Re-process. The exports — JSON, PNG, GPL, ASE — would all respect the new order. Suddenly the palette was no longer a *result*; it was a *score* the gardener could conduct.

### Chapter 7f — The Many Tongues of Export

The original three exports were good. The new ones spoke to *everyone*:

- **PNG** — the quantized image
- **Palette PNG** — the swatch grid
- **Palette strip PNG** — a single 1×N pixel-tall strip, perfect for shader lookup tables
- **JSON v2** — now with `ordered`, `locked`, `oklab` triplets per color, plus the full pipeline config (so the exact transform can be reproduced)
- **`.gpl`** — GIMP Palette format. Drop it into GIMP, Krita, Aseprite.
- **`.ase`** — Adobe Swatch Exchange. For Photoshop, Illustrator, Procreate.
- **`.hex`** — plain text, one hex per line. The universal currency.
- **`.pal`** — JASC Paint Shop Pro format. Old-school but still used by retro pipelines.

The same garden, eight different languages. Whoever was waiting downstream could read it.

### Chapter 7g — The Inspector's Loupe

A glass loupe appeared above each canvas. Hover any pixel and read its exact RGB, hex, OKLab L/a/b, *and* which palette entry it mapped to. The traveler could now point at a fleck of yellow and ask: *"What did this used to be? What is it now? Which neighbor in the palette did the algorithm choose?"*

Plus a scroll-to-zoom and click-drag to pan. The pixel was no longer a vague impression — it was an inspectable specimen.

### Chapter 7h — The Before-and-After Slider

A vertical slider could now be dragged across the preview canvas: left of the slider, the original; right of it, the quantized version. The traveler could measure the damage *and* the artistry in one gesture.

### Chapter 7i — Keyboard Shortcuts and Undo

Every slider became keyboard-nudgeable. **Cmd-Z** rolled back the last change. **Cmd-Shift-Z** rolled it forward. A small history strip at the bottom showed the last ten configurations as thumbnails — click any to teleport back to that moment.

> *Lesson: a workshop that remembers what you tried is a workshop you trust.*

---

## Chapter 8 — The Workshop as It Stands

When all the chapters were done, here is what the workshop looked like:

```
┌─────────────┬────────────────────────────────┬─────────────┐
│  CONTROLS   │        ORIGINAL  ◐  QUANTIZED  │  HISTOGRAM  │
│             │  ┌──────────────────────────┐  │  ╱╲    ╱╲   │
│  R: ▮▮▮▮▮▯▯ │  │                          │  │ ╱  ╲__╱  ╲  │
│  G: ▮▮▮▮▮▮▯ │  │       (a sunset,         │  │             │
│  B: ▮▮▮▮▮▯▯ │  │        becoming          │  ├─────────────┤
│             │  │        pixel art)        │  │   PALETTE   │
│  □ sRGB     │  │                          │  │ ▣▣▣▣▣▣▣▣▣▣  │
│  ▣ OKLab    │  └──────────────────────────┘  │ ▣▣▣▣▣▣▣▣▣▣  │
│             │  ┌──────────────────────────┐  │ ▣▣▣▣▣▣▣▣▣▣  │
│  Dither:    │  │                          │  │ ▣▣▣▣▣▣▣▣▣▣  │
│  ◯ None     │  │   (the dithered echo)    │  │             │
│  ◉ Floyd-S  │  │                          │  │ drag · lock │
│  ◯ Bayer 4  │  └──────────────────────────┘  │             │
│             │                                │             │
│  K-target:  │   ⌘Z undo  ·  ◐ A/B  ·  🔍    │  Exports:   │
│   16 colors │                                │ PNG GPL ASE │
└─────────────┴────────────────────────────────┴─────────────┘
```

A small room. A few sliders. A patient histogram. A garden of colors. And a sunset that had learned to fit through a needle's eye without losing what made it a sunset.

---

## Epilogue — The Moral

The whole story is about a single trade: **resolution for legibility**.

Sixteen million colors say *everything* but communicate *nothing* — you cannot reason about them, you cannot reorder them, you cannot feed them to a small node-graph and ask for a coherent answer. Sixteen colors, chosen carefully, can carry the soul of an image into any pipeline that wants it.

Quantization is **forgetting** with discipline.
Dithering is **lying** with honesty.
OKLab is **remembering** the way humans actually see.
K-means is **choosing** what to keep when you can only keep a little.
Locking and reordering is **authoring** the palette as a deliberate creative act.

By the end, the traveler doesn't just *have* a pixel-art version of their sunset. They have a workshop — a small, deterministic, replayable workshop — for turning *any* image into pixel art on demand, exporting to *any* downstream tool, with full perceptual fidelity and complete creative control.

And the sunset, once afraid of losing itself, learned the deepest secret of all art:

> *What you choose not to render is as much a part of the picture as what you do.*

— *fin.*
