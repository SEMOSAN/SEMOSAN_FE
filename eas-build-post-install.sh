#!/bin/bash
set -e

echo "[EAS] Setting up CocoaPods..."

if which pod 2>/dev/null; then
  echo "[EAS] pod already in PATH: $(which pod)"
  pod --version
  exit 0
fi

# Ruby Gems에서 pod 위치 찾기
GEM_BINDIR=$(ruby -e "require 'rubygems'; puts Gem.bindir" 2>/dev/null || echo "")
echo "[EAS] GEM_BINDIR: $GEM_BINDIR"

if [ -n "$GEM_BINDIR" ] && [ -f "$GEM_BINDIR/pod" ]; then
  echo "[EAS] Found pod at: $GEM_BINDIR/pod"
else
  echo "[EAS] pod not found in gems, installing..."
  gem install cocoapods --no-document
  GEM_BINDIR=$(ruby -e "require 'rubygems'; puts Gem.bindir" 2>/dev/null || echo "")
fi

# /usr/local/bin으로 복사 (eas.json PATH에 포함된 경로)
if [ -n "$GEM_BINDIR" ] && [ -f "$GEM_BINDIR/pod" ]; then
  cp "$GEM_BINDIR/pod" /usr/local/bin/pod
  chmod +x /usr/local/bin/pod
  echo "[EAS] Copied pod to /usr/local/bin/pod"
fi

echo "[EAS] pod: $(which pod 2>/dev/null || echo 'NOT FOUND')"
echo "[EAS] pod version: $(pod --version 2>/dev/null || echo 'FAILED')"
