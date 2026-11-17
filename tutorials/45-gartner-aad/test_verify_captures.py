import json
from pathlib import Path
import shutil
import struct
import subprocess
import tempfile
import unittest


HERE = Path(__file__).resolve().parent


class CaptureVerificationTest(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.root = Path(directory.name)
        for name in ['verify-captures.mjs', 'direct-page.mjs', 'issue-38-plan-original.md',
                     'issue-38-plan-edited.md']:
            shutil.copyfile(HERE / name, self.root / name)
        for surface in ['web', 'desktop']:
            target = self.root / 'shots' / surface
            target.mkdir(parents=True)
            shutil.copyfile(HERE / 'shots' / surface / 'beats.json', target / 'beats.json')
            for beat in json.loads((target / 'beats.json').read_text()):
                (target / beat['img']).write_bytes(b'\x89PNG' + bytes(12) + struct.pack('>II', 3840, 2160))
        self.manifest = (HERE / 'shots/production-beats.json').read_bytes()
        (self.root / 'shots/production-beats.json').write_bytes(self.manifest)
        (self.root / 'prep-evidence.json').write_text('preserve historical evidence')

    def verify(self):
        result = subprocess.run(['node', str(self.root / 'verify-captures.mjs'), '--captures-only'],
                                capture_output=True, text=True)
        self.assertEqual((self.root / 'shots/production-beats.json').read_bytes(), self.manifest)
        self.assertEqual((self.root / 'prep-evidence.json').read_text(), 'preserve historical evidence')
        return result

    def test_valid_captures_do_not_change_curated_manifest(self):
        result = self.verify()
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_empty_captures_fail_without_writing(self):
        for surface in ['web', 'desktop']:
            (self.root / 'shots' / surface / 'beats.json').write_text('[]')
        result = self.verify()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Missing S1-01', result.stderr)

    def test_invalid_png_fails_without_writing(self):
        for path in (self.root / 'shots/web').glob('*.png'):
            path.write_bytes(b'not a PNG')
        result = self.verify()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('AssertionError', result.stderr)


if __name__ == '__main__':
    unittest.main()
