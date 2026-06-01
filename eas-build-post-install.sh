#!/bin/bash
set -e

echo "[EAS] === CocoaPods Setup ==="
echo "[EAS] PATH: $PATH"
echo "[EAS] which ruby: $(which ruby 2>/dev/null || echo 'not found')"
echo "[EAS] ruby version: $(ruby --version 2>/dev/null || echo 'not found')"
echo "[EAS] GEM_HOME: $GEM_HOME"
echo "[EAS] gem env: $(gem env 2>/dev/null | grep -E 'EXECUTABLE|INSTALLATION' || echo 'gem not found')"

# pod 위치 찾기
POD_LOCATIONS=(
  "/opt/homebrew/lib/ruby/gems/3.3.0/bin/pod"
  "/opt/homebrew/lib/ruby/gems/3.2.0/bin/pod"
  "/opt/homebrew/lib/ruby/gems/3.1.0/bin/pod"
  "/usr/local/lib/ruby/gems/3.3.0/bin/pod"
  "/usr/local/lib/ruby/gems/3.2.0/bin/pod"
  "/Users/expo/.gem/ruby/3.3.0/bin/pod"
  "/Users/expo/.gem/ruby/3.2.0/bin/pod"
  "$(ruby -e 'require "rubygems"; puts Gem.bindir' 2>/dev/null)/pod"
)

FOUND_POD=""
for loc in "${POD_LOCATIONS[@]}"; do
  if [ -f "$loc" ]; then
    echo "[EAS] Found pod at: $loc"
    FOUND_POD="$loc"
    break
  fi
done

if [ -z "$FOUND_POD" ]; then
  echo "[EAS] pod not found in known locations, installing via gem..."
  gem install cocoapods --no-document
  FOUND_POD="$(ruby -e 'require "rubygems"; puts Gem.bindir' 2>/dev/null)/pod"
fi

if [ -f "$FOUND_POD" ]; then
  echo "[EAS] Symlinking pod to /usr/local/bin/pod"
  ln -sf "$FOUND_POD" /usr/local/bin/pod 2>/dev/null || cp "$FOUND_POD" /usr/local/bin/pod 2>/dev/null || true
fi

echo "[EAS] Final pod: $(which pod 2>/dev/null || echo 'NOT IN PATH')"
echo "[EAS] ==========================="
