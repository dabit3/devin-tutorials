import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import wave

import numpy as np


SPEC = importlib.util.spec_from_file_location('render_master', Path(__file__).with_name('render-master.py'))
render = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(render)


class RenderTest(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.root = Path(directory.name)
        self.vo = self.root / 'vo'
        self.vo.mkdir()
        self.build = self.root / 'build'
        for name, value in [('ROOT', self.root), ('VO', self.vo), ('BUILD', self.build)]:
            patcher = patch.object(render, name, value)
            patcher.start()
            self.addCleanup(patcher.stop)

    def wav(self, n, count, rate=48000):
        path = self.vo / (f'line{n:02}-01.png.wav' if n else '_full-take.wav')
        with wave.open(str(path), 'wb') as output:
            output.setparams((1, 2, rate, 0, 'NONE', 'not compressed'))
            output.writeframes(np.arange(count, dtype='<i2').tobytes())
        return path

    def fixture_plan(self):
        voices, entries = {}, []
        for n, duration in [(27, 7.315), (28, 5.01)]:
            voices[f'line{n:02}-01.png'] = {'dur': duration, 'text': f'line {n}'}
            sidecar = self.root / f'{n}.json'
            sidecar.write_text(json.dumps({'video': f'{n}.mp4', 'timing': {'frames': 1000}}))
            entries.append({'line': n, 'sources': [{'stem': str(n), 'sidecar': str(sidecar),
                            'window': 'desktop', 'voice': [0, duration], 'source': [0, duration]}]})
        (self.vo / 'lines.json').write_text(json.dumps(voices))
        (self.root / 'final-accepted-inventory.json').write_text(json.dumps({'lines': entries}))

    def test_current_wav_overrides_stale_duration_and_positions_next_line(self):
        self.fixture_plan()
        self.wav(27, 251891)
        timeline = render.plan()
        first, following = timeline['lines']
        self.assertAlmostEqual(first['voiceSeconds'], 5.248, places=3)
        self.assertEqual(first['voiceFrames'], 158)
        self.assertEqual(following['startFrame'], 170)

    def test_missing_clip_uses_metadata_duration(self):
        self.assertEqual(render.voice_duration(28, {'dur': 5.01}), 5.01)

    def test_empty_clip_is_rejected(self):
        self.wav(27, 0)
        with self.assertRaises(AssertionError):
            render.voice_duration(27, {'dur': 7.315})

    def test_invalid_clip_format_is_rejected(self):
        self.wav(27, 100, rate=44100)
        with self.assertRaises(AssertionError):
            render.voice_duration(27, {'dur': 7.315})


if __name__ == '__main__':
    unittest.main()
