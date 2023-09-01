#!/usr/bin/env bash

set -euo pipefail

die() {
    printf '%s: %s\n' "$0" "$1" >&2
    exit 1
}

[[ ${BASH_SOURCE[0]} -ef scripts/check-phar.sh ]] ||
    die "must run from root of package folder"

version=${1-${npm_package_version-}}
version=v${version#v}

[[ -n $version ]] ||
    die "error getting package version"

bin/pretty-php.phar --version | grep -F "pretty-php $version-" >/dev/null ||
    die "invalid bin/pretty-php.phar"
