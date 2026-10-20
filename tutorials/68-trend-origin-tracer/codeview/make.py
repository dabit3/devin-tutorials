# Renders real files from the demo PR branch as dark, line-numbered HTML pages for capture.
# Usage: python3 make.py <git-ref> (run inside product-demo-apps)
import html, io, keyword, subprocess, sys, token, tokenize, pathlib
ref = sys.argv[1]
OUT = pathlib.Path(__file__).parent
FILES = ['trend-origin-tracer/app.py', 'trend-origin-tracer/tracer/grok.py']
CSS = """body{margin:0;background:#0d1117;color:#e6edf3;font:15px/1.6 'JetBrains Mono',ui-monospace,Menlo,monospace}
header{position:sticky;top:0;background:#161b22;border-bottom:1px solid #30363d;padding:14px 28px;font:600 15px Inter,system-ui,sans-serif;color:#e6edf3}
header span{color:#8b949e;font-weight:400;margin-left:12px}
main{padding:12px 0 400px}.ln{display:flex;white-space:pre}.no{width:64px;text-align:right;padding-right:22px;color:#6e7681;flex:none}
.code{display:inline-block}.k{color:#ff7b72}.s{color:#a5d6ff}.c{color:#8b949e}.d{color:#d2a8ff}.f{color:#79c0ff}.n{color:#79c0ff}"""
def color(src):
    rows = src.splitlines(keepends=True)
    off = [0]
    for r in rows: off.append(off[-1] + len(r))
    pos = lambda rc: off[rc[0] - 1] + rc[1]
    out, cur, prev = [], 0, None
    wrap = lambda text, cls: '\n'.join(f'<span class="{cls}">{html.escape(x)}</span>' if cls and x else html.escape(x) for x in text.split('\n'))
    for t in tokenize.generate_tokens(io.StringIO(src).readline):
        if t.type == token.ENDMARKER: break
        a, b = pos(t.start), pos(t.end)
        if a > cur: out.append(html.escape(src[cur:a]))
        cls = ''
        if t.type == token.NAME and keyword.iskeyword(t.string): cls = 'k'
        elif t.type == token.STRING or t.type in (getattr(token, 'FSTRING_START', -1), getattr(token, 'FSTRING_MIDDLE', -1), getattr(token, 'FSTRING_END', -1)): cls = 's'
        elif t.type == tokenize.COMMENT: cls = 'c'
        elif t.type == token.NUMBER: cls = 'n'
        elif t.type == token.OP and t.string == '@': cls = 'd'
        elif t.type == token.NAME and prev is not None and prev.string in ('def', 'class'): cls = 'f'
        if b > cur: out.append(wrap(src[max(a, cur):b], cls)); cur = b
        if t.type not in (token.NL, token.NEWLINE, tokenize.COMMENT, token.INDENT, token.DEDENT): prev = t
    out.append(html.escape(src[cur:]))
    return ''.join(out).split('\n')
for f in FILES:
    src = subprocess.check_output(['git', 'show', f'{ref}:{f}'], text=True)
    lines = color(src)[:len(src.splitlines())]
    ind = lambda l: len(l) - len(l.lstrip(' '))
    body = ''.join(f'<div class="ln"><span class="no">{i}</span><span>{" " * ind(l)}</span><span class="code">{l.lstrip(" ") or " "}</span></div>' for i, l in enumerate(lines, 1))
    name = f.split('/')[-1]
    (OUT / f'{name}.html').write_text(f'<!doctype html><meta charset="utf-8"><title>{name}</title><style>{CSS}</style><header>{f}<span>product-demo-apps · PR #77</span></header><main>{body}</main>')
    print('wrote', name, len(lines))
