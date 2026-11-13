import re, subprocess, sys
# Usage: python3 verify.py 121-conference-reel.mp4  (prints HIT lines for any loading/empty-state frame; none means clean)
from concurrent.futures import ThreadPoolExecutor
import numpy as np, pytesseract
from PIL import Image
# Frame-accurate: every output frame whose Computer pane is mostly uniform gets OCR'd for loading/empty-state text
W, H, UNIFORM = 1920, 1080, 0.6
KEY = re.compile(r"(?<![Rr]e)loading|onnecting to|browser history|creenshot\.|o browser", re.I)
def ocr(job):
    i, buf = job
    im = Image.fromarray(np.frombuffer(buf, np.uint8).reshape(H, W)).crop((1050, 170, W, 1000))
    return i, [l for l in pytesseract.image_to_string(im, config="--psm 11").split("\n") if KEY.search(l)]
p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
i, n, batch, last, same = 0, 0, [], None, {}
def flush(ex):
    for j, m in ex.map(ocr, batch):
        for k in [j] + same.pop(j, []):
            if m: print(f"HIT {k} {k/30:.3f} {m}", flush=True)
    batch.clear()
with ThreadPoolExecutor(2) as ex:
    while len(b := p.stdout.read(W * H)) == W * H:
        pane = np.frombuffer(b, np.uint8).reshape(H, W)[180:990:2, 1060:1910:2].astype(np.int16)
        if np.mean(np.abs(pane - np.median(pane)) <= 6) > UNIFORM:
            # a frame whose pane matches the last OCR'd frame to within 1 gray level gets that frame's result
            if last is not None and np.abs(pane - last[1]).max() <= 1 and last[0] in same:
                same[last[0]].append(i)
            else:
                batch.append((i, b)); n += 1; last = (i, pane); same[i] = []
        else:
            last = None
            if len(batch) >= 64: flush(ex)
        i += 1
        if i % 3000 == 0: print("frame", i, flush=True)
    flush(ex)
print("scanned", n, "of", i, flush=True)
