#!/usr/bin/env bash

set -euo pipefail

die() {
    printf '%s: %s\n' "$0" "$1" >&2
    exit 1
}

[[ ${BASH_SOURCE[0]} -ef scripts/update-phar.sh ]] ||
    die "must run from root of package folder"

version=${1-${npm_package_version-}}

[[ -n $version ]] ||
    die "error getting package version"

version=v${version#v}
printf 'downloading pretty-php.phar %s\n' "$version"
mkdir -p bin
curl -fsSLRo bin/pretty-php.phar "https://github.com/lkrms/pretty-php/releases/download/$version/pretty-php.phar"
chmod a+x bin/pretty-php.phar

printf 'downloading prettyphp-schema.json %s\n' "$version"
mkdir -p resources
curl -fsSRo resources/prettyphp-schema.json "https://raw.githubusercontent.com/lkrms/pretty-php/$version/resources/prettyphp-schema.json"
