import ast
from pathlib import Path
import unittest

import numpy as np


class AudioMixTest(unittest.TestCase):
    def setUp(self):
        source = Path(__file__).resolve().parents[1] / '_kit/tools/audio.py'
        function = next(n for n in ast.parse(source.read_text()).body
                        if isinstance(n, ast.FunctionDef) and n.name == 'add')
        self.scope = {'np': np, 'SR': 48000, 'N': 96000,
                      'L': np.zeros(96000), 'R': np.zeros(96000)}
        exec(compile(ast.Module(body=[function], type_ignores=[]), str(source), 'exec'), self.scope)

    def test_zero_intro_swell_trims_only_negative_samples(self):
        signal = np.arange(52800, dtype=float)
        self.scope['add'](signal, -0.25, 0.05)
        expected = np.zeros(96000)
        expected[:40800] = signal[12000:] * 0.05 * np.sqrt(0.5)
        np.testing.assert_array_equal(self.scope['L'], expected)
        np.testing.assert_array_equal(self.scope['R'], expected)

    def test_positive_start_preserves_gain_and_pan(self):
        signal = np.arange(200, dtype=float)
        self.scope['add'](signal, 0.25, 0.7, -0.4)
        for channel, pan in [('L', -0.4), ('R', 0.4)]:
            expected = np.zeros(96000)
            expected[12000:12200] = signal * 0.7 * np.sqrt(0.5 * (1 - pan))
            np.testing.assert_array_equal(self.scope[channel], expected)

    def test_empty_or_outside_signal_is_silent(self):
        for signal, start in [(np.ones(10), -1), (np.ones(10), 3), (np.array([]), 0)]:
            self.scope['add'](signal, start)
        self.assertFalse(self.scope['L'].any())
        self.assertFalse(self.scope['R'].any())

    def test_signal_is_trimmed_at_output_end(self):
        self.scope['add'](np.ones(96000), 1)
        self.assertFalse(self.scope['L'][:48000].any())
        np.testing.assert_array_equal(self.scope['L'][48000:], np.full(48000, np.sqrt(0.5)))


if __name__ == '__main__':
    unittest.main()
