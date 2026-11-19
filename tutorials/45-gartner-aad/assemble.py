"""Compatibility entry point for the native-footage renderer, not a still assembler."""
from pathlib import Path
import runpy


if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).resolve().parent / 'human-recut/render-master.py'), run_name='__main__')
