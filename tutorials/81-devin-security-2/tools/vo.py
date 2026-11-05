"""Tutorial-local wrapper for _kit/tools/vo.py (same args).
eleven_multilingual_v2's alignment marks a line's last word as ending ~0.1 s before it is heard, so the kit's
cut search (which starts 0.15 s before that aligned end) kept landing inside the last word and every take failed
the transcript boundary check. Start the search just after the aligned end instead; nothing else changes."""
import os, sys
kit = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_kit', 'tools', 'vo.py')
src = open(kit).read()
old = 'lo, hi = max(last[1] - 0.15, last[0]), min(first[0] + 0.15, first[1])'
assert old in src, 'kit vo.py changed; update this wrapper'
src = src.replace(old, 'lo, hi = min(last[1] + 0.08, first[0]), min(first[0] + 0.15, first[1])')
sys.argv[0] = kit
exec(compile(src, kit, 'exec'), {'__name__': '__main__'})
