#!/usr/bin/env python3
"""Draw the six tab-bar icons. Monochrome, transparent background."""

import struct
import zlib
from pathlib import Path

SIZE = 81
SAMPLES = 4


def chunk(tag, data):
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)


def in_circle(x, y, cx, cy, r):
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


def in_round_rect(x, y, left, top, width, height, rad):
    right = left + width
    bottom = top + height
    if x < left or y < top or x > right or y > bottom:
        return False
    if x < left + rad and y < top + rad:
        return in_circle(x, y, left + rad, top + rad, rad)
    if x > right - rad and y < top + rad:
        return in_circle(x, y, right - rad, top + rad, rad)
    if x < left + rad and y > bottom - rad:
        return in_circle(x, y, left + rad, bottom - rad, rad)
    if x > right - rad and y > bottom - rad:
        return in_circle(x, y, right - rad, bottom - rad, rad)
    return True


def in_triangle(x, y, p1, p2, p3):
    def sign(a, b, c):
        return (a[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (a[1] - c[1])

    point = (x, y)
    b1 = sign(point, p1, p2) < 0
    b2 = sign(point, p2, p3) < 0
    b3 = sign(point, p3, p1) < 0
    return b1 == b2 == b3


def rules_shape(x, y):
    outer = in_round_rect(x, y, 24, 14, 34, 52, 6)
    inner = in_round_rect(x, y, 27.4, 17.4, 27.2, 45.2, 4)
    left = in_circle(x, y, 35.2, 36.5, 6.4)
    right = in_circle(x, y, 46.6, 36.5, 6.4)
    tri = in_triangle(x, y, (28.2, 39.2), (53.6, 39.2), (40.9, 55.5))
    return (outer and not inner) or left or right or tri


def advanced_shape(x, y):
    return (
        in_round_rect(x, y, 16, 46, 13, 20, 3.5)
        or in_round_rect(x, y, 34, 32, 13, 34, 3.5)
        or in_round_rect(x, y, 52, 18, 13, 48, 3.5)
    )


def mine_shape(x, y):
    return in_circle(x, y, 40.5, 27, 11) or in_round_rect(x, y, 22, 44, 37, 22, 12)


SHAPES = {
    "rules": rules_shape,
    "advanced": advanced_shape,
    "mine": mine_shape,
}

COLORS = {
    "": (138, 129, 117),
    "-on": (27, 67, 50),
}


def coverage(shape, x, y):
    hit = 0
    for sy in range(SAMPLES):
        for sx in range(SAMPLES):
            px = x + (sx + 0.5) / SAMPLES
            py = y + (sy + 0.5) / SAMPLES
            if shape(px, py):
                hit += 1
    return hit / float(SAMPLES * SAMPLES)


def write_png(path, rgb, shape):
    raw = bytearray()
    for y in range(SIZE):
        raw.append(0)
        for x in range(SIZE):
            alpha = coverage(shape, x, y)
            if alpha <= 0:
                raw.extend((0, 0, 0, 0))
            else:
                raw.extend((rgb[0], rgb[1], rgb[2], int(round(alpha * 255))))
    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", SIZE, SIZE, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    png += chunk(b"IEND", b"")
    path.write_bytes(png)


def main():
    out = Path(__file__).resolve().parents[1] / "assets" / "tab"
    out.mkdir(parents=True, exist_ok=True)
    for name, shape in SHAPES.items():
        for suffix, rgb in COLORS.items():
            write_png(out / f"{name}{suffix}.png", rgb, shape)
            print(out / f"{name}{suffix}.png")


if __name__ == "__main__":
    main()
