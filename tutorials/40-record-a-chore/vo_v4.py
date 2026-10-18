"""One-off: run _kit/tools/vo_onetake.py, but send each TTS request as {text, model_id} only (no seed, no
voice_settings) so the voice's saved defaults apply, and log the model_id of every request.
usage (from tutorials/): VO_MODEL=eleven_v4 python3 40-record-a-chore/vo_v4.py <video-dir> <voice-id>"""
import json, os, runpy, sys, urllib.request

_Request = urllib.request.Request
def Request(url, data=None, headers={}, **kw):
    if '/text-to-speech/' in url and data:
        body = json.loads(data)
        body = {'text': body['text'], 'model_id': body['model_id']}
        print(f'TTS request: model_id={body["model_id"]} keys={sorted(body)} chars={len(body["text"])}', flush=True)
        data = json.dumps(body).encode()
    return _Request(url, data=data, headers=headers, **kw)
urllib.request.Request = Request

kit = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_kit', 'tools', 'vo_onetake.py')
sys.argv = [kit] + sys.argv[1:]
runpy.run_path(kit, run_name='__main__')
