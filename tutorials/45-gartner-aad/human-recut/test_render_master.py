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

    def prepare_fixture(self, count):
        voices, lines = {}, []
        for n in range(1, count + 1):
            voices[f'line{n:02}-01.png'] = {'text': f'line {n}', 'dur': .005,
                                         'at': (n - 1) * .005, 'end': n * .005}
            lines.append({'line': n, 'startFrame': n - 1, 'voiceSeconds': .005})
        (self.vo / 'lines.json').write_text(json.dumps(voices))
        (self.vo / 'full-take-lines.json').write_text(json.dumps(voices))
        return {'frames': count, 'lines': lines, 'seconds': count / 30}

    def test_all_51_clips_need_no_full_take(self):
        timeline = self.prepare_fixture(51)
        for n in range(1, 52):
            self.wav(n, 240)
        render.prepare(timeline)
        provenance = json.loads((self.build / 'audio-provenance.json').read_text())
        self.assertEqual(len(provenance), 51)
        self.assertTrue(all(p['samples'] == 240 and '_full-take' not in p['origin'] for p in provenance))
        self.assertFalse((self.vo / '_full-take.wav').exists())

    def test_missing_clips_load_full_take_once_and_preserve_export_fade(self):
        timeline = self.prepare_fixture(3)
        self.wav(1, 240)
        full = self.wav(0, 720)
        with patch.object(render.wave, 'open', wraps=wave.open) as opened:
            render.prepare(timeline)
        self.assertEqual(sum(call.args == (str(full), 'rb') for call in opened.call_args_list), 1)
        with wave.open(str(self.build / 'vo/line02-01.png.wav'), 'rb') as clip:
            samples = np.frombuffer(clip.readframes(clip.getnframes()), '<i2')
        expected = np.arange(240, 480, dtype='<i2')
        for j in range(240):
            expected[-1-j] = int(int(expected[-1-j]) * j / 240)
        np.testing.assert_array_equal(samples, expected)

    def test_missing_clip_and_full_take_fail_clearly(self):
        timeline = self.prepare_fixture(1)
        with self.assertRaises(FileNotFoundError) as failure:
            render.prepare(timeline)
        self.assertEqual(Path(failure.exception.filename).name, '_full-take.wav')

    def test_empty_full_take_cannot_supply_missing_clip(self):
        timeline = self.prepare_fixture(1)
        self.wav(0, 0)
        with self.assertRaises(AssertionError):
            render.prepare(timeline)

    def test_missing_line27_never_falls_back_even_with_matching_manifest(self):
        timeline = self.prepare_fixture(27)
        for n in range(1, 27):
            self.wav(n, 240)
        full = self.wav(0, 27 * 240)
        with patch.object(render.wave, 'open', wraps=wave.open) as opened:
            with self.assertRaisesRegex(FileNotFoundError, 'line27-01.png.wav; line 27 cannot fall back'):
                render.prepare(timeline)
        self.assertFalse(any(call.args == (str(full), 'rb') for call in opened.call_args_list))

    def test_changed_text_cannot_fall_back(self):
        timeline = self.prepare_fixture(1)
        voices = json.loads((self.vo / 'lines.json').read_text())
        voices['line01-01.png']['text'] = 'Replacement narration'
        (self.vo / 'lines.json').write_text(json.dumps(voices))
        with self.assertRaisesRegex(ValueError, 'Line 1 text does not match the full-take manifest'):
            render.prepare(timeline)

    def test_missing_manifest_entry_cannot_fall_back(self):
        timeline = self.prepare_fixture(1)
        (self.vo / 'full-take-lines.json').write_text('{}')
        with self.assertRaisesRegex(ValueError, 'Line 1 text does not match the full-take manifest'):
            render.prepare(timeline)

    def test_missing_manifest_file_cannot_fall_back(self):
        timeline = self.prepare_fixture(1)
        (self.vo / 'full-take-lines.json').unlink()
        with self.assertRaises(FileNotFoundError) as failure:
            render.prepare(timeline)
        self.assertEqual(Path(failure.exception.filename).name, 'full-take-lines.json')

    def test_fallback_uses_original_offsets_not_current_clip_offsets(self):
        timeline = self.prepare_fixture(2)
        self.wav(1, 240)
        self.wav(0, 480)
        voices = json.loads((self.vo / 'lines.json').read_text())
        voices['line02-01.png'].update(at=0, end=.005)
        (self.vo / 'lines.json').write_text(json.dumps(voices))
        render.prepare(timeline)
        provenance = json.loads((self.build / 'audio-provenance.json').read_text())
        self.assertIn('[0.005,0.01]', provenance[1]['origin'])


if __name__ == '__main__':
    unittest.main()
