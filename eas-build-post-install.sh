#!/bin/bash
set -e

echo "[EAS] === post-install: CocoaPods via bundler ==="

# expo prebuild 이후 실행되므로 ios/Gemfile이 없을 수 있음 — 항상 재생성
mkdir -p ios

cat > ios/Gemfile << 'GEMFILE'
source "https://rubygems.org"

gem "cocoapods", "~> 1.16"
GEMFILE

echo "[EAS] Running bundle install in ios/..."
cd ios
bundle install
echo "[EAS] bundle exec pod version: $(bundle exec pod --version)"
cd ..

echo "[EAS] ================================================"
