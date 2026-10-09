# Tutorial 30, variant 2 music. Runs inside _kit/tools/audio.py. Five synthesized beds, all locked to the edit in
# scenes.js (window lands 3.4 s, switch flips on 7.0 s, hover card lands 10.0 s, end lockup 12.6 s):
#   1-synthpop  2-futurebass  3-indiestomp  4-marimba  5-cinematic      pick one with MUSIC=<name>
MUSIC = os.environ.get('MUSIC', '1-synthpop')
exec(open(os.path.join(VD, 'music', 'lib.py')).read(), globals())
exec(open(os.path.join(VD, 'music', MUSIC + '.py')).read(), globals())
