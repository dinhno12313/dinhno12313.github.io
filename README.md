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

The APT metadata and the browser UI are intentionally separate:

```text
pool/                   Installable .deb packages
data/packages.json      Package catalog shown on the website
assets/css/style.css    Shared visual styles
assets/js/app.js        Catalog, search, and package-detail rendering
assets/images/          Optional logo and package artwork
index.html              Repository landing page
package.html            Reusable package-detail page
repo.sh                 APT index generator
```

To publish a new tweak or version:

1. Put the new `.deb` file in `pool/`.
2. Add or update its entry in `data/packages.json`.
3. Push both files to `main`.

GitHub Actions automatically regenerates `Packages`, its compressed variants,
and `Release` when files under `pool/` change. To generate them manually, run
`./repo.sh` on Debian/Ubuntu with `apt-ftparchive`, `zstd`, `xz`, and `bzip2`.

## Custom logo

Put a square PNG, JPG, or WebP file in the repository, for example
`assets/images/logo.png`, then set `repository.logoUrl` in
`data/packages.json`:

```json
"brandMark": "d",
"logoUrl": "assets/images/logo.png"
```

Leave `logoUrl` empty to use `brandMark` as the fallback. If the image cannot
be loaded, the fallback is restored automatically.
