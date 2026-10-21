"""OCR check: python3 ocrscan.py stills <a> <b>   (shots/NNNN.png) | python3 ocrscan.py video <mp4> [fps]
Prints every frame/still whose OCR text matches the forbidden patterns (403, fatal, git-manager, unable to access, token, PAT)."""
import os, re, subprocess, sys, tempfile
PAT = re.compile(r'403|fatal|git-manager|unable to access|GITHUB_PAT|ghp_|usage limit', re.I)
def ocr(path):
    r = subprocess.run(['tesseract', path, '-', '--psm', '6', '-l', 'eng'], capture_output=True, text=True, errors='replace')
    return r.stdout
def shrink(src, dst):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', 'scale=1920:-2', dst], check=True)
mode = sys.argv[1]
if mode == 'stills':
    a, b = int(sys.argv[2]), int(sys.argv[3]); D = os.path.dirname(os.path.abspath(__file__))
    for n in range(a, b + 1):
        p = os.path.join(D, 'shots', f'{n:04d}.png')
        if not os.path.exists(p): continue
        t = ocr(p)
        hits = sorted({m.group(0).lower() for m in PAT.finditer(t)})
        if hits: print(f'{n:04d}.png', hits)
else:
    mp4, fps = sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else '2')
    d = tempfile.mkdtemp(prefix='ocrv'); subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp4, '-vf', f'fps={fps}', os.path.join(d, 'f%05d.png')], check=True)
    fs = sorted(os.listdir(d)); print('frames', len(fs)); bad = 0
    for f in fs:
        t = ocr(os.path.join(d, f)); hits = sorted({m.group(0).lower() for m in PAT.finditer(t)})
        if hits: bad += 1; print(f'{(int(f[1:6]) - 1) / float(fps):7.1f}s', hits)
    print('frames with hits:', bad)
