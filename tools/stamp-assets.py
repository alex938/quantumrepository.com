#!/usr/bin/env python3
"""Stamp a content hash onto local CSS/JS references in every HTML page.

The site is served through Cloudflare, which caches main.css / guide.css /
accessibility.css / guide.js by filename. Without a version in the URL, a
deploy ships new HTML against a stylesheet that visitors keep receiving from
cache for hours — which silently breaks anything the new markup depends on.

Adding ?v=<hash of the file> makes each release a distinct cache key, so a
changed asset is fetched immediately and an unchanged one still hits cache.

Run from the repository root after changing any of those files:

    python3 tools/stamp-assets.py
"""
import hashlib
import os
import re
import sys

ASSETS = ("main.css", "guide.css", "accessibility.css", "guide.js")


def digest(path):
    with open(path, "rb") as fh:
        return hashlib.sha256(fh.read()).hexdigest()[:8]


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)

    versions = {}
    for name in ASSETS:
        if not os.path.exists(name):
            sys.exit(f"missing asset: {name}")
        versions[name] = digest(name)

    # href="../main.css", href="main.css", href="/main.css", with or without
    # an existing ?v= to replace.
    pattern = re.compile(
        r'((?:href|src)=")((?:\.\./|/)?)(' + "|".join(re.escape(a) for a in ASSETS) + r')(\?v=[0-9a-f]+)?(")'
    )

    changed = 0
    for dirpath, dirnames, filenames in os.walk("."):
        dirnames[:] = [d for d in dirnames if d not in (".git", ".github", "tools")]
        for filename in sorted(filenames):
            if not filename.endswith(".html"):
                continue
            path = os.path.join(dirpath, filename)
            raw = open(path, "rb").read()
            bom = raw.startswith(b"\xef\xbb\xbf")
            text = raw.decode("utf-8-sig")

            stamped = pattern.sub(
                lambda m: f"{m.group(1)}{m.group(2)}{m.group(3)}?v={versions[m.group(3)]}{m.group(5)}",
                text,
            )
            if stamped != text:
                with open(path, "w", encoding="utf-8") as fh:
                    if bom:
                        fh.write("﻿")
                    fh.write(stamped)
                changed += 1

    print(f"stamped {changed} pages: " + ", ".join(f"{k}={v}" for k, v in versions.items()))


if __name__ == "__main__":
    main()
