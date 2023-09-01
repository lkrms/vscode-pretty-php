#!/usr/bin/env bash

set -euo pipefail

die() {
    printf '%s: %s\n' "$0" "$1" >&2
    exit 1
}

[[ ${BASH_SOURCE[0]} -ef scripts/update-changelog.sh ]] ||
    die "must run from root of package folder"

printf 'downloading changelog.phar\n'
mkdir -p build
curl -fsSLRo build/changelog.phar "https://github.com/salient-labs/php-changelog/releases/latest/download/changelog.phar"
chmod a+x build/changelog.phar

build/changelog.phar \
    --releases=yes --releases=yes \
    --missing=yes --missing=no \
    --name "PrettyPHP for Visual Studio Code" --name "PrettyPHP" \
    --output CHANGELOG.md \
    lkrms/vscode-pretty-php lkrms/pretty-php
