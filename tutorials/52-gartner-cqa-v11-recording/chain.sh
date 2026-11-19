#!/bin/bash
# usage: chain.sh s1 s2 ... ; records, edits, deletes raw
cd ~/vdisp
for t in "$@"; do
  echo "== $t $(date +%T)"
  node $t.mjs 2>&1 | grep -v -E "objc|IOService" | tail -4 | cut -c1-300
  python3 edit.py $t 2>&1 | grep -v IOService | tail -1 && rm -f ~/gartner/v11/raw/$t.mov
  df -h ~ | tail -1 | awk '{print "disk free", $4}'
done
echo "== CHAIN DONE $(date +%T)"
