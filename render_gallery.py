"""render_gallery.py — display the work: the SVL scene under THREE grammars.

Extends spine_render.py from two grammars to three (Aggriparium, Moon Archive,
Evo) and renders the canonical Law-of-Translation gallery. The bone is identical
across all three panels; only the saucer (the grammar) changes.

Anya appears ONLY as the canon-permitted low-res treatment: silhouette + Pink
Mark (style guide §7 — "at <=32px square: Anya may be reduced to silhouette +
pink mark only"). No invented canonical likeness; canonical proportions are TBD
pending the iPad Pro production runs, and licensed AnyaBear art is not AI-
generated per the guide. This is on-model by the guide's own rule.

  safety check · security check · transparency check · :<477>=-
"""
from __future__ import annotations
import json, random
from dataclasses import dataclass
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

WS = Path("/home/user/workspace")
GRAM_DIR = WS / "games_pplx" / "03_schemas_grammars"
OUT_DIR = WS / "games_pplx" / "01_playables" / "gallery"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PIXEL_W, PIXEL_H = 128, 96
SCALE = 6
OUT_W, OUT_H = PIXEL_W * SCALE, PIXEL_H * SCALE
PINK_MARK = (160, 34, 58)  # #a0223a — the brand signal, non-negotiable


@dataclass
class Grammar:
    name: str; palette: dict; glosses: dict; register: str
    @classmethod
    def load(cls, path: Path):
        d = json.loads(path.read_text())
        return cls(d["name"],
                   {r: b["hex"] for r, b in d["palette"].items()},
                   {r: b.get("gloss", "") for r, b in d["palette"].items()},
                   d.get("register", ""))
    def color(self, role):
        h = self.palette[role].lstrip("#")
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def _blend(a, b, t):
    return tuple(int(a[i]*(1-t)+b[i]*t) for i in range(3))


def render_scene(g: Grammar) -> Image.Image:
    img = Image.new("RGB", (PIXEL_W, PIXEL_H), g.color("void"))
    px = img.load()
    rng = random.Random(7)
    # sky / illumination
    for y in range(0, 32):
        c = _blend(g.color("illumination"), g.color("structure"), (y/32)*0.4)
        for x in range(PIXEL_W): px[x, y] = c
    # horizon / structure
    for y in range(32, 38):
        for x in range(PIXEL_W): px[x, y] = g.color("structure")
    # middle ground / memory
    for y in range(38, 64):
        base = _blend(g.color("memory"), g.color("shadow"), ((y-38)/26)*0.25)
        for x in range(PIXEL_W): px[x, y] = base
    for _ in range(220):
        px[rng.randrange(PIXEL_W), rng.randrange(40, 62)] = g.color("life")
    # hedgerow / life
    for y in range(64, 78):
        for x in range(PIXEL_W):
            px[x, y] = g.color("life") if rng.random() < 0.7 else g.color("shadow")
    # ground / void
    for y in range(78, PIXEL_H):
        for x in range(PIXEL_W): px[x, y] = g.color("void")
    _draw_temple(px, g, PIXEL_W//2, 66)
    # signal mote
    for dy in range(-1, 2):
        for dx in range(-1, 2):
            if abs(dx)+abs(dy) <= 1: px[100+dx, 12+dy] = g.color("signal")
    # value lantern
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            if dx*dx+dy*dy <= 5: px[PIXEL_W//2+dx, 82+dy] = g.color("value")
    _draw_reliqery(px, g, 6, 6, 30, 24)
    _draw_anya_silhouette(px, g, cx=24, base_y=90)  # canon §7 treatment
    return img.resize((OUT_W, OUT_H), Image.NEAREST)


def _draw_temple(px, g, cx, base_y):
    stru, shad, illu = g.color("structure"), g.color("shadow"), g.color("illumination")
    for x in range(cx-14, cx+15):
        for y in range(base_y+10, base_y+13): px[x, y] = stru
    for col_x in (cx-10, cx+9):
        for x in range(col_x-1, col_x+2):
            for y in range(base_y-2, base_y+10): px[x, y] = stru
        for y in range(base_y-2, base_y+10): px[col_x+2, y] = shad
    for x in range(cx-13, cx+14):
        for y in range(base_y-5, base_y-2): px[x, y] = stru
    for i in range(8):
        for x in range(cx-12+i, cx+13-i): px[x, base_y-6-i] = stru
    px[cx, base_y-1] = illu


def _draw_reliqery(px, g, x0, y0, x1, y1):
    illu, voi, shad = g.color("illumination"), g.color("void"), g.color("shadow")
    for y in range(y0+1, y1):
        for x in range(x0+1, x1): px[x, y] = voi
    for x in range(x0, x1+1): px[x, y0] = illu; px[x, y1] = illu
    for y in range(y0, y1+1): px[x0, y] = illu; px[x1, y] = illu
    for d in range(-(y1-y0), x1-x0+1, 4):
        for k in range(y1-y0+1):
            x, y = x0+d+k, y0+k
            if x0 < x < x1 and y0 < y < y1: px[x, y] = shad


def _draw_anya_silhouette(px, g, cx, base_y):
    """Canon §7: silhouette + pink mark only. A small seated-dog form in
    'shadow' (an honest mass, not a likeness) carrying the Pink Mark."""
    shad = g.color("shadow")
    # seated body mass (rough pixel blob: haunch + back + head + ear)
    body = [
        (cx-5, base_y-6, cx+5, base_y),      # haunch / base
        (cx-4, base_y-11, cx+3, base_y-6),   # torso
        (cx-1, base_y-17, cx+5, base_y-11),  # head
    ]
    for x0, y0, x1, y1 in body:
        for x in range(x0, x1):
            for y in range(y0, y1):
                if 0 <= x < PIXEL_W and 0 <= y < PIXEL_H: px[x, y] = shad
    # one ear
    for y in range(base_y-20, base_y-16):
        px[cx+4, y] = shad; px[cx+5, y] = shad
    # tail curl
    px[cx-6, base_y-3] = shad; px[cx-7, base_y-4] = shad
    # the Pink Mark — always visible, even in silhouette (style guide §3, §6)
    for dy in range(2):
        for dx in range(2):
            px[cx+1+dx, base_y-13+dy] = PINK_MARK


def _font(sz):
    for c in ["/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
              "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]:
        if Path(c).exists(): return ImageFont.truetype(c, sz)
    return ImageFont.load_default()


def gallery(grams, out_path):
    pw, ph = OUT_W, OUT_H
    gap, title_h, label_h, legend_h, margin = 40, 70, 76, 230, 44
    n = len(grams)
    tw = pw*n + gap*(n-1) + margin*2
    th = title_h + label_h + ph + legend_h + margin
    canvas = Image.new("RGB", (tw, th), (11, 11, 13))  # obsidian
    d = ImageDraw.Draw(canvas)
    tf, lf, rf, sf = _font(34), _font(26), _font(18), _font(16)
    d.text((margin, 18), "AnyaBear · the Spine under three grammars · Law of Translation",
           font=tf, fill=(244, 213, 138))  # pale amber
    for i, g in enumerate(grams):
        x = margin + i*(pw+gap); y = title_h + label_h
        canvas.paste(render_scene(g), (x, y))
        d.text((x, y-label_h+10), g.name, font=lf, fill=(244, 213, 138))
        d.text((x, y-label_h+44), g.register, font=rf, fill=(167, 220, 220))  # pale teal
        ly = y + ph + 18
        for j, role in enumerate(["illumination","structure","memory","life","signal","value","shadow","void"]):
            ry = ly + j*24
            for dy in range(16):
                for dx in range(16):
                    canvas.putpixel((x+dx, ry+dy), g.color(role))
            d.rectangle([x, ry, x+16, ry+16], outline=(60,60,64))
            d.text((x+24, ry-1), f"{role:<13} {g.glosses.get(role,'')}", font=sf, fill=(210,208,200))
    d.text((margin, th-margin+6),
           "the bone is identical; only the saucer changes  ·  Anya: silhouette + Pink Mark (canon §7)  ·  :<477>=-",
           font=rf, fill=(110,110,114))
    canvas.save(out_path)


def main():
    grams = [
        Grammar.load(GRAM_DIR / "19c42b21__Aggriparium.grammar.json"),
        Grammar.load(GRAM_DIR / "19c42b21__Moon-Archive.grammar.json"),
        Grammar.load(GRAM_DIR / "Evo.grammar.json"),
    ]
    for g in grams:
        render_scene(g).save(OUT_DIR / f"{g.name.lower().replace(' ','-')}.png")
    gallery(grams, OUT_DIR / "law-of-translation-3.png")
    print("ok — rendered 3 scenes + the three-grammar gallery")


if __name__ == "__main__":
    main()
