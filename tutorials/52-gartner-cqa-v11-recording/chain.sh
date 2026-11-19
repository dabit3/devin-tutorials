#!/bin/bash
# usage: chain.sh s1 s2 ... ; records, edits, deletes raw
cd ~/vdisp
for t in "$@"; do
  echo "== $t $(date +%T)"
  node $t.mjs 2>&1 | grep -v -E "objc|IOService" | tail -4 | cut -c1-300
  if python3 edit.py $t > /tmp/edit_$t.log 2>&1; then tail -1 /tmp/edit_$t.log; rm -f ~/gartner/v11/raw/$t.mov; else echo "edit failed for $t; raw kept"; tail -3 /tmp/edit_$t.log; fi
  df -h ~ | tail -1 | awk '{print "disk free", $4}'
done
echo "== CHAIN DONE $(date +%T)"
