# dinhnguyenx Repo

APT repository for installing dinhnguyenx tweaks through Sileo on rootless jailbreaks.

## Add to Sileo

Repository URL:

```text
https://dinhno12313.github.io/
```

[Add to Sileo](sileo://source/https://dinhno12313.github.io/)

## Packages

- ZoneAODFix 0.1.6 (`iphoneos-arm64`)

The tweak source code is available at [dinhno12313/ZoneAODFix](https://github.com/dinhno12313/ZoneAODFix).

## Updating the repository

Place new `.deb` files in `pool/`, then run `./repo.sh` on a Debian/Ubuntu environment with `apt-ftparchive`, `zstd`, `xz`, and `bzip2` installed. GitHub Actions also regenerates the indexes automatically when packages under `pool/` change.
