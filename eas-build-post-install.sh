#!/bin/bash
set -e

echo "[EAS] Setting up CocoaPods..."

# Homebrew로 설치 (이미 있으면 link만)
if brew list cocoapods &>/dev/null; then
  echo "[EAS] CocoaPods already installed via brew, linking..."
  brew link --overwrite cocoapods 2>/dev/null || true
else
  echo "[EAS] Installing CocoaPods via brew..."
  brew install cocoapods
fi

echo "[EAS] pod path: $(which pod)"
echo "[EAS] pod version: $(pod --version)"
