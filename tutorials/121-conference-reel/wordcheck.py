import re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
import numpy as np, pytesseract
from PIL import Image
# Usage: python3 wordcheck.py 121-conference-reel.mp4 "pul[s5]e" [step]  (prints HIT lines for frames whose text matches; none means clean)
# Full-frame OCR every STEP-th frame (plus any frame that changes sharply since the last OCR'd one) for a word
f, word, step = sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 10
W, H = 1920, 1080
KEY = re.compile(word, re.I)
def ocr(job):
    i, buf = job
    s = pytesseract.image_to_string(Image.fromarray(np.frombuffer(buf, np.uint8).reshape(H, W)), config="--psm 11")
    return i, [l for l in s.split("\n") if KEY.search(l)]
p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", f, "-vf", f"fps=30,scale={W}:{H},format=gray", "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
i, n, batch, last = 0, 0, [], None
def flush(ex):
    for j, m in ex.map(ocr, batch):
        if m: print(f"HIT {j} {j/30:.3f} {m}", flush=True)
    batch.clear()
with ThreadPoolExecutor(2) as ex:
    while len(b := p.stdout.read(W * H)) == W * H:
        small = np.frombuffer(b, np.uint8).reshape(H, W)[::4, ::4].astype(np.int16)
        if i % step == 0 or last is None or np.mean(np.abs(small - last) > 40) > 0.02:
            batch.append((i, b)); n += 1; last = small
            if len(batch) >= 32: flush(ex)
        i += 1
        if i % 1500 == 0: print("frame", i, "ocr", n, flush=True)
    flush(ex)
print("scanned", n, "of", i, flush=True)
