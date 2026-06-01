#!/bin/bash
set -e

echo "[EAS] Installing bundler and cocoapods..."
gem install bundler --no-document
gem install cocoapods --no-document
echo "[EAS] pod version: $(pod --version)"

echo "[EAS] Running bundle install..."
bundle install
echo "[EAS] Done"
