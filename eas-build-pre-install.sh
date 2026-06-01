#!/bin/bash
set -e

echo "[EAS] Installing CocoaPods..."
gem install cocoapods --no-document
echo "[EAS] CocoaPods installed: $(pod --version)"
