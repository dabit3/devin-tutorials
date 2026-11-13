import json, os, re, subprocess
from concurrent.futures import ThreadPoolExecutor
import numpy as np, pytesseract
from PIL import Image
# Frame-accurate pass: OCRs every near-uniform Computer-pane frame for loading/empty-state text -> loading.json.
# Catches one-frame "Loading screenshot..." flashes that blanks.py's 4 fps variance check misses.
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.environ.get("REEL_SRC", os.path.join(HERE, "sources"))
W, H, FPS, UNIFORM = 1920, 1080, 30, 0.75
PANE = (1050, 170, 1920, 1000)
KEY = re.compile(r"(?<!Re)(?<!re)loading|connecting to devin|browser history|screenshot\.\.", re.I)

def ocr(job):
    i, buf = job
    im = Image.fromarray(np.frombuffer(buf, np.uint8).reshape(H, W)).crop(PANE)
    return i, bool(KEY.search(pytesseract.image_to_string(im, config="--psm 11")))

def scan(name):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", os.path.join(SRC, name), "-vf",
                          f"fps={FPS},scale={W}:{H},format=gray", "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
    jobs, i = [], 0
    while len(b := p.stdout.read(W * H)) == W * H:
        pane = np.frombuffer(b, np.uint8).reshape(H, W)[180:990:2, 1060:1910:2].astype(np.int16)
        if np.mean(np.abs(pane - np.median(pane)) <= 6) > UNIFORM:
            jobs.append((i, b))
        i += 1
    with ThreadPoolExecutor(2) as ex:
        hits = [i for i, hit in ex.map(ocr, jobs) if hit]
    runs = []
    for i in hits:
        if runs and i - runs[-1][1] <= 2:
            runs[-1][1] = i
        else:
            runs.append([i, i])
    return [[round((a - 1) / FPS, 3), round((b + 2) / FPS, 3)] for a, b in runs]

out = {}
for name in sorted(f for f in os.listdir(SRC) if f.endswith(".mp4")):
    out[name] = scan(name)
    print(name, out[name], flush=True)
json.dump(out, open(os.path.join(HERE, "loading.json"), "w"), indent=1)
