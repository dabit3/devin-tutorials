"""Run the kit's vo.py, checking the take against each line's spoken `voSay` text instead of its written `vo` text.
Captions keep the written forms (Qwen3.8-27B, 600, 74.1 percent) while the voice reads them spelled out, and the
speech-to-text check would otherwise fail on every written number. Same arguments and output as _kit/tools/vo.py."""
import os, sys
src_p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '_kit', 'tools', 'vo.py')
src = open(src_p).read()
for a, b in [("if not matches(' '.join(t for _, t, _ in items),", "if not matches(' '.join(s for _, _, s in items),"),
             ("tail, head = ''.join(words(items[li][1])), ''.join(words(items[li + 1][1]))",
              "tail, head = ''.join(words(items[li][2])), ''.join(words(items[li + 1][2]))")]:
    assert src.count(a) == 1, a
    src = src.replace(a, b)
sys.argv[0] = src_p
exec(compile(src, src_p, 'exec'))
