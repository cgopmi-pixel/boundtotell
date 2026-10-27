"""Rebuild lossless WOFF2 copies of the six current website fonts.

Requires fontTools. If its Python Brotli binding is unavailable, Node's built-in
Brotli implementation supplies compression and decompression through stdin.
Original OTF files remain available for fallbacks and the preserved websites.
"""
from pathlib import Path
import subprocess
from fontTools.ttLib import TTFont
import fontTools.ttLib.woff2 as woff2

if not woff2.haveBrotli:
    class NodeBrotli:
        MODE_FONT, MODE_TEXT = 2, 1

        @staticmethod
        def compress(data, mode=2):
            code = "const z=require('node:zlib'),f=require('node:fs');process.stdout.write(z.brotliCompressSync(f.readFileSync(0),{params:{[z.constants.BROTLI_PARAM_MODE]:Number(process.argv[1]),[z.constants.BROTLI_PARAM_QUALITY]:11}}));"
            return subprocess.run(['node', '-e', code, str(mode)], input=data, capture_output=True, check=True).stdout

        @staticmethod
        def decompress(data):
            code = "const z=require('node:zlib'),f=require('node:fs');process.stdout.write(z.brotliDecompressSync(f.readFileSync(0)));"
            return subprocess.run(['node', '-e', code], input=data, capture_output=True, check=True).stdout

    woff2.brotli = NodeBrotli
    woff2.haveBrotli = True

root = Path(__file__).resolve().parent.parent
names = ['reading-serif', 'reading-serif-bold', 'reading-serif-italic', 'reading-serif-bold-italic', 'refined-sans', 'refined-sans-bold']
original_size = compressed_size = 0
for name in names:
    source = root / 'public/assets' / (name + '.otf')
    target = source.with_suffix('.woff2')
    original = TTFont(source)
    font = TTFont(source)
    font.flavor = 'woff2'
    font.save(target)
    restored = TTFont(target)
    assert restored.getBestCmap() == original.getBestCmap(), name
    assert restored.getGlyphOrder() == original.getGlyphOrder(), name
    assert restored['hmtx'].metrics == original['hmtx'].metrics, name
    assert restored['CFF '].compile(restored) == original['CFF '].compile(original), name
    original_size += source.stat().st_size
    compressed_size += target.stat().st_size
print(f'WOFF2: {original_size:,} to {compressed_size:,} bytes ({100 * (1 - compressed_size/original_size):.1f}% smaller); all glyphs, outlines and advances preserved.')
