import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import unittest


HERE = Path(__file__).resolve().parent


class AssemblyTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        (self.root / 'shots').mkdir()
        shutil.copyfile(HERE / 'assemble.py', self.root / 'assemble.py')
        self.script = (HERE / 'script.md').read_text()
        (self.root / 'script.md').write_text(self.script)
        tags = {tag.strip() for group in re.findall(r'^\d+\. \[([^]]+)\]', self.script, re.M)
                for tag in group.split(',')}
        self.captures = [{'id': tag, 'img': 'fixture.png',
                          'hlBox': {'x': 720, 'y': 405, 'w': 100, 'h': 100}} for tag in tags]
        (self.root / 'shots/fixture.png').write_bytes(b'fixture-copy-test')
        self.write_captures()

    def write_captures(self):
        (self.root / 'shots/production-beats.json').write_text(json.dumps(self.captures))

    def run_assembly(self):
        return subprocess.run([sys.executable, str(self.root / 'assemble.py')], capture_output=True, text=True)

    def test_exact_script_and_equal_parts(self):
        result = self.run_assembly()
        self.assertEqual(result.returncode, 0, result.stderr)
        lines = json.loads((self.root / 'film-lines.json').read_text())
        cards = json.loads((self.root / 'cards.json').read_text())
        beats = json.loads((self.root / 'shots/beats.json').read_text())
        spec = json.loads((self.root / 'spec.js').read_text().removeprefix('window.SPEC = ').strip().removesuffix(';'))
        self.assertEqual(len(lines), 51)
        self.assertEqual(len(cards), 11)
        self.assertEqual([l['text'] for l in lines], re.findall(r'^\d+\. \[[^]]+\] (.+)$', self.script, re.M))
        self.assertEqual(sum('vo' in e for e in spec['edit'].values()), 51)
        self.assertTrue(spec['noSubs'] and spec['noCaps'])
        for line in lines:
            self.assertEqual(len({p['frames'] for p in line['parts']}), 1)
        for beat in beats:
            if 'line' not in beat:
                continue
            self.assertEqual(beat['travel'], 0)
            self.assertEqual(beat['dwell'], beat['hold'])
            self.assertTrue(beat['cursor'] and beat['hl'])
            self.assertEqual((self.root / 'shots' / beat['img']).read_bytes(), b'fixture-copy-test')

    def test_empty_script_is_rejected(self):
        (self.root / 'script.md').write_text('')
        result = self.run_assembly()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('AssertionError', result.stderr)

    def test_missing_capture_is_rejected(self):
        self.captures = []
        self.write_captures()
        result = self.run_assembly()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('KeyError', result.stderr)


if __name__ == '__main__':
    unittest.main()
