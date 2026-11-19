from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


HERE = Path(__file__).resolve().parent


class RebuildEntryPointTest(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.root = Path(directory.name)
        for name in ['assemble.py', 'build-film.sh']:
            shutil.copyfile(HERE / name, self.root / name)
        (self.root / 'human-recut').mkdir()
        (self.root / 'human-recut/render-master.py').write_text(
            "import sys; print('HUMAN_REBUILD', sys.argv[1:])\n")

    def run_assembly(self):
        return subprocess.run([sys.executable, str(self.root / 'assemble.py'), '--prepare-only'],
                              capture_output=True, text=True)

    def test_descriptive_labels_are_not_capture_ids(self):
        (self.root / 'script.md').write_text('1. [On Screen: Native IDE, terminal] Narration.\n')
        result = self.run_assembly()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("HUMAN_REBUILD ['--prepare-only']", result.stdout)
        self.assertFalse((self.root / 'film-lines.json').exists())

    def test_empty_or_missing_script_is_not_an_assembly_input(self):
        for script in [None, '']:
            with self.subTest(script=script):
                if script is not None:
                    (self.root / 'script.md').write_text(script)
                result = self.run_assembly()
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIn('HUMAN_REBUILD', result.stdout)

    def test_renderer_failure_is_propagated(self):
        (self.root / 'human-recut/render-master.py').write_text("raise SystemExit('missing source take')\n")
        result = self.run_assembly()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('missing source take', result.stderr)

    def test_shell_build_forwards_to_human_renderer(self):
        result = subprocess.run(['bash', str(self.root / 'build-film.sh'), '--prepare-only'],
                                capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("HUMAN_REBUILD ['--prepare-only']", result.stdout)


if __name__ == '__main__':
    unittest.main()
