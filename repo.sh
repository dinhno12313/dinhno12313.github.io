#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

command -v apt-ftparchive >/dev/null || {
  echo "apt-ftparchive is required (Debian/Ubuntu package: apt-utils)." >&2
  exit 1
}

apt-ftparchive packages ./pool > Packages
gzip -c9 Packages > Packages.gz
bzip2 -c9 Packages > Packages.bz2
xz -c9 Packages > Packages.xz
zstd -q -c19 Packages > Packages.zst

apt-ftparchive \
  -o APT::FTPArchive::Release::Origin="dinhnguyenx" \
  -o APT::FTPArchive::Release::Label="dinhnguyenx Repo" \
  -o APT::FTPArchive::Release::Suite="stable" \
  -o APT::FTPArchive::Release::Version="1.0" \
  -o APT::FTPArchive::Release::Codename="ios" \
  -o APT::FTPArchive::Release::Architectures="iphoneos-arm64" \
  -o APT::FTPArchive::Release::Components="main" \
  -o APT::FTPArchive::Release::Description="dinhnguyenx tweak repository for rootless iOS jailbreaks" \
  release . > Release

echo "Repository metadata updated."
